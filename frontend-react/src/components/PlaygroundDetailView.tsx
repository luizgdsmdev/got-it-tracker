import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Users,
  PieChart,
  FolderLock,
  Layers
} from 'lucide-react';
import { Person, Transaction, GlobalSettings, Playground } from '../types';
import { translations } from '../translations';
import { filterTransactionsByStatus } from '../utils';
import { StatusFilterValue } from './common/ApprovalStatusFilter';
import { getAuthUser, isAuthenticated } from '../services/api';
import {
  getPlaygroundTransactionsApi,
  mapApiTransactionToFrontend,
} from '../services/transactionService';
import {
  getAllMembersByPlaygroundApi,
  createMemberApi,
  inviteUserApi,
  deleteMemberApi,
  getRoleName,
  PlaygroundMemberApiItem,
} from '../services/playgroundMemberService';

// Subcomponents
import PlaygroundHero from './playground/PlaygroundHero';
import PlaygroundOverviewTab from './playground/PlaygroundOverviewTab';
import PlaygroundMembersTab from './playground/PlaygroundMembersTab';
import PlaygroundReportsTab from './playground/PlaygroundReportsTab';
import PlaygroundLimitsTab from './playground/PlaygroundLimitsTab';

interface PlaygroundDetailViewProps {
  playground: Playground;
  people: Person[];
  transactions: Transaction[];
  settings: GlobalSettings;
  onUpdatePlayground: (updatedPlayground: Playground) => void;
  onToggleApproval?: (playgroundId: string) => void;
  onNavigate: (screen: string) => void;
  onAddPerson?: (person: Omit<Person, 'id' | 'initials' | 'colorTheme'> | Person) => void;
  addToast?: (toast: any) => void;
  onSelectTransaction?: (tx: Transaction) => void;
  lang: 'pt' | 'en';
}

type TabId = 'overview' | 'members' | 'reports' | 'limits';

