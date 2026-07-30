import React, { useState, useMemo } from 'react';
import { Users, Plus, ArrowDown, ArrowUp, Edit3 } from 'lucide-react';
import { Person, Transaction, GlobalSettings, Playground } from '../../types';
import { formatCurrency, formatRelativeDate, filterTransactionsByStatus } from '../../utils';
import ApprovalStatusBadge from '../common/ApprovalStatusBadge';
import ApprovalStatusFilter, { StatusFilterValue } from '../common/ApprovalStatusFilter';

interface PlaygroundOverviewTabProps {
  playgroundMembers: Person[];
  playground: Playground;
  playgroundTransactions: Transaction[];
  onToggleGlobalApproval: () => void;
  onNavigate: (screen: string) => void;
  getPersonDetails: (id: string) => any;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
  onSelectTransaction?: (tx: Transaction) => void;
}

export default function PlaygroundOverviewTab({
  playgroundMembers,
  playground,
  playgroundTransactions,
  onToggleGlobalApproval,
  onNavigate,
  getPersonDetails,
  settings,
  t,
  lang,
  onSelectTransaction,
}: PlaygroundOverviewTabProps) {
  const [listStatusFilter, setListStatusFilter] = useState<StatusFilterValue>('all');

  const counts = useMemo(() => {
    return {
      all: playgroundTransactions.length,
      approved: playgroundTransactions.filter((t) => t.approvalStatus === 1 || t.approvalStatus === undefined).length,
      pending: playgroundTransactions.filter((t) => t.approvalStatus === 0).length,
      rejected: playgroundTransactions.filter((t) => t.approvalStatus === 2).length,
    };
  }, [playgroundTransactions]);

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByStatus(playgroundTransactions, listStatusFilter);
  }, [playgroundTransactions, listStatusFilter]);

  return (
    <div className="space-y-6">
      {/* Quick statistics and launch buttons */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Active Members Mini Panel */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-xs text-[#1a146b] dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              {lang === 'pt' ? 'Membros Ativos' : 'Active Members'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {lang === 'pt'
                ? `${playgroundMembers.length} integrantes acompanhando esta carteira.`
                : `${playgroundMembers.length} members tracking this balance.`}
            </p>
          </div>

          <div className="flex -space-x-2.5 overflow-hidden">
            {playgroundMembers.map((mem) => (
              <div
                key={mem.id}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 overflow-hidden flex items-center justify-center cursor-pointer shadow-sm"
                title={mem.name}
              >
                {mem.avatarUrl ? (
                  <img
                    src={mem.avatarUrl}
                    alt={mem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] font-black text-indigo-700">{mem.initials}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scope verification notice */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-xs text-[#1a146b] dark:text-slate-100">
              {lang === 'pt' ? 'Exigência de Aprovação' : 'Verification Requirement'}
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-md">
              {lang === 'pt'
                ? 'Se ativado, novas despesas lançadas neste playground pelos membros exigirirão a aprovação explícita do administrador antes de debitar o saldo.'
                : 'If active, new expenses registered in this playground by members require explicit approval before debiting.'}
            </p>
          </div>

          <button
            onClick={onToggleGlobalApproval}
            className={`h-10 px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              playground.requireVerification
                ? 'bg-amber-500 text-white shadow-sm'
                : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{playground.requireVerification ? (lang === 'pt' ? 'Exigindo' : 'Enforced') : (lang === 'pt' ? 'Desativada' : 'Disabled')}</span>
          </button>
        </div>
      </div>

      {/* Playground Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1a146b] dark:text-slate-100">
                {lang === 'pt' ? 'Extrato do Playground' : 'Playground Transactions'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'pt' ? 'Histórico de lançamentos deste espaço.' : 'Listing financial events for this workspace.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('add-transaction')}
              className="bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white h-9 px-3.5 rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-sm transition-all active:scale-[0.98] cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addTransaction}</span>
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

        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredTransactions.map((tr) => {
            const person = getPersonDetails(tr.personId);
            const isExpense = tr.type === 'expense';
            const rawName = person.name || (lang === 'pt' ? 'Membro' : 'Member');
            const memberName = rawName.includes('@')
              ? rawName.split('@')[0].charAt(0).toUpperCase() + rawName.split('@')[0].slice(1)
              : rawName;

            return (
              <div
                key={tr.id}
                onClick={() => {
                  if (onSelectTransaction) onSelectTransaction(tr);
                }}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all rounded-xl px-2 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isExpense
                      ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20'
                      : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20'
                  }`}>
                    {isExpense ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                      <span>{tr.description}</span>
                      <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-slate-400 font-semibold">{formatRelativeDate(tr.date, lang)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <span className="text-[9px] text-slate-400 font-bold truncate">
                        {memberName}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                        {tr.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 flex items-center gap-3">
                  <ApprovalStatusBadge status={tr.approvalStatus} lang={lang} size="sm" />
                  <p className={`font-bold text-xs ${isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isExpense ? '-' : '+'}
                    {formatCurrency(tr.value, settings.defaultCurrency)}
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
      </div>
    </div>
  );
}

