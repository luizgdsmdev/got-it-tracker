import React, { useState, useMemo } from 'react';
import { ShoppingBag, Utensils, DollarSign, Edit3 } from 'lucide-react';
import { Transaction, Person, GlobalSettings } from '../../types';
import { formatCurrency, formatRelativeDate, filterTransactionsByStatus } from '../../utils';
import { getAuthUser } from '../../services/api';
import ApprovalStatusBadge from '../common/ApprovalStatusBadge';
import ApprovalStatusFilter, { StatusFilterValue } from '../common/ApprovalStatusFilter';

interface RecentActivityListProps {
  transactions: Transaction[];
  people: Person[];
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
  onNavigate: (screen: any) => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

export default function RecentActivityList({
  transactions,
  people,
  settings,
  t,
  lang,
  onNavigate,
  onSelectTransaction,
}: RecentActivityListProps) {
  const [listStatusFilter, setListStatusFilter] = useState<StatusFilterValue>('all');

  const counts = useMemo(() => {
    return {
      all: transactions.length,
      approved: transactions.filter((t) => t.approvalStatus === 1 || t.approvalStatus === undefined).length,
      pending: transactions.filter((t) => t.approvalStatus === 0).length,
      rejected: transactions.filter((t) => t.approvalStatus === 2).length,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByStatus(transactions, listStatusFilter);
  }, [transactions, listStatusFilter]);

  const getPersonDetails = (id: string) => {
    if (!id) {
      return { name: lang === 'pt' ? 'Membro' : 'Member', initials: 'MB' };
    }
    const authUser = getAuthUser();
    const currentUserId = authUser?.id || '';
    const currentUserEmail = authUser?.email || '';

    if (
      (currentUserId && id.toLowerCase() === currentUserId.toLowerCase()) ||
      (currentUserEmail && id.toLowerCase() === currentUserEmail.toLowerCase())
    ) {
      return {
        name: lang === 'pt' ? 'Você' : 'You',
        initials: 'VC',
      };
    }

    const found = people.find(
      (p) =>
        p.id.toLowerCase() === id.toLowerCase() ||
        (p.email && p.email.toLowerCase() === id.toLowerCase())
    );

    if (found) {
      let displayName = found.name;
      if (
        (currentUserId && found.id.toLowerCase() === currentUserId.toLowerCase()) ||
        (currentUserEmail && found.email?.toLowerCase() === currentUserEmail.toLowerCase())
      ) {
        displayName = lang === 'pt' ? 'Você' : 'You';
      } else if (displayName && displayName.includes('@')) {
        const prefix = displayName.split('@')[0];
        displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }
      return { ...found, name: displayName };
    }

    if (id.includes('@')) {
      const nameFromEmail = id.split('@')[0];
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      return { name: formattedName, initials: formattedName.slice(0, 2).toUpperCase() };
    }

    return {
      name: `Pessoa (${id.length > 6 ? id.substring(0, 6) : id})`,
      initials: 'MB',
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'grocery':
        return <ShoppingBag className="w-5 h-5" />;
      case 'dining':
        return <Utensils className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1a146b] dark:text-slate-100">
              {t.recentActivity}
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {lang === 'pt' ? 'Exibindo lançamentos mais recentes.' : 'Displaying latest records.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline cursor-pointer flex-shrink-0 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 transition-colors"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="w-full max-w-full overflow-x-auto scrollbar-none pt-0.5">
          <ApprovalStatusFilter
            value={listStatusFilter}
            onChange={setListStatusFilter}
            lang={lang}
            counts={counts}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.slice(0, 8).map((trans) => {
          const user = getPersonDetails(trans.personId);
          return (
            <div
              key={trans.id}
              onClick={() => {
                if (onSelectTransaction) onSelectTransaction(trans);
              }}
              className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all cursor-pointer group gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(trans.category)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                    <span className="truncate">{trans.description}</span>
                    <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{trans.category} • {formatRelativeDate(trans.date, lang)}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{user.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 text-right">
                <ApprovalStatusBadge status={trans.approvalStatus} lang={lang} size="sm" />
                <p
                  className={`font-extrabold text-xs ${
                    trans.type === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {trans.type === 'expense' ? '-' : '+'}
                  {formatCurrency(trans.value, settings.defaultCurrency)}
                </p>
              </div>
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            {lang === 'pt' ? 'Nenhuma transação encontrada para este filtro.' : 'No transactions found for this filter.'}
          </div>
        )}
      </div>
    </section>
  );
}


