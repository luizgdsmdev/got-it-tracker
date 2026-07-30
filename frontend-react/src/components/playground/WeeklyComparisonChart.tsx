import React from 'react';
import { GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface WeeklyComparisonChartProps {
  weeklyData: Array<{
    week: string;
    incomeHeight: string;
    expenseHeight: string;
    income: number;
    expense: number;
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
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm" id="weekly-comparison-chart-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {lang === 'pt' ? 'Receitas vs Despesas Semanais' : 'Incomes vs Expenses Weekly'}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'pt' ? 'Análise comparativa de fluxo financeiro consolidado semanal.' : 'Weekly consolidated financial flow comparison.'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-500 rounded" />
            <span>{t.income}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-600 dark:bg-rose-500 rounded" />
            <span>{t.expense}</span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="h-48 w-full flex items-end justify-around gap-4 mt-6 pt-6 border-b border-slate-100 dark:border-slate-800 pb-3">
        {weeklyData.map((data, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full max-w-[80px]">
              {/* Income (Green) Bar */}
              <div className="w-full flex flex-col justify-end h-full relative group">
                {data.income > 0 && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                    +{formatCurrency(data.income, settings.defaultCurrency)}
                  </span>
                )}
                <div
                  className="w-full bg-emerald-600 dark:bg-emerald-500 rounded-t-md hover:opacity-90 transition-all duration-300"
                  style={{ height: data.incomeHeight }}
                />
              </div>

              {/* Expense (Red) Bar */}
              <div className="w-full flex flex-col justify-end h-full relative group">
                {data.expense > 0 && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-rose-400 text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                    -{formatCurrency(data.expense, settings.defaultCurrency)}
                  </span>
                )}
                <div
                  className="w-full bg-rose-600 dark:bg-rose-500 rounded-t-md hover:opacity-90 transition-all duration-300"
                  style={{ height: data.expenseHeight }}
                />
              </div>
            </div>

            {/* Week Label and Totals */}
            <div className="flex flex-col items-center mt-2.5">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                {data.week}
              </span>
              <div className="flex gap-1 text-[9px] font-medium text-slate-400 mt-0.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  +{formatCurrency(data.income, settings.defaultCurrency)}
                </span>
                <span>/</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  -{formatCurrency(data.expense, settings.defaultCurrency)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

