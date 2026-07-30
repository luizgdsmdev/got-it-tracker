import React from 'react';
import { Person, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface ResidentBreakdownTableProps {
  computedData: Array<{
    person: Person;
    income: number;
    expenses: number;
    net: number;
  }>;
  reportPeriod: 'monthly' | 'yearly';
  setReportPeriod: (period: 'monthly' | 'yearly') => void;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
}

export default function ResidentBreakdownTable({
  computedData,
  reportPeriod,
  setReportPeriod,
  settings,
  t,
  lang,
}: ResidentBreakdownTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold pl-1">
          {t.byResident}
        </h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-xs">
          <button
            onClick={() => setReportPeriod('monthly')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              reportPeriod === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            type="button"
          >
            {lang === 'pt' ? 'Mensal' : 'Monthly'}
          </button>
          <button
            onClick={() => setReportPeriod('yearly')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              reportPeriod === 'yearly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            type="button"
          >
            {lang === 'pt' ? 'Anual' : 'Yearly'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-5 py-4 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  {lang === 'pt' ? 'INTEGRANTE' : 'MEMBER'}
                </th>
                <th className="px-5 py-4 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">
                  {lang === 'pt' ? 'RENDIMENTOS' : 'INCOMES'}
                </th>
                <th className="px-5 py-4 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">
                  {lang === 'pt' ? 'DESPESAS' : 'EXPENSES'}
                </th>
                <th className="px-5 py-4 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">
                  {lang === 'pt' ? 'SALDO LÍQUIDO' : 'NET BALANCE'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {computedData.map(({ person, income, expenses, net }) => (
                <tr
                  key={person.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  id={`reports-table-row-${person.id}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {person.avatarUrl ? (
                        <img
                          src={person.avatarUrl}
                          alt={person.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${person.colorTheme || 'bg-indigo-100 text-indigo-700'}`}>
                          {person.initials}
                        </div>
                      )}
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {person.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(income, settings.defaultCurrency)}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(expenses, settings.defaultCurrency)}
                  </td>
                  <td
                    className={`px-5 py-4 text-right font-extrabold ${
                      net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {net >= 0 ? '+' : ''}
                    {formatCurrency(net, settings.defaultCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
