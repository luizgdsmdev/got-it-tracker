import React from 'react';
import { Filter } from 'lucide-react';

export type StatusFilterValue = 'all' | 'approved' | 'pending' | 'rejected';

interface ApprovalStatusFilterProps {
  value: StatusFilterValue;
  onChange: (newValue: StatusFilterValue) => void;
  lang?: 'pt' | 'en';
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'pills' | 'dropdown';
  counts?: {
    all?: number;
    approved?: number;
    pending?: number;
    rejected?: number;
  };
}

export default function ApprovalStatusFilter({
  value,
  onChange,
  lang = 'pt',
  label,
  size = 'sm',
  variant = 'pills',
  counts,
}: ApprovalStatusFilterProps) {
  const options: { id: StatusFilterValue; labelPt: string; labelEn: string; colorClass: string }[] = [
    { id: 'all', labelPt: 'Todos', labelEn: 'All', colorClass: 'text-slate-700 dark:text-slate-200' },
    { id: 'approved', labelPt: 'Aprovados', labelEn: 'Approved', colorClass: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'pending', labelPt: 'Pendentes', labelEn: 'Pending', colorClass: 'text-amber-600 dark:text-amber-400' },
    { id: 'rejected', labelPt: 'Rejeitados', labelEn: 'Rejected', colorClass: 'text-rose-600 dark:text-rose-400' },
  ];

  if (variant === 'dropdown') {
    return (
      <div className="flex items-center gap-2 max-w-full">
        {label && (
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            {label}
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as StatusFilterValue)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-full"
        >
          {options.map((opt) => {
            const countVal = counts ? counts[opt.id] : undefined;
            const text = lang === 'pt' ? opt.labelPt : opt.labelEn;
            return (
              <option key={opt.id} value={opt.id}>
                {text} {countVal !== undefined ? `(${countVal})` : ''}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 max-w-full">
      {label && (
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 whitespace-nowrap">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          {label}:
        </span>
      )}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl gap-1 text-xs font-semibold max-w-full overflow-x-auto scrollbar-none touch-pan-x">
        {options.map((opt) => {
          const isActive = value === opt.id;
          const countVal = counts ? counts[opt.id] : undefined;
          const text = lang === 'pt' ? opt.labelPt : opt.labelEn;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                size === 'md' ? 'text-xs px-3.5 py-1.5' : 'text-[11px] px-2.5 py-1'
              } ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-bold border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className={isActive ? opt.colorClass : ''}>{text}</span>
              {countVal !== undefined && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {countVal}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
