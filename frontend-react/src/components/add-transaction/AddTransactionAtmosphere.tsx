import React from 'react';
import { Wallet } from 'lucide-react';
import { GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface AddTransactionAtmosphereProps {
  settings: GlobalSettings;
  t: any;
}

export default function AddTransactionAtmosphere({
  settings,
  t,
}: AddTransactionAtmosphereProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="add-transaction-atmosphere">
      <div className="bg-emerald-50/30 dark:bg-slate-900 p-5 rounded-2xl border border-emerald-500/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold">{t.pocketBalance}</p>
          <p className="text-lg font-bold text-emerald-600">
            {formatCurrency(2450.0, settings.defaultCurrency)}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 overflow-hidden relative">
        <div className="z-10">
          <p className="text-[10px] text-slate-400 uppercase font-bold">{t.limitProgress}</p>
          <p className="text-lg font-bold text-[#1a146b] dark:text-indigo-400">65% {t.used}</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-[#1a146b] dark:bg-indigo-500" style={{ width: '65%' }} />
        </div>
      </div>
    </div>
  );
}
