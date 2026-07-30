import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, AlertCircle, Brain, Loader2 } from 'lucide-react';
import { Playground, Person } from '../../types';
import { createMemberApi } from '../../services/playgroundMemberService';

interface CreatePersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  playgrounds: Playground[];
  t: any;
  lang: 'pt' | 'en';
  onAddPerson: (person: Omit<Person, 'id' | 'initials' | 'colorTheme'> & { id?: string }, playgroundIds: string[]) => void;
}

export default function CreatePersonModal({
  isOpen,
  onClose,
  playgrounds,
  t,
  lang,
  onAddPerson,
}: CreatePersonModalProps) {
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonAge, setNewPersonAge] = useState<number | ''>('');
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<string>(
    playgrounds.length > 0 ? playgrounds[0].id : ''
  );
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (playgrounds.length > 0 && (!selectedPlaygroundId || !playgrounds.some(p => p.id === selectedPlaygroundId))) {
      setSelectedPlaygroundId(playgrounds[0].id);
    }
  }, [playgrounds, selectedPlaygroundId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!newPersonName.trim()) {
      setModalError(lang === 'pt' ? 'Por favor, informe o nome completo.' : 'Please enter the full name.');
      return;
    }
    if (!newPersonAge || Number(newPersonAge) <= 0) {
      setModalError(lang === 'pt' ? 'Por favor, informe uma idade válida.' : 'Please enter a valid age.');
      return;
    }
    if (!selectedPlaygroundId) {
      setModalError(lang === 'pt' ? 'Por favor, selecione um playground.' : 'Please select a playground.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call createMemberApi service
      const apiMember = await createMemberApi(selectedPlaygroundId, {
        name: newPersonName,
        age: Number(newPersonAge),
      });

      const returnedPersonId = apiMember?.personId;

      onAddPerson({
        ...(returnedPersonId ? { id: returnedPersonId } : {}),
        name: newPersonName,
        age: Number(newPersonAge),
        role: Number(newPersonAge) < 18 ? 'Teenager (Minor)' : 'Co-dependent',
        tag: `${Math.floor(1000 + Math.random() * 9000)}-K`,
        spendingLimit: Number(newPersonAge) < 18 ? 200 : 1500,
        permissionEnabled: true,
      }, [selectedPlaygroundId]);

      setModalSuccess(true);
      setNewPersonName('');
      setNewPersonAge('');
      
      setTimeout(() => {
        setModalSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.warn('createMemberApi error:', err);
      const errMsg = err?.message || (lang === 'pt' ? 'Erro ao cadastrar pessoa no servidor.' : 'Error creating person on server.');
      setModalError(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl relative z-10 p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95"
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
            onClick={onClose}
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

        {modalSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <Brain className="w-4 h-4 flex-shrink-0" />
            <span>{t.successPersonCreated}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 pl-1">
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
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 pl-1">
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

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 pl-1">
              {lang === 'pt' ? 'PLAYGROUND ASSOCIADO (SELECIONE 1)' : 'ASSOCIATED PLAYGROUND (SELECT 1)'}
            </label>
            {playgrounds.length === 0 ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">
                  {lang === 'pt'
                    ? 'Você precisa criar um playground para poder adicionar um membro'
                    : 'You need to create a playground before adding a member'}
                </span>
              </div>
            ) : (
              <div className="max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-2.5 space-y-2">
                {playgrounds.map((play) => {
                  const isSelected = selectedPlaygroundId === play.id;
                  return (
                    <label
                      key={play.id}
                      className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <input
                        type="radio"
                        name="playgroundSelection"
                        checked={isSelected}
                        onChange={() => setSelectedPlaygroundId(play.id)}
                        className="rounded-full border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{play.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={playgrounds.length === 0 || !selectedPlaygroundId || isSubmitting}
              className="flex-1 h-11 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1a146b] dark:disabled:hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'pt' ? 'Salvando...' : 'Saving...'}</span>
                </>
              ) : (
                t.btnSave
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-11 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              {t.btnCancel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
