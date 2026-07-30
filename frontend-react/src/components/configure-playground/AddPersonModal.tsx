import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface AddPersonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  newPersonName: string;
  setNewPersonName: (value: string) => void;
  newPersonAge: number | '';
  setNewPersonAge: (value: number | '') => void;
  modalError: string;
  handleAddPersonSubmit: (e: React.FormEvent) => void;
  t: any;
}

export default function AddPersonModal({
  isModalOpen,
  setIsModalOpen,
  newPersonName,
  setNewPersonName,
  newPersonAge,
  setNewPersonAge,
  modalError,
  handleAddPersonSubmit,
  t,
}: AddPersonModalProps) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsModalOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl relative z-10 p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800"
      >
        <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1a146b] dark:text-slate-100">
              {t.createPersonTitle}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              {t.createPersonDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {modalError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        <form onSubmit={handleAddPersonSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
              {t.nameLabel}
            </label>
            <input
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              placeholder={t.fullNamePlaceholder}
              type="text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
              {t.ageLabel}
            </label>
            <input
              value={newPersonAge}
              onChange={(e) => setNewPersonAge(e.target.value ? Number(e.target.value) : '')}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              placeholder={t.agePlaceholder}
              type="number"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 h-11 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              {t.btnSave}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-11 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t.btnCancel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
