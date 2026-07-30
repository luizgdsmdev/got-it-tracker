import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Playground, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface PlaygroundReportsTabProps {
  totalIncome: number;
  totalExpense: number;
  playgroundBalance: number;
  categoryPercentages: Array<{ category: string; value: number; percent: number }>;
  progressPercent: number;
  playground: Playground;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
}

export default function PlaygroundReportsTab({
  totalIncome,
  totalExpense,
  playgroundBalance,
  categoryPercentages,
  progressPercent,
  playground,
  settings,
  t,
  lang,
}: PlaygroundReportsTabProps) {
  return (
    <div className="space-y-6">
      {/* Scorecards summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
            {lang === 'pt' ? 'Total Recebido / Injetado' : 'Total Incomes / Injected'}
          </p>
          <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome, settings.defaultCurrency)}
          </h4>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
            {lang === 'pt' ? 'Total Gasto / Debitado' : 'Total Expenses / Debited'}
          </p>
          <h4 className="text-xl font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(totalExpense, settings.defaultCurrency)}
          </h4>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
            {lang === 'pt' ? 'Resultado Consolidado' : 'Consolidated Balance'}
          </p>
          <h4 className={`text-xl font-bold ${playgroundBalance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-rose-600'}`}>
            {formatCurrency(playgroundBalance, settings.defaultCurrency)}
          </h4>
        </div>
      </div>

      {/* Categorical analytics and targets details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories breakdown */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-5">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 pl-1">
              {lang === 'pt' ? 'Gastos por Categoria no Playground' : 'Expenses by Category in Playground'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {lang === 'pt' ? 'Visualização proporcional de categorias de despesa.' : 'Proportional view of expenses.'}
            </p>
          </div>

          <div className="space-y-4">
            {categoryPercentages.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{item.category}</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">
                    {formatCurrency(item.value, settings.defaultCurrency)} ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1a146b] dark:bg-indigo-500 h-full rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}

            {categoryPercentages.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-8">
                {lang === 'pt' ? 'Nenhum débito lançado para este playground.' : 'No expenses debited inside this playground.'}
              </div>
            )}
          </div>
        </div>

        {/* Target progress tracker visualizer */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span className="text-[9px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                {lang === 'pt' ? 'Taxa de Meta' : 'Target Rate'}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {progressPercent}% {lang === 'pt' ? 'Concluído' : 'Completed'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                {lang === 'pt'
                  ? 'Seu progresso é calculated a partir do balanço do playground contra a meta estipulada.'
                  : 'Progression metric based on the cumulative wallet balance.'}
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-10 rounded-2xl flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
            {lang === 'pt' ? 'Meta: ' : 'Target: '} {playground.target ? formatCurrency(playground.target, settings.defaultCurrency) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
