import React from 'react';
import { motion } from 'motion/react';
import { Mail, Users, ArrowLeft } from 'lucide-react';
import { Person, GlobalSettings } from '../types';
import { formatCurrency } from '../utils';
import { translations } from '../translations';

// Subcomponents
import AdminMembersList from './admin/AdminMembersList';
import AdminGlobalSettings from './admin/AdminGlobalSettings';

interface AdminViewProps {
  people: Person[];
  settings: GlobalSettings;
  onUpdateSettings: (settings: Partial<GlobalSettings>) => void;
  onUpdatePersonLimit: (id: string, limit: number) => void;
  onUpdatePersonPermission: (id: string, enabled: boolean) => void;
  lang: 'pt' | 'en';
  onNavigate: (screen: any) => void;
}

export default function AdminView({
  people,
  settings,
  onUpdateSettings,
  onUpdatePersonLimit,
  onUpdatePersonPermission,
  lang,
  onNavigate,
}: AdminViewProps) {
  // Calculate aggregate limit dynamically
  const totalLimit = people.reduce((sum, p) => sum + (p.spendingLimit || 0), 0);
  const t = translations[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
      id="admin-view"
    >
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer group transition-colors mb-3"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{lang === 'pt' ? 'Voltar para o Painel' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Title */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a146b] dark:text-slate-100">
            {t.adminTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            {t.adminDesc}
          </p>
        </div>
        <button className="bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white h-11 px-5 rounded-xl font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer">
          <Mail className="w-4 h-4" />
          {t.inviteMember}
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Household Members limits & permissions (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <AdminMembersList
            people={people}
            settings={settings}
            onUpdatePersonLimit={onUpdatePersonLimit}
            onUpdatePersonPermission={onUpdatePersonPermission}
            t={t}
          />
        </div>

        {/* Global Settings sidebar (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <AdminGlobalSettings
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            t={t}
          />

          {/* Aggregate limit summary card */}
          <div className="bg-[#1a146b] p-6 rounded-3xl text-white flex items-center justify-between overflow-hidden relative group" id="admin-household-summary">
            <div className="relative z-10 space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                {t.householdLimitTitle}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalLimit, settings.defaultCurrency)}
              </p>
            </div>
            <Users className="w-14 h-14 text-white/10 absolute -right-3 -bottom-3 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
