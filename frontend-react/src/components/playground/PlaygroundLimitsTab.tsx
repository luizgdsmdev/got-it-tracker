import React from 'react';
import { ToggleRight, ToggleLeft } from 'lucide-react';
import { Person, Playground, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface PlaygroundLimitsTabProps {
  playgroundMembers: Person[];
  playground: Playground;
  handleUpdateMemberLimit: (personId: string, limit: number) => void;
  handleUpdateMemberPermission: (personId: string, enabled: boolean) => void;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
}

export default function PlaygroundLimitsTab({
  playgroundMembers,
  playground,
  handleUpdateMemberLimit,
  handleUpdateMemberPermission,
  settings,
  t,
  lang,
}: PlaygroundLimitsTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-bold text-sm text-[#1a146b] dark:text-slate-100">
          {lang === 'pt' ? 'Controles de Membros no Playground' : 'Playground Member Controls'}
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {lang === 'pt'
            ? 'Configure limites de gastos e permissões de aprovação específicos para cada membro deste playground.'
            : 'Set custom spending limits and requirements per person.'}
        </p>
      </div>

      {/* Members limits settings card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
        {playgroundMembers.map((mem) => {
          const currentLimit =
            playground.memberLimits && playground.memberLimits[mem.id] !== undefined
              ? playground.memberLimits[mem.id]
              : mem.spendingLimit;

          const currentPerm =
            playground.memberPermissions && playground.memberPermissions[mem.id] !== undefined
              ? playground.memberPermissions[mem.id]
              : mem.permissionEnabled;

          const maxLimitValue = mem.role.toLowerCase().includes('teenager') ? 2000 : 15000;

          return (
            <div
              key={mem.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {mem.avatarUrl ? (
                  <img
                    src={mem.avatarUrl}
                    alt={mem.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${mem.colorTheme || 'bg-indigo-100 text-indigo-700'}`}>
                    {mem.initials}
                  </div>
                )}
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {mem.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {mem.role}
                  </p>
                </div>
              </div>

              {/* Playground Scoped Controls */}
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center w-full md:w-auto">
                
                {/* Custom Playground Scoped Spending limit */}
                <div className="flex flex-col flex-grow">
                  <label className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                    {t.setMemberLimit} ({lang === 'pt' ? 'Neste Playground' : 'In Playground'})
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max={maxLimitValue}
                      step="50"
                      value={currentLimit}
                      onChange={(e) => handleUpdateMemberLimit(mem.id, Number(e.target.value))}
                      className="w-32 md:w-36 accent-[#1a146b] dark:accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#1a146b] dark:text-indigo-400 whitespace-nowrap min-w-[60px] text-right">
                      {formatCurrency(currentLimit, settings.defaultCurrency)}
                    </span>
                  </div>
                </div>

                {/* Custom Playground Scoped verification toggle */}
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-5">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">
                    {lang === 'pt' ? 'Requerer Verificação' : 'Require Approval'}
                  </span>
                  <button
                    onClick={() => handleUpdateMemberPermission(mem.id, !currentPerm)}
                    className={`p-1 transition-all rounded-full cursor-pointer ${
                      currentPerm ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {currentPerm ? (
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

        {playgroundMembers.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            {lang === 'pt' ? 'Não há membros adicionados para configurar limites.' : 'No members inside this playground to configure.'}
          </div>
        )}
      </div>
    </div>
  );
}
