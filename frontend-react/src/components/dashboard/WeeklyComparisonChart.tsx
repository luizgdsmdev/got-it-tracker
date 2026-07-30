import React from 'react';
import { formatCurrency } from '../../utils';
import { GlobalSettings } from '../../types';

interface WeeklyComparisonChartProps {
  weeklyData: Array<{
    week: string;
    income: number;
    expense: number;
    incomeHeight: string;
    expenseHeight: string;
  }>;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
}

export default function WeeklyComparisonChart({
  weeklyData,
  settings,
  t,
  lang,
}: WeeklyComparisonChartProps) {
  return (
    <section className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-[#1a146b] dark:text-slate-100">
            {lang === 'pt' ? 'Rendimentos vs Despesas Semanais' : 'Weekly Income vs Expenses'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'pt' ? 'Análise comparativa de fluxo consolidado semanal.' : 'Comparative analysis of weekly flow.'}
          </p>
        </div>
      </div>

      {/* Bar Chart Representation */}
      <div className="h-44 w-full flex items-end justify-around gap-4 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
        {weeklyData.map((data, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full max-w-[80px]">
              {/* Income (Green) Bar */}
              <div className="w-full flex flex-col justify-end h-full relative group">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-emerald-950 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                  +{formatCurrency(data.income, settings.defaultCurrency)}
                </span>
                <div
                  className="w-full bg-emerald-600 dark:bg-emerald-500 rounded-t-md hover:opacity-90 transition-all duration-300"
                  style={{ height: data.incomeHeight.endsWith('%') || data.incomeHeight.endsWith('px') ? data.incomeHeight : undefined }}
                />
              </div>

              {/* Expense (Red) Bar */}
              <div className="w-full flex flex-col justify-end h-full relative group">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-rose-950 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                  -{formatCurrency(data.expense, settings.defaultCurrency)}
                </span>
                <div
                  className="w-full bg-rose-700 dark:bg-rose-500 rounded-t-md hover:opacity-90 transition-all duration-300"
                  style={{ height: data.expenseHeight.endsWith('%') || data.expenseHeight.endsWith('px') ? data.expenseHeight : undefined }}
                />
              </div>
            </div>

            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-2.5">
              {data.week}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-500 rounded" />
          <span>{t.income}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-rose-700 dark:bg-rose-500 rounded" />
          <span>{t.expense}</span>
        </div>
      </div>
    </section>
  );
}
