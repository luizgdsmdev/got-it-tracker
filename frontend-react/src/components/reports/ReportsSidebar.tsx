import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ReportsSidebarProps {
  safeSavedPercentage?: number;
  topSpenderName: string;
  topCategoryName: string;
  lang: 'pt' | 'en';
}

export default function ReportsSidebar({
  safeSavedPercentage = 0,
  topSpenderName,
  topCategoryName,
  lang,
}: ReportsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Budget Targets - Comentado para implementação futura
      <div className="bg-[#1a146b] p-6 rounded-3xl shadow-md text-white relative overflow-hidden group" id="reports-budget-target-card">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-5 h-5 text-indigo-300" />
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-1 rounded">
              {lang === 'pt' ? 'Metas de Orçamento' : 'Budget Targets'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{safeSavedPercentage}% {lang === 'pt' ? 'Guardado' : 'Saved'}</h3>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              {lang === 'pt' ? 'Você está significativamente abaixo do limite de gastos coletivos deste mês.' : 'You are significantly below this month collective spending limit.'}
            </p>
          </div>
          <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#6dfe9c] h-full rounded-full transition-all duration-500"
              style={{ width: `${safeSavedPercentage}%` }}
            />
          </div>
        </div>
      </div>
      */}

      {/* General Summary card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4" id="reports-summary-metrics-card">
        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold pl-1">
          {lang === 'pt' ? 'Resumo Geral' : 'General Summary'}
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex justify-between items-center py-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">{lang === 'pt' ? 'Maior Consumidor' : 'Top Spender'}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {topSpenderName}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">{lang === 'pt' ? 'Maior Categoria' : 'Top Category'}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {topCategoryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
