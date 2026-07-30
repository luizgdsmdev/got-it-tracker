import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Approval, GlobalSettings } from '../types';
import { translations } from '../translations';

// Subcomponents
import ApprovalFilters from './approvals/ApprovalFilters';
import ApprovalCard from './approvals/ApprovalCard';

interface ApprovalsViewProps {
  approvals: Approval[];
  settings: GlobalSettings;
  onApproveReject: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  lang: 'pt' | 'en';
  onNavigate: (screen: any) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function ApprovalsView({
  approvals,
  settings,
  onApproveReject,
  lang,
  onNavigate,
  onRefresh,
  isRefreshing = false,
}: ApprovalsViewProps) {
  const [filter, setFilter] = useState<'all' | 'expense' | 'income' | 'public'>('all');
  const [decisionNotes, setDecisionNotes] = useState<{ [id: string]: string }>({});

  const t = translations[lang];

  const handleNoteChange = (id: string, text: string) => {
    setDecisionNotes((prev) => ({ ...prev, [id]: text }));
  };

  const filteredApprovals = approvals.filter((app) => {
    if (app.status !== 'pending') return false;
    if (filter === 'expense') return app.type === 'expense';
    if (filter === 'income') return app.type === 'income';
    if (filter === 'public') return app.visibility === 'Public';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
      id="approvals-view"
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a146b] dark:text-slate-100">
            {t.approvalsTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            {t.approvalsDesc}
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{lang === 'pt' ? 'Atualizar' : 'Refresh'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs Subcomponent */}
      <ApprovalFilters filter={filter} setFilter={setFilter} t={t} />

      {/* Queue list */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredApprovals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.everythingInOrder}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t.noApprovalsFound}
              </p>
            </motion.div>
          ) : (
            filteredApprovals.map((app) => (
              <ApprovalCard
                key={app.id}
                app={app}
                settings={settings}
                decisionNote={decisionNotes[app.id] || ''}
                onNoteChange={handleNoteChange}
                onApproveReject={onApproveReject}
                t={t}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
