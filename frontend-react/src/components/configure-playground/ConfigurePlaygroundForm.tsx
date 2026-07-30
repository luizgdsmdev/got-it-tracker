import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

interface ConfigurePlaygroundFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  requireVerification: boolean;
  setRequireVerification: (val: boolean) => void;
  error: string;
  onCancel: () => void;
  t: any;
  lang: 'pt' | 'en';
}

export default function ConfigurePlaygroundForm({
  name,
  setName,
  description,
  setDescription,
  requireVerification,
  setRequireVerification,
  error,
  onCancel,
  t,
  lang,
}: ConfigurePlaygroundFormProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* 1. General Information Section */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
            {t.generalInfo}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lang === 'pt' ? 'Defina as informações básicas do seu novo espaço' : 'Set basic information for your new space'}
          </p>
        </div>

        {/* Playground Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.playgroundNameLabel} <span className="text-rose-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100 transition-all"
            placeholder={t.playgroundNamePlaceholder}
            type="text"
          />
        </div>

        {/* Playground Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.playgroundDescLabel} <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100 transition-all resize-none"
            placeholder={t.playgroundDescPlaceholder}
          />
        </div>
      </div>

      {/* 2. Require Approval Section */}
      <div className="space-y-3 pt-2">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
            {lang === 'pt' ? 'Regras & Controle' : 'Rules & Control'}
          </h3>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t.requireApprovalLabel}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                {t.requireApprovalDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRequireVerification(!requireVerification)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer flex-shrink-0 ${
              requireVerification ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
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

      {/* 3. Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="submit"
          className="w-full sm:flex-1 h-12 bg-[#1a146b] hover:bg-[#312e81] text-white rounded-2xl font-bold text-xs tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
          {t.savePlayground}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-32 h-12 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-medium text-xs transition-colors cursor-pointer"
        >
          {t.btnCancel}
        </button>
      </div>
    </div>
  );
}
