import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, Info, Loader2, Globe } from 'lucide-react';
import { Person, Playground } from '../../types';

interface AddTransactionFormProps {
  type: 'expense' | 'income';
  setType: (type: 'expense' | 'income') => void;
  description: string;
  setDescription: (desc: string) => void;
  value: string;
  setValue: (value: string) => void;
  playgroundId: string;
  setPlaygroundId: (id: string) => void;
  personId: string;
  setPersonId: (id: string) => void;
  isPublic?: boolean;
  setIsPublic?: (val: boolean) => void;
  playgrounds: Playground[];
  filteredPeople: Person[];
  selectedPerson: Person | undefined;
  minorWarning: boolean;
  error: string;
  success?: boolean;
  setSuccess?: (val: boolean) => void;
  isSubmitting?: boolean;
  currencySymbol: string;
  handleSubmit: (e: React.FormEvent) => void;
  isLoadingMembers?: boolean;
  t: any;
  lang: 'pt' | 'en';
}

export default function AddTransactionForm({
  type,
  setType,
  description,
  setDescription,
  value,
  setValue,
  playgroundId,
  setPlaygroundId,
  personId,
  setPersonId,
  isPublic = true,
  setIsPublic,
  playgrounds,
  filteredPeople,
  selectedPerson,
  minorWarning,
  error,
  success = false,
  setSuccess,
  isSubmitting = false,
  currencySymbol,
  handleSubmit,
  isLoadingMembers = false,
  t,
  lang,
}: AddTransactionFormProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold">
                {lang === 'pt' ? 'Transação salva com sucesso no servidor!' : 'Transaction saved successfully on server!'}
              </span>
            </div>
            {setSuccess && (
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Warning if no playgrounds exist */}
        {playgrounds.length === 0 && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">
              {lang === 'pt'
                ? 'Você precisa criar um playground para poder adicionar um membro'
                : 'You need to create a playground before adding a member'}
            </span>
          </div>
        )}

        {/* Type Segmented Control */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.transactionTypeLabel}
          </label>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl flex gap-1 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-[#1a146b] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:dark:text-slate-300'
              }`}
            >
              {t.expenseType}
            </button>
            <button
              type="button"
              disabled={selectedPerson && selectedPerson.age < 18}
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${
                selectedPerson && selectedPerson.age < 18
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : type === 'income'
                  ? 'bg-[#1a146b] text-white shadow-sm cursor-pointer'
                  : 'text-slate-500 hover:text-slate-700 hover:dark:text-slate-300 cursor-pointer'
              }`}
            >
              {t.incomeType}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.descLabel}
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            placeholder={t.descPlaceholder}
            type="text"
          />
        </div>

        {/* Value input with Currency Symbol */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.valueLabel}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-indigo-900 dark:text-indigo-400 text-sm">
              {currencySymbol}
            </span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-indigo-900 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              placeholder="0.00"
              step="0.01"
              type="number"
            />
          </div>
        </div>

        {/* Playground Selector */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {lang === 'pt' ? 'PLAYGROUND / ESPAÇO COOPERATIVO' : 'PLAYGROUND / COOPERATIVE SPACE'}
          </label>
          <select
            value={playgroundId}
            onChange={(e) => setPlaygroundId(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 transition-colors"
          >
            <option value="">{lang === 'pt' ? '-- Selecione um Playground --' : '-- Select a Playground --'}</option>
            {playgrounds.map((play) => (
              <option key={play.id} value={play.id}>
                {play.name}
              </option>
            ))}
          </select>
        </div>

        {/* Person Selector - Hidden until playground is selected */}
        {playgroundId && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t.integrantLabel}
              </label>
              {isLoadingMembers && (
                <span className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {lang === 'pt' ? 'Carregando membros...' : 'Loading members...'}
                </span>
              )}
            </div>
            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              disabled={isLoadingMembers}
              className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 transition-colors disabled:opacity-60"
            >
              {isLoadingMembers ? (
                <option value="">{lang === 'pt' ? 'Carregando membros...' : 'Loading members...'}</option>
              ) : filteredPeople.length === 0 ? (
                <option value="">{lang === 'pt' ? 'Nenhum membro vinculado neste playground' : 'No members linked to this playground'}</option>
              ) : (
                filteredPeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.age < 18 ? `(${lang === 'pt' ? 'Menor' : 'Under 18'})` : ''}
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        {/* Public Visibility Toggle (isPublic) */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {lang === 'pt' ? 'VISIBILIDADE DA TRANSAÇÃO' : 'TRANSACTION VISIBILITY'}
          </label>
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isPublic
                    ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {lang === 'pt' ? 'Transação Pública (isPublic)' : 'Public Transaction (isPublic)'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {isPublic
                    ? lang === 'pt'
                      ? 'Visível para todos os membros do playground'
                      : 'Visible to all members in the playground'
                    : lang === 'pt'
                    ? 'Visível apenas para você e membros gestores'
                    : 'Visible only to you and manager members'}
                </p>
              </div>
            </div>
            {setIsPublic && (
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublic ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Minor Restriction warning notice */}
        <AnimatePresence>
          {minorWarning && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200/50 dark:border-amber-800/50"
            >
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                {t.minorWarningText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={playgrounds.length === 0 || !playgroundId || isSubmitting}
          className="w-full h-12 bg-[#1a146b] hover:bg-[#312e81] text-white rounded-xl font-bold text-xs tracking-wide shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1a146b] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{lang === 'pt' ? 'Enviando...' : 'Saving...'}</span>
            </>
          ) : (
            t.saveTransactionBtn
          )}
        </button>
      </form>
    </div>
  );
}
