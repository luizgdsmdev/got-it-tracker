import React from 'react';

interface ApprovalFiltersProps {
  filter: 'all' | 'expense' | 'income' | 'public';
  setFilter: (filter: 'all' | 'expense' | 'income' | 'public') => void;
  t: any;
}

export default function ApprovalFilters({
  filter,
  setFilter,
  t,
}: ApprovalFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setFilter('all')}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          filter === 'all'
            ? 'bg-[#1a146b] text-white shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        {t.filterAll}
      </button>
      <button
        onClick={() => setFilter('expense')}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          filter === 'expense'
            ? 'bg-[#1a146b] text-white shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        {t.filterExpenses}
      </button>
      <button
        onClick={() => setFilter('income')}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          filter === 'income'
            ? 'bg-[#1a146b] text-white shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        {t.filterIncomes}
      </button>
      <button
        onClick={() => setFilter('public')}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          filter === 'public'
            ? 'bg-[#1a146b] text-white shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        {t.filterPublic}
      </button>
    </div>
  );
}
