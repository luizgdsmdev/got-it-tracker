import React from 'react';
import { GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface PlaygroundsAtmosphereProps {
  totalIncome: number;
  totalExpense: number;
  consolidatedBalance: number;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
  filterLabel?: string;
}

export default function PlaygroundsAtmosphere({
  totalIncome,
  totalExpense,
  consolidatedBalance,
  settings,
  t,
  lang,
  filterLabel,
}: PlaygroundsAtmosphereProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="playgrounds-atmosphere">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400">{t.totalReceivedLabel}</span>
        <p className="text-lg font-bold text-emerald-600">
          {formatCurrency(totalIncome, settings.defaultCurrency)}
        </p>
        <div className="text-[9px] text-emerald-500 font-semibold flex items-center gap-1">
          {filterLabel || (lang === 'pt' ? 'Transações filtradas' : 'Filtered transactions')}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400">{t.totalSpentLabel}</span>
        <p className="text-lg font-bold text-rose-600">
          {formatCurrency(totalExpense, settings.defaultCurrency)}
        </p>
        <div className="text-[9px] text-rose-500 font-semibold flex items-center gap-1">
          {filterLabel || (lang === 'pt' ? 'Transações filtradas' : 'Filtered transactions')}
        </div>
      </div>

      <div className="bg-[#1a146b] p-5 rounded-3xl shadow-sm text-white space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-200">{t.consolidatedBalanceLabel}</span>
        <p className={`text-lg font-bold ${consolidatedBalance < 0 ? 'text-red-400 font-extrabold' : 'text-[#6dfe9c]'}`}>
          {formatCurrency(consolidatedBalance, settings.defaultCurrency)}
        </p>
        <div className="text-[9px] text-slate-300">
          {t.availableInPlaygrounds}
        </div>
      </div>
    </section>
  );
}

