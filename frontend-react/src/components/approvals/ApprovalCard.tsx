import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { Approval, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface ApprovalCardProps {
  key?: string;
  app: Approval;
  settings: GlobalSettings;
  decisionNote: string;
  onNoteChange: (id: string, text: string) => void;
  onApproveReject: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  t: any;
}

export default function ApprovalCard({
  app,
  settings,
  decisionNote,
  onNoteChange,
  onApproveReject,
  t,
}: ApprovalCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4"
      id={`approval-card-${app.id}`}
    >
      {/* Card Header metadata */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-50 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">
            {app.playgroundName}
          </p>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            {app.title}
          </h3>
        </div>

        <span
          className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full ${
            app.type === 'expense'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
          }`}
        >
          {app.type === 'expense' ? t.approvalTypeExpense : t.approvalTypeIncome}
        </span>
      </div>

      {/* Main statistics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl">
        <div>
          <span className="block text-[9px] uppercase font-bold text-slate-400">{t.valueLabel}</span>
          <span
            className={`text-sm font-extrabold ${
              app.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {app.type === 'expense' ? '-' : '+'}
            {formatCurrency(app.value, settings.defaultCurrency)}
          </span>
        </div>

        <div>
          <span className="block text-[9px] uppercase font-bold text-slate-400">{t.requester}</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {app.requesterName}
          </span>
        </div>

        <div>
          <span className="block text-[9px] uppercase font-bold text-slate-400">{t.reviewer}</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {app.reviewerName}
          </span>
        </div>

        <div>
          <span className="block text-[9px] uppercase font-bold text-slate-400">
            {t.visibility}
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
            {app.visibility === 'Public' ? (
              <>
                <Eye className="w-3.5 h-3.5 text-indigo-500" /> {t.publicLabel}
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" /> {t.privateLabel}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <span className="block text-[9px] uppercase font-bold text-slate-400">{t.descLabel}</span>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {app.description}
        </p>
      </div>

      {/* Decision Notes Form Input */}
      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 pl-1">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {t.decisionReasonLabel}
        </label>
        <input
          value={decisionNote}
          onChange={(e) => onNoteChange(app.id, e.target.value)}
          placeholder={t.decisionReasonPlaceholder}
          className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
          type="text"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:justify-end">
        <button
          onClick={() => onApproveReject(app.id, 'approved', decisionNote)}
          className="h-11 px-6 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow"
          type="button"
        >
          <Check className="w-4 h-4" /> {t.btnApprove}
        </button>
        <button
          onClick={() => onApproveReject(app.id, 'rejected', decisionNote)}
          className="h-11 px-6 border border-rose-200 hover:bg-rose-50 dark:border-rose-955/40 dark:hover:bg-rose-955/25 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
          type="button"
        >
          <X className="w-4 h-4" /> {t.btnReject}
        </button>
      </div>
    </motion.div>
  );
}