export default function PlaygroundDetailView({
  playground,
  people,
  transactions,
  settings,
  onUpdatePlayground,
  onToggleApproval,
  onNavigate,
  onAddPerson,
  addToast,
  onSelectTransaction,
  lang,
}: PlaygroundDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [fetchedApiMembers, setFetchedApiMembers] = useState<Person[]>([]);
  const [hasFetchedMembers, setHasFetchedMembers] = useState(false);
  const [isLoadingApiMembers, setIsLoadingApiMembers] = useState(false);

  const [fetchedApiTransactions, setFetchedApiTransactions] = useState<Transaction[] | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const t = translations[lang];

  // Fetch all transactions for this playground using GetPlaygroundTransactions
  useEffect(() => {
    if (!playground?.id || !isAuthenticated()) {
      setFetchedApiTransactions(null);
      return;
    }
    let isMounted = true;
    setIsLoadingTransactions(true);

    getPlaygroundTransactionsApi(playground.id)
      .then((apiTxs) => {
        if (!isMounted) return;
        if (Array.isArray(apiTxs)) {
          const mapped = apiTxs.map(mapApiTransactionToFrontend);
          setFetchedApiTransactions(mapped);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFetchedApiTransactions(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingTransactions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [playground?.id]);

  // Fetch playground members using AllMembersByPlaygroundID
  useEffect(() => {
    if (!playground?.id) return;
    let isMounted = true;
    setIsLoadingApiMembers(true);

    getAllMembersByPlaygroundApi(playground.id)
      .then((memberItems) => {
        if (!isMounted) return;
        if (!Array.isArray(memberItems) || memberItems.length === 0) {
          setFetchedApiMembers([]);
          setHasFetchedMembers(true);
          return;
        }

        const authUser = getAuthUser();
        const currentUserId = authUser?.id || '';

        const resolvedList: Person[] = memberItems.map((item) => {
          const isCurrentUser = currentUserId && item.personId.toLowerCase() === currentUserId.toLowerCase();
          const fallbackName = isCurrentUser
            ? (lang === 'pt' ? 'Você' : 'You')
            : `Pessoa (${item.personId.substring(0, 6)})`;
          const resolvedName = item.name
            ? (isCurrentUser ? (lang === 'pt' ? 'Você' : 'You') : item.name)
            : fallbackName;
          const resolvedAge = item.age ?? 25;
          const resolvedRoleNum = item.role ?? 1;
          const resolvedIsAdmin = item.isAdmin ?? false;

          const initials =
            resolvedName
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'MB';

          const existingPerson = people.find((p) => p.id === item.personId);

          return {
            id: item.personId,
            name: resolvedName,
            initials: existingPerson?.initials || initials,
            age: resolvedAge,
            role: getRoleName(resolvedRoleNum, lang),
            tag: existingPerson?.tag || `${item.personId.substring(0, 4)}-M`,
            spendingLimit: existingPerson?.spendingLimit || (resolvedAge < 18 ? 250 : 1500),
            permissionEnabled: true,
            email: existingPerson?.email,
            avatarUrl: existingPerson?.avatarUrl,
            colorTheme:
              existingPerson?.colorTheme ||
              (resolvedIsAdmin ? 'bg-[#e2dfff] text-[#100563]' : 'bg-slate-100 text-slate-700'),
          };
        });

        if (isMounted) {
          setFetchedApiMembers(resolvedList);
          setHasFetchedMembers(true);
        }
      })
      .catch((err) => {
        console.warn('getAllMembersByPlaygroundApi error:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingApiMembers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [playground?.id, people, lang]);

  // Resolve members: preference to fetchedApiMembers if loaded, fallback to people filtered by memberIds
  const currentMemberIds = playground?.memberIds || [];
  const fallbackMembers = people.filter((p) => currentMemberIds.includes(p.id));
  const playgroundMembers = hasFetchedMembers ? fetchedApiMembers : fallbackMembers;
  const nonMembers = people.filter((p) => !currentMemberIds.includes(p.id));

  const [heroStatusFilter, setHeroStatusFilter] = useState<StatusFilterValue>('approved');

  // Scoped transactions: combining API playground transactions with local transactions
  const localPlaygroundTxs = transactions.filter(
    (tr) => playground?.id && tr.playgroundId === playground.id
  );

  const playgroundTransactions = React.useMemo(() => {
    let rawList: Transaction[] = [];
    if (fetchedApiTransactions === null) {
      rawList = localPlaygroundTxs;
    } else {
      const globalTxMap = new Map(transactions.map((t) => [t.id, t]));
      const txMap = new Map<string, Transaction>();

      // Use all transactions returned by /api/transactions/playground/{playgroundId}
      fetchedApiTransactions.forEach((tx) => {
        const updated = globalTxMap.get(tx.id);
        txMap.set(tx.id, updated || tx);
      });

      // Include local transactions if any
      localPlaygroundTxs.forEach((tx) => {
        if (!txMap.has(tx.id)) {
          txMap.set(tx.id, tx);
        }
      });

      rawList = Array.from(txMap.values());
    }
    // Return all transactions (approved, pending, rejected)
    return rawList;
  }, [fetchedApiTransactions, localPlaygroundTxs, transactions]);

  // Counts of transactions by status for this playground
  const heroCounts = React.useMemo(() => {
    return {
      all: playgroundTransactions.length,
      approved: playgroundTransactions.filter((t) => t.approvalStatus === 1 || t.approvalStatus === undefined).length,
      pending: playgroundTransactions.filter((t) => t.approvalStatus === 0).length,
      rejected: playgroundTransactions.filter((t) => t.approvalStatus === 2).length,
    };
  }, [playgroundTransactions]);

  // Transactions filtered for Big Numbers hero calculation
  const playgroundTransactionsForHero = React.useMemo(() => {
    return filterTransactionsByStatus(playgroundTransactions, heroStatusFilter);
  }, [playgroundTransactions, heroStatusFilter]);

  // Compute stats for Big Numbers
  const playgroundExpenses = playgroundTransactionsForHero.filter((tr) => tr.type === 'expense');
  const playgroundIncomes = playgroundTransactionsForHero.filter((tr) => tr.type === 'income');

  const totalExpense = playgroundExpenses.reduce((sum, tr) => sum + tr.value, 0);
  const totalIncome = playgroundIncomes.reduce((sum, tr) => sum + tr.value, 0);
  const playgroundBalance = ((playground?.balance) || 0) + (totalIncome - totalExpense);

  // Progress calculations
  const progressPercent = playground?.target
    ? Math.min(100, Math.round((playgroundBalance / playground.target) * 100))
    : 0;

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  playgroundExpenses.forEach((tr) => {
    const cat = tr.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + tr.value;
  });

  const categoryPercentages = Object.entries(categoryTotals).map(([cat, val]) => {
    return {
      category: cat,
      value: val,
      percent: totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0,
    };
  });

  if (!playground) {
    return (
      <div className="p-8 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          {lang === 'pt' ? 'Playground não encontrado ou desmarcado.' : 'Playground not found or unselected.'}
        </p>
        <button
          onClick={() => onNavigate('playgrounds')}
          className="px-4 py-2 bg-[#1a146b] text-white rounded-xl text-xs font-semibold hover:bg-indigo-900 transition-colors cursor-pointer"
        >
          {lang === 'pt' ? 'Voltar para Playgrounds' : 'Back to Playgrounds'}
        </button>
      </div>
    );
  }

  // Actions
  const handleRemoveMember = async (personId: string) => {
    // Instantly remove member from state
    setFetchedApiMembers((prev) => prev.filter((m) => m.id !== personId));
    setHasFetchedMembers(true);

    try {
      await deleteMemberApi(playground.id, personId);
      if (addToast) {
        addToast({
          type: 'success',
          title: lang === 'pt' ? 'Membro Removido' : 'Member Removed',
          message: lang === 'pt' ? 'Integrante removido do playground com sucesso!' : 'Member removed from playground.',
        });
      }
    } catch (err: any) {
      console.error('Delete member API error:', err);
      if (addToast) {
        addToast({
          type: 'error',
          title: err.errorType || (lang === 'pt' ? 'Erro ao Remover' : 'Error Removing'),
          message: err.message || (lang === 'pt' ? 'Erro ao remover membro.' : 'Failed to remove member.'),
          statusCode: err.statusCode,
          traceId: err.traceId,
        });
      }
    }

    const updatedMemberIds = currentMemberIds.filter((id) => id !== personId);
    onUpdatePlayground({
      ...playground,
      memberIds: updatedMemberIds,
    });
  };

  const handleAddUserInvite = async (email: string, roleNum: number) => {
    try {
      const res = await inviteUserApi(playground.id, {
        email,
        role: roleNum,
      });

      const returnedPersonId = res?.personId || `usr_${Date.now()}`;
      const name = email.split('@')[0];
      const initials = name.substring(0, 2).toUpperCase() || 'US';
      const roleName = getRoleName(res?.role || roleNum, lang);

      const newPerson: Person = {
        id: returnedPersonId,
        name,
        email,
        initials,
        age: 28,
        tag: `${Math.floor(1000 + Math.random() * 9000)}-U`,
        role: roleName,
        spendingLimit: 2500,
        permissionEnabled: true,
        colorTheme: 'bg-indigo-100 text-indigo-700',
      };

      if (onAddPerson) {
        onAddPerson(newPerson);
      }

      setFetchedApiMembers((prev) => {
        const exists = prev.some((p) => p.id === returnedPersonId);
        return exists ? prev : [...prev, newPerson];
      });
      setHasFetchedMembers(true);

      const updatedMemberIds = currentMemberIds.includes(returnedPersonId)
        ? currentMemberIds
        : [...currentMemberIds, returnedPersonId];

      onUpdatePlayground({
        ...playground,
        memberIds: updatedMemberIds,
      });

      if (addToast) {
        addToast({
          type: 'success',
          title: lang === 'pt' ? 'Convite Enviado' : 'Invite Sent',
          message: lang === 'pt'
            ? 'Convite enviado com sucesso!'
            : 'Invite sent successfully!',
        });
      }
    } catch (err: any) {
      console.error('Invite member API error:', err);
      if (addToast) {
        addToast({
          type: 'error',
          title: err.errorType || (lang === 'pt' ? 'Erro no Convite' : 'Invite Error'),
          message: err.message || (lang === 'pt' ? 'Erro ao enviar convite.' : 'Failed to send invite.'),
          statusCode: err.statusCode,
          traceId: err.traceId,
        });
      }
    } finally {
      setIsAddMemberOpen(false);
    }
  };

  const handleAddGuest = async (name: string, age: number) => {
    try {
      const res = await createMemberApi(playground.id, {
        name,
        age,
      });

      const returnedPersonId = res.personId || `gst_${Date.now()}`;
      const initials = name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'G';
      const roleName = getRoleName(res.role || 1, lang);

      const newPerson: Person = {
        id: returnedPersonId,
        name,
        initials,
        age,
        tag: `${Math.floor(1000 + Math.random() * 9000)}-G`,
        role: roleName,
        spendingLimit: age < 18 ? 250 : 1500,
        permissionEnabled: true,
        colorTheme: 'bg-emerald-100 text-emerald-700',
      };

      if (onAddPerson) {
        onAddPerson(newPerson);
      }

      setFetchedApiMembers((prev) => {
        const exists = prev.some((p) => p.id === returnedPersonId);
        return exists ? prev : [...prev, newPerson];
      });
      setHasFetchedMembers(true);

      const updatedMemberIds = currentMemberIds.includes(returnedPersonId)
        ? currentMemberIds
        : [...currentMemberIds, returnedPersonId];

      onUpdatePlayground({
        ...playground,
        memberIds: updatedMemberIds,
      });

      if (addToast) {
        addToast({
          type: 'success',
          title: lang === 'pt' ? 'Membro Criado' : 'Member Created',
          message: lang === 'pt' ? 'Membro criado com sucesso no servidor!' : 'Member created successfully!',
        });
      }
    } catch (err: any) {
      console.error('Create member API error:', err);
      if (addToast) {
        addToast({
          type: 'error',
          title: err.errorType || (lang === 'pt' ? 'Erro ao Criar' : 'Create Error'),
          message: err.message || (lang === 'pt' ? 'Erro ao criar membro.' : 'Failed to create member.'),
          statusCode: err.statusCode,
          traceId: err.traceId,
        });
      }
    } finally {
      setIsAddMemberOpen(false);
    }
  };

  const handleUpdateMemberLimit = (personId: string, limit: number) => {
    const updatedLimits = { ...(playground.memberLimits || {}) };
    updatedLimits[personId] = limit;
    onUpdatePlayground({
      ...playground,
      memberLimits: updatedLimits,
    });
  };

  const handleUpdateMemberPermission = (personId: string, enabled: boolean) => {
    const updatedPermissions = { ...(playground.memberPermissions || {}) };
    updatedPermissions[personId] = enabled;
    onUpdatePlayground({
      ...playground,
      memberPermissions: updatedPermissions,
    });
  };

  const handleToggleGlobalApproval = () => {
    if (onToggleApproval) {
      onToggleApproval(playground.id);
    } else {
      onUpdatePlayground({
        ...playground,
        requireVerification: !playground.requireVerification,
      });
    }
  };

  const getPersonDetails = (id: string) => {
    const authUser = getAuthUser();
    const currentUserId = authUser?.id || '';
    if (currentUserId && id && id.toLowerCase() === currentUserId.toLowerCase()) {
      return {
        name: lang === 'pt' ? 'Você' : 'You',
        initials: 'VC',
        colorTheme: 'bg-[#e2dfff] text-[#100563]',
      };
    }
    const found = playgroundMembers.find((p) => p.id === id || p.email === id) || people.find((p) => p.id === id || p.email === id);
    if (found) {
      let displayName = found.name;
      if (displayName && displayName.includes('@')) {
        const prefix = displayName.split('@')[0];
        displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }
      return { ...found, name: displayName };
    }
    if (id && id.includes('@')) {
      const nameFromEmail = id.split('@')[0];
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      return { name: formattedName, initials: formattedName.slice(0, 2).toUpperCase(), colorTheme: 'bg-slate-100 text-slate-700' };
    }
    return { name: id ? `Pessoa (${id.length > 6 ? id.substring(0, 6) : id})` : (lang === 'pt' ? 'Membro' : 'Member'), initials: 'MB', colorTheme: 'bg-slate-100 text-slate-700' };
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t.tabOverview, icon: <Layers className="w-4 h-4" /> },
    { id: 'members', label: t.tabMembers, icon: <Users className="w-4 h-4" /> },
    // { id: 'reports', label: t.tabReports, icon: <PieChart className="w-4 h-4" /> },
    // { id: 'limits', label: t.tabLimits, icon: <FolderLock className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-20"
      id="playground-detail-view"
    >
      {/* Back navigation header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer group transition-colors"
          id="btn-back-to-dashboard"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{lang === 'pt' ? 'Voltar para o Painel' : 'Back to Dashboard'}</span>
        </button>

        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#1a146b] dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 px-3 py-1 rounded-full">
          Playground {lang === 'pt' ? 'Ativo' : 'Active'}
        </span>
      </div>

      {/* Hero Header Card */}
      <PlaygroundHero
        playground={playground}
        playgroundBalance={playgroundBalance}
        playgroundIncome={totalIncome}
        playgroundExpenses={totalExpense}
        progressPercent={progressPercent}
        settings={settings}
        t={t}
        lang={lang}
        statusFilter={heroStatusFilter}
        onStatusFilterChange={setHeroStatusFilter}
        counts={heroCounts}
      />

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto pb-px gap-1 select-none" id="playground-detail-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-11 px-4 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer rounded-t-xl ${
                isActive
                  ? 'text-[#1a146b] dark:text-indigo-400 bg-white dark:bg-slate-900 border border-b-0 border-slate-100 dark:border-slate-800'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
              }`}
              id={`tab-trigger-${tab.id}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeDetailTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a146b] dark:bg-indigo-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]" id="playground-detail-tab-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PlaygroundOverviewTab
                playgroundMembers={playgroundMembers}
                playground={playground}
                playgroundTransactions={playgroundTransactions}
                onToggleGlobalApproval={handleToggleGlobalApproval}
                onNavigate={onNavigate}
                getPersonDetails={getPersonDetails}
                settings={settings}
                t={t}
                lang={lang}
                onSelectTransaction={onSelectTransaction}
              />
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PlaygroundMembersTab
                playgroundId={playground.id}
                playgroundMembers={playgroundMembers}
                isAddMemberOpen={isAddMemberOpen}
                setIsAddMemberOpen={setIsAddMemberOpen}
                handleRemoveMember={handleRemoveMember}
                onAddUserInvite={handleAddUserInvite}
                onAddGuest={handleAddGuest}
                addToast={addToast || (() => {})}
                t={t}
                lang={lang}
              />
            </motion.div>
          )}

          {/*
          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PlaygroundReportsTab
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                playgroundBalance={playgroundBalance}
                categoryPercentages={categoryPercentages}
                progressPercent={progressPercent}
                playground={playground}
                settings={settings}
                t={t}
                lang={lang}
              />
            </motion.div>
          )}

          {activeTab === 'limits' && (
            <motion.div
              key="limits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PlaygroundLimitsTab
                playgroundMembers={playgroundMembers}
                playground={playground}
                handleUpdateMemberLimit={handleUpdateMemberLimit}
                handleUpdateMemberPermission={handleUpdateMemberPermission}
                settings={settings}
                t={t}
                lang={lang}
              />
            </motion.div>
          )}
          */}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
