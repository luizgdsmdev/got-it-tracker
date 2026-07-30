import React from 'react';
import { Globe, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { GlobalSettings } from '../../types';

interface AdminGlobalSettingsProps {
  settings: GlobalSettings;
  onUpdateSettings: (settings: Partial<GlobalSettings>) => void;
  t: any;
}

export default function AdminGlobalSettings({
  settings,
  onUpdateSettings,
  t,
}: AdminGlobalSettingsProps) {
  const closingDays = [25, 26, 27, 28, 29, 30, 1];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-5" id="admin-global-settings">
      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 pl-1">
        {t.globalSettingsLabel}
      </h3>

      {/* Currency */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-indigo-400" /> {t.defaultCurrencyLabel}
        </label>
        <select
          value={settings.defaultCurrency}
          onChange={(e) =>
            onUpdateSettings({ defaultCurrency: e.target.value as any })
          }
          className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none dark:text-slate-100"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      {/* Closing Date */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {t.monthlyClosingLabel}
        </label>
        <div className="grid grid-cols-7 gap-1">
          {closingDays.map((day) => {
            const isActive = settings.monthlyClosingDate === day;
            return (
              <button
                key={day}
                onClick={() => onUpdateSettings({ monthlyClosingDate: day })}
                className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1a146b] text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 italic mt-1.5 leading-relaxed">
          {t.monthlyClosingHelp.replace('{day}', String(settings.monthlyClosingDate))}
        </p>
      </div>

      {/* Notification settings */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {t.autoExportLabel}
          </span>
          <button
            onClick={() => onUpdateSettings({ autoExport: !settings.autoExport })}
            className={`p-1 transition-all rounded-full cursor-pointer ${
              settings.autoExport ? 'text-[#1a146b] dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
            }`}
            type="button"
          >
            {settings.autoExport ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {t.limitBreachAlertsLabel}
          </span>
          <button
            onClick={() => onUpdateSettings({ limitBreachAlerts: !settings.limitBreachAlerts })}
            className={`p-1 transition-all rounded-full cursor-pointer ${
              settings.limitBreachAlerts ? 'text-[#1a146b] dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
            }`}
            type="button"
          >
            {settings.limitBreachAlerts ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
