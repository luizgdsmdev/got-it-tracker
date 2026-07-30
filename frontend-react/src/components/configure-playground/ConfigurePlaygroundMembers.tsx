import React from 'react';
import { UserPlus, Shield } from 'lucide-react';
import { Person } from '../../types';

interface ConfigurePlaygroundMembersProps {
  people: Person[];
  addedPeople: string[];
  handleTogglePerson: (id: string) => void;
  requireVerification: boolean;
  setRequireVerification: (value: boolean) => void;
  setIsModalOpen: (value: boolean) => void;
  onNavigate: (screen: any) => void;
  t: any;
  lang: 'pt' | 'en';
}

export default function ConfigurePlaygroundMembers({
  people,
  addedPeople,
  handleTogglePerson,
  requireVerification,
  setRequireVerification,
  setIsModalOpen,
  onNavigate,
  t,
  lang,
}: ConfigurePlaygroundMembersProps) {
  return (
    <div className="md:col-span-5 space-y-6">
      {/* Added People selection */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold pl-1">
            {t.playgroundMembers}
          </h3>
          <span className="text-[10px] font-semibold text-indigo-500">
            {addedPeople.length} {t.selectedCount}
          </span>
        </div>

        {/* Inserir nova pessoa button inside members list */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full h-11 border border-dashed border-indigo-200 dark:border-slate-800 hover:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {t.addPersonBtn}
        </button>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {people.map((p) => {
            const isAdded = addedPeople.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => handleTogglePerson(p.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isAdded
                    ? 'border-indigo-200 bg-indigo-50/40 dark:border-indigo-950/40 dark:bg-indigo-950/10'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {p.avatarUrl ? (
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-100"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${p.colorTheme || 'bg-indigo-100 text-indigo-700'}`}>
                      {p.initials}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {p.name}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isAdded}
                  onChange={() => {}} // toggled on wrapper click
                  className="accent-[#1a146b] h-3.5 w-3.5 rounded"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval workflow trigger Rule */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.requireApprovalLabel}
            </h4>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              {t.requireApprovalDesc}
            </p>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setRequireVerification(!requireVerification)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                requireVerification ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                  requireVerification ? 'right-0.5 translate-x-0' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="space-y-2">
        <button
          type="submit"
          className="w-full h-12 bg-[#1a146b] hover:bg-[#312e81] text-white rounded-xl font-bold text-xs tracking-wide shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          {t.savePlayground}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="w-full h-12 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {t.btnCancel}
        </button>
      </div>
    </div>
  );
}
