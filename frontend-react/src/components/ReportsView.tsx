import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Tent, Calendar } from 'lucide-react';
import { Person, Transaction, Playground, GlobalSettings } from '../types';
import { translations } from '../translations';
import { getAuthUser } from '../services/api';
import { filterTransactionsByStatus } from '../utils';
import ApprovalStatusFilter, { StatusFilterValue } from './common/ApprovalStatusFilter';
import {
  getAllPersonTransactionsApi,
  getPlaygroundTransactionsApi,
  mapApiTransactionToFrontend,
} from '../services/transactionService';
import { getAllMembersByPlaygroundApi } from '../services/playgroundMemberService';

// Subcomponents
import ResidentBreakdownTable from './reports/ResidentBreakdownTable';
import GrandTotalsBar from './reports/GrandTotalsBar';

interface ReportsViewProps {
  people: Person[];
  transactions: Transaction[];
  playgrounds?: Playground[];
  settings: GlobalSettings;
  lang: 'pt' | 'en';
  onNavigate: (screen: any) => void;
}

export default function ReportsView({
  people,
  transactions: propTransactions,
  playgrounds = [],
  settings,
  lang,
  onNavigate,
}: ReportsViewProps) {
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [apiMembersMap, setApiMembersMap] = useState<Map<string, { name: string; age?: number }>>(new Map());
  const [apiTransactions, setApiTransactions] = useState<Transaction[]>([]);
  const [isLoadingApiData, setIsLoadingApiData] = useState(false);

  // Filters state
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'month' | 'year'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const t = translations[lang];
  const authUser = getAuthUser();

  // Load real members and real transactions from API for all user playgrounds
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      setIsLoadingApiData(true);
      try {
        const memberMap = new Map<string, { name: string; age?: number }>();
        const txMap = new Map<string, Transaction>();

        // Fetch transactions from /api/transactions/all
        try {
          const allTxs = await getAllPersonTransactionsApi();
          if (Array.isArray(allTxs)) {
            allTxs.map(mapApiTransactionToFrontend).forEach((tx) => txMap.set(tx.id, tx));
          }
        } catch (e) {
          console.warn('getAllPersonTransactionsApi failed in ReportsView:', e);
        }

        // Fetch members and transactions for each playground
        for (const p of playgrounds) {
          try {
            const members = await getAllMembersByPlaygroundApi(p.id);
            if (Array.isArray(members)) {
              members.forEach((m) => {
                if (m.personId) {
                  const mKey = m.personId.toLowerCase();
                  memberMap.set(mKey, {
                    name: m.name || (lang === 'pt' ? 'Membro' : 'Member'),
                    age: m.age,
                  });
                }
              });
            }
          } catch (e) {
            console.warn(`getPlaygroundMembersApi failed for playground ${p.id}:`, e);
          }

          try {
            const pTxs = await getPlaygroundTransactionsApi(p.id);
            if (Array.isArray(pTxs)) {
              pTxs.map(mapApiTransactionToFrontend).forEach((tx) => txMap.set(tx.id, tx));
            }
          } catch (e) {
            console.warn(`getPlaygroundTransactionsApi failed for playground ${p.id}:`, e);
          }
        }

        if (isMounted) {
          setApiMembersMap(memberMap);
          setApiTransactions(Array.from(txMap.values()));
        }
      } catch (err) {
        console.warn('Error fetching report data:', err);
      } finally {
        if (isMounted) {
          setIsLoadingApiData(false);
        }
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, [playgrounds]);

  // Use apiTransactions if available, otherwise fall back to propTransactions
  const rawActiveTransactions = apiTransactions.length > 0 ? apiTransactions : propTransactions;

  // Filter transactions by selected Playground, Date, and Status
  const activeTransactions = useMemo(() => {
    return rawActiveTransactions.filter((tx) => {
      // 1. Playground Filter
      if (selectedPlaygroundId !== 'all' && tx.playgroundId !== selectedPlaygroundId) {
        return false;
      }

      // 2. Status Filter
      if (statusFilter === 'approved' && !(tx.approvalStatus === 1 || tx.approvalStatus === undefined)) {
        return false;
      }
      if (statusFilter === 'pending' && tx.approvalStatus !== 0) {
        return false;
      }
      if (statusFilter === 'rejected' && tx.approvalStatus !== 2) {
        return false;
      }

      // 3. Date Filter
      if (filterMode === 'all') return true;
      if (!tx.date) return false;

      const cleanDate = tx.date.split('T')[0].replace(/\//g, '-');
      if (filterMode === 'day') {
        if (selectedDate && cleanDate !== selectedDate) return false;
      } else if (filterMode === 'month') {
        if (selectedMonth && !cleanDate.startsWith(selectedMonth)) return false;
      } else if (filterMode === 'year') {
        if (selectedYear && !cleanDate.startsWith(selectedYear)) return false;
      }

      return true;
    });
  }, [rawActiveTransactions, selectedPlaygroundId, statusFilter, filterMode, selectedDate, selectedMonth, selectedYear]);

  const statusCounts = useMemo(() => {
    return {
      all: rawActiveTransactions.length,
      approved: rawActiveTransactions.filter((t) => t.approvalStatus === 1 || t.approvalStatus === undefined).length,
      pending: rawActiveTransactions.filter((t) => t.approvalStatus === 0).length,
      rejected: rawActiveTransactions.filter((t) => t.approvalStatus === 2).length,
    };
  }, [rawActiveTransactions]);


  // Filter out any mock people (e.g. James Doe, Sarah Doe, Alex Rivera, or IDs p1, p2, p3)
  const isMockPerson = (id: string, name?: string) => {
    const mockIds = ['p1', 'p2', 'p3', 'p4', 'p5'];
    const mockNames = ['james doe', 'sarah doe', 'alex rivera'];
    if (mockIds.includes(id.toLowerCase())) return true;
    if (name && mockNames.includes(name.toLowerCase())) return true;
    return false;
  };

  // Helper to map any ID belonging to the logged-in user to the same canonical authUser.id
  const normalizePersonId = (id: string) => {
    if (!id) return '';
    const lower = id.toLowerCase();
    if (
      (authUser?.id && lower === authUser.id.toLowerCase()) ||
      (authUser?.email && lower === authUser.email.toLowerCase())
    ) {
      return authUser.id.toLowerCase();
    }
    return lower;
  };

  // Collect all valid unique person IDs from transactions and API members
  const realPersonIds = useMemo(() => {
    const idSet = new Set<string>();

    Array.from(apiMembersMap.keys()).forEach((k: string) => idSet.add(normalizePersonId(k)));
    rawActiveTransactions.forEach((t) => {
      if (t.personId) idSet.add(normalizePersonId(t.personId));
    });

    return Array.from(idSet).filter((id): id is string => Boolean(id) && !isMockPerson(id));
  }, [apiMembersMap, rawActiveTransactions]);

  // Build the clean list of Person objects without duplicates
  const allPeopleList: Person[] = useMemo(() => {
    return realPersonIds.map((id) => {
      const memberInfo = apiMembersMap.get(id.toLowerCase());
      const foundInProps = people.find((p) => p.id.toLowerCase() === id.toLowerCase());

      let displayName = '';
      if (memberInfo?.name && !isMockPerson(id, memberInfo.name)) {
        displayName = memberInfo.name;
      } else if (foundInProps && !isMockPerson(foundInProps.id, foundInProps.name)) {
        displayName = foundInProps.name;
      } else if (authUser && authUser.id && id.toLowerCase() === authUser.id.toLowerCase()) {
        displayName = authUser.name || (lang === 'pt' ? 'Membro' : 'Member');
      } else {
        displayName = `Pessoa (${id.length > 6 ? id.substring(0, 6) : id})`;
      }

      return {
        id,
        name: displayName,
        initials: displayName.slice(0, 2).toUpperCase() || 'MB',
        age: memberInfo?.age || 30,
        tag: 'MEMBER',
        role: 'Member',
        spendingLimit: 1000,
        permissionEnabled: true,
        colorTheme: 'bg-[#1a146b]/10 text-[#1a146b] dark:bg-indigo-950/50 dark:text-indigo-400',
      };
    });
  }, [realPersonIds, apiMembersMap, people, authUser, lang]);

  // Compute income / expenses per person purely from active API transactions
  const computedData = useMemo(() => {
    return allPeopleList
      .map((p) => {
        const personTransactions = activeTransactions.filter(
          (t) => t.personId && normalizePersonId(t.personId) === p.id.toLowerCase()
        );
        const totalIncome = personTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.value, 0);
        const totalExpense = personTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.value, 0);
        const net = totalIncome - totalExpense;

        return {
          person: p,
          income: totalIncome,
          expenses: totalExpense,
          net,
        };
      })
      .filter((row) => row.income > 0 || row.expenses > 0 || (authUser?.id && row.person.id === authUser.id.toLowerCase()));
  }, [allPeopleList, activeTransactions, authUser]);

  // Calculate Grand Totals across ALL playgrounds
  const totalHouseholdIncome = useMemo(() => {
    return activeTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
  }, [activeTransactions]);

  const totalHouseholdExpenses = useMemo(() => {
    return activeTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
  }, [activeTransactions]);

  const netBalance = totalHouseholdIncome - totalHouseholdExpenses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-28"
      id="reports-view"
    >
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer group transition-colors mb-3"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{lang === 'pt' ? 'Voltar para o Painel' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Title section */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a146b] dark:text-slate-100">
          {t.reportsTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          {t.reportsDesc}
        </p>
      </div>

      {/* Interactive Filters Bar (Playground, Status & Date) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-full">
          {/* Left side: Playground Selector & Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 max-w-full">
            {/* Playground Selector */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Tent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {lang === 'pt' ? 'Playground:' : 'Playground:'}
              </span>
              <select
                value={selectedPlaygroundId}
                onChange={(e) => setSelectedPlaygroundId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-full"
              >
                <option value="all">{lang === 'pt' ? 'Todos os Playgrounds' : 'All Playgrounds'}</option>
                {playgrounds.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Approval Status Filter (Touch scrollable) */}
            <div className="max-w-full overflow-x-auto scrollbar-none py-0.5">
              <ApprovalStatusFilter
                value={statusFilter}
                onChange={setStatusFilter}
                lang={lang}
                label={lang === 'pt' ? 'Status' : 'Status'}
                counts={statusCounts}
              />
            </div>
          </div>

          {/* Date Filter Controls */}
          <div className="flex items-center gap-2 max-w-full overflow-x-auto scrollbar-none py-0.5">
            <div className="flex items-center gap-1.5 mr-1 flex-shrink-0">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {lang === 'pt' ? 'Data:' : 'Date:'}
              </span>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'pt' ? 'Tudo' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('day')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'day'
                    ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'pt' ? 'Dia' : 'Day'}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('month')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'month'
                    ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'pt' ? 'Mês' : 'Month'}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('year')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === 'year'
                    ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'pt' ? 'Ano' : 'Year'}
              </button>
            </div>

            {/* Dynamic Inputs for Day/Month/Year */}
            {filterMode === 'day' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            )}

            {filterMode === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            )}

            {filterMode === 'year' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Grand Totals Bar (Consolidated Balance, Total Expenses, General Net Balance) */}
      <GrandTotalsBar
        totalHouseholdIncome={totalHouseholdIncome}
        totalHouseholdExpenses={totalHouseholdExpenses}
        netBalance={netBalance}
        settings={settings}
        t={t}
        lang={lang}
      />

      {/* General Member Listing Table */}
      <ResidentBreakdownTable
        computedData={computedData}
        reportPeriod={reportPeriod}
        setReportPeriod={setReportPeriod}
        settings={settings}
        t={t}
        lang={lang}
      />
    </motion.div>
  );
}
