import React from 'react';
import { GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface GrandTotalsBarProps {
  totalHouseholdIncome: number;
  totalHouseholdExpenses: number;
  netBalance: number;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
}

export default function GrandTotalsBar({
  totalHouseholdIncome,
  totalHouseholdExpenses,
  netBalance,
  settings,
  t,
  lang,
}: GrandTotalsBarProps) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4" id="reports-grand-totals-bar">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          {t.totalConsolidated}
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl md:text-3xl font-extrabold text-[#1a146b] dark:text-indigo-400">
            {formatCurrency(totalHouseholdIncome, settings.defaultCurrency)}
          </span>
          <span className="text-xs font-medium text-slate-400">{lang === 'pt' ? 'Ganhos' : 'Incomes'}</span>
        </div>
      </div>

      <div className="h-px w-full md:h-12 md:w-px bg-slate-100 dark:bg-slate-800" />

      <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto justify-around md:justify-end">
        <div className="text-center md:text-right">
          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            {lang === 'pt' ? 'Despesas Totais' : 'Total Expenses'}
          </span>
          <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(totalHouseholdExpenses, settings.defaultCurrency)}
          </span>
        </div>

        <div className="text-center md:text-right">
          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            {lang === 'pt' ? 'Saldo Líquido Geral' : 'General Net Balance'}
          </span>
          <span className={`text-lg font-bold ${
            netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {netBalance >= 0 ? '+' : ''}
            {formatCurrency(netBalance, settings.defaultCurrency)}
          </span>
        </div>
      </div>
    </section>
  );
}
