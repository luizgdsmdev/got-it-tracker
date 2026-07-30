import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { Person } from '../../types';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (person: Omit<Person, 'id' | 'initials' | 'colorTheme'>) => void;
  t: any;
  lang: 'pt' | 'en';
}

export default function AddPersonModal({
  isOpen,
  onClose,
  onAdd,
  t,
  lang,
}: AddPersonModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [role, setRole] = useState('Primary Partner');
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'pt' ? 'Por favor, informe o nome completo.' : 'Please enter the full name.');
      return;
    }
    if (!age || Number(age) <= 0) {
      setError(lang === 'pt' ? 'Por favor, informe uma idade válida.' : 'Please enter a valid age.');
      return;
    }
    if (!tag.trim()) {
      setError(lang === 'pt' ? 'Por favor, informe uma TAG de ID.' : 'Please enter an ID TAG.');
      return;
    }

    onAdd({
      name,
      age: Number(age),
      role,
      tag,
      spendingLimit: role.toLowerCase().includes('teenager') ? 250 : 1500,
      permissionEnabled: true,
    });

    // Reset Form
    setName('');
    setAge('');
    setRole('Primary Partner');
    setTag('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" id="add-person-modal-overlay">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl relative z-10 p-6 flex flex-col gap-5 border border-slate-100 dark:border-slate-800"
            id="add-person-modal-box"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-[#1a146b] dark:text-slate-100">
                  {t.createPersonTitle}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                  {t.createPersonDesc}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                  {t.nameLabel}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                  placeholder={t.fullNamePlaceholder}
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                    {t.ageLabel}
                  </label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                    placeholder="24"
                    type="number"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                    {t.tagLabel}
                  </label>
                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                    placeholder="9900-X"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                  {t.roleLabel}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 transition-colors"
                >
                  <option value="Primary Partner">{t.primaryPartner}</option>
                  <option value="Secondary Partner">{t.secondaryPartner}</option>
                  <option value="Teenager (Minor)">{t.teenagerMinor}</option>
                  <option value="Co-dependent">{t.coDependent}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <button
                  type="submit"
                  className="w-full h-11 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  {t.btnSave}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-11 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t.btnCancel}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
