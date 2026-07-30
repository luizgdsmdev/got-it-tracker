import React from 'react';
import { ArrowUp, ArrowDown, ShieldCheck, Clock, XCircle, Layers } from 'lucide-react';
import { formatCurrency } from '../../utils';
import { GlobalSettings } from '../../types';
import { StatusFilterValue } from '../common/ApprovalStatusFilter';

interface BalanceHeroCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  settings: GlobalSettings;
  t: any;
  lang?: 'pt' | 'en';
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (status: StatusFilterValue) => void;
  counts?: {
    all?: number;
    approved?: number;
    pending?: number;
    rejected?: number;
  };
}

export default function BalanceHeroCard({
  totalBalance,
  totalIncome,
  totalExpense,
  settings,
  t,
  lang = 'pt',
  statusFilter,
  onStatusFilterChange,
  counts,
}: BalanceHeroCardProps) {
  const options: { id: StatusFilterValue; labelPt: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'approved', labelPt: 'Aprovados', labelEn: 'Approved', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> },
    { id: 'all', labelPt: 'Todos', labelEn: 'All', icon: <Layers className="w-3.5 h-3.5 text-indigo-200" /> },
    { id: 'pending', labelPt: 'Pendentes', labelEn: 'Pending', icon: <Clock className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'rejected', labelPt: 'Rejeitados', labelEn: 'Rejected', icon: <XCircle className="w-3.5 h-3.5 text-rose-300" /> },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-br from-[#1a146b] to-[#312e81]">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="relative z-10 space-y-6">
        {/* Top Header Row with Status Filter Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-300 font-bold flex items-center gap-2">
              <span>{t.totalBalance}</span>
              <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-extrabold text-indigo-100 border border-white/10">
                {statusFilter === 'approved' && (lang === 'pt' ? 'Apenas Aprovados' : 'Approved Only')}
                {statusFilter === 'all' && (lang === 'pt' ? 'Todos os Status' : 'All Statuses')}
                {statusFilter === 'pending' && (lang === 'pt' ? 'Apenas Pendentes' : 'Pending Only')}
                {statusFilter === 'rejected' && (lang === 'pt' ? 'Apenas Rejeitados' : 'Rejected Only')}
              </span>
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-1">
              {formatCurrency(totalBalance, settings.defaultCurrency)}
            </h1>
          </div>

          {/* Filter Pills for Big Numbers */}
          <div className="flex flex-col sm:items-end gap-1 max-w-full">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
              {lang === 'pt' ? 'Filtro dos Totais:' : 'Totals Filter:'}
            </span>
            <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15 gap-1 max-w-full overflow-x-auto scrollbar-none touch-pan-x">
              {options.map((opt) => {
                const isActive = statusFilter === opt.id;
                const count = counts ? counts[opt.id] : undefined;
                const labelText = lang === 'pt' ? opt.labelPt : opt.labelEn;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-white text-[#1a146b] shadow-md scale-105 font-extrabold'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {opt.icon}
                    <span>{labelText}</span>
                    {count !== undefined && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-indigo-100 text-[#1a146b]' : 'bg-white/20 text-white'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Income & Expense Big Number Badges */}
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-300">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="text-[10px] uppercase text-slate-300 leading-none">{t.income}</p>
              <p className="font-semibold text-xs mt-0.5 text-emerald-300">
                {formatCurrency(totalIncome, settings.defaultCurrency)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="p-1 rounded-full bg-rose-500/20 text-rose-300">
              <ArrowDown className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="text-[10px] uppercase text-slate-300 leading-none">{t.expense}</p>
              <p className="font-semibold text-xs mt-0.5 text-rose-300">
                {formatCurrency(totalExpense, settings.defaultCurrency)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

