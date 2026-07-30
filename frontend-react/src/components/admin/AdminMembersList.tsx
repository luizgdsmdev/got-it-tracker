import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Person, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface AdminMembersListProps {
  people: Person[];
  settings: GlobalSettings;
  onUpdatePersonLimit: (id: string, limit: number) => void;
  onUpdatePersonPermission: (id: string, enabled: boolean) => void;
  t: any;
}

export default function AdminMembersList({
  people,
  settings,
  onUpdatePersonLimit,
  onUpdatePersonPermission,
  t,
}: AdminMembersListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-xs text-[#1a146b] dark:text-slate-100">
          {t.spendingLimitsPermissions}
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
          {people.length} {t.activeLabel}
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {people.map((p) => {
          const maxSliderLimit = p.role.toLowerCase().includes('teenager') ? 1000 : 10000;
          return (
            <div
              key={p.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              id={`admin-member-row-${p.id}`}
            >
              <div className="flex items-center gap-3">
                {p.avatarUrl ? (
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${p.colorTheme || 'bg-indigo-100 text-indigo-700'}`}>
                    {p.initials}
                  </div>
                )}
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{p.role}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
                {/* Range Limit slider */}
                <div className="flex flex-col flex-grow">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                    {t.spendingLimitSliderLabel}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max={maxSliderLimit}
                      step="50"
                      value={p.spendingLimit}
                      onChange={(e) => onUpdatePersonLimit(p.id, Number(e.target.value))}
                      className="w-28 sm:w-32 accent-[#1a146b] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-indigo-400 whitespace-nowrap min-w-[50px] text-right">
                      {formatCurrency(p.spendingLimit, settings.defaultCurrency)}
                    </span>
                  </div>
                </div>

                {/* Switch Permission */}
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-4">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                    {t.permissionToggleLabel}
                  </span>
                  <button
                    onClick={() => onUpdatePersonPermission(p.id, !p.permissionEnabled)}
                    className={`p-1 transition-all rounded-full cursor-pointer ${
                      p.permissionEnabled ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                    }`}
                    type="button"
                  >
                    {p.permissionEnabled ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
