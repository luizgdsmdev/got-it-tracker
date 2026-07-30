import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, X, Check, ShieldCheck } from 'lucide-react';
import { PlaygroundRole, getRoleName } from '../../services/playgroundMemberService';

interface AddPlaygroundMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUserInvite: (email: string, role: number) => void;
  onAddGuest: (name: string, age: number) => void;
  lang: 'pt' | 'en';
}

export default function AddPlaygroundMemberModal({
  isOpen,
  onClose,
  onAddUserInvite,
  onAddGuest,
  lang,
}: AddPlaygroundMemberModalProps) {
  const [memberType, setMemberType] = useState<'user' | 'guest'>('user');

  // User form state
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState<number>(PlaygroundRole.Contributor);

  // Guest form state
  const [guestName, setGuestName] = useState('');
  const [guestAge, setGuestAge] = useState<number | ''>('');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'pt' ? 'Insira um e-mail válido para o convite.' : 'Please enter a valid email for the invitation.');
      return;
    }
    setError('');
    onAddUserInvite(email.trim(), Number(userRole));
    setEmail('');
    setUserRole(PlaygroundRole.Contributor);
    onClose();
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError(lang === 'pt' ? 'Insira o nome do convidado.' : 'Please enter the guest name.');
      return;
    }
    if (!guestAge || Number(guestAge) <= 0) {
      setError(lang === 'pt' ? 'Insira uma idade válida.' : 'Please enter a valid age.');
      return;
    }
    setError('');
    onAddGuest(guestName.trim(), Number(guestAge));
    setGuestName('');
    setGuestAge('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl relative z-10 p-6 flex flex-col gap-5 border border-slate-100 dark:border-slate-800"
      >
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1a146b] dark:text-slate-100">
              {lang === 'pt' ? 'Adicionar Integrante ao Playground' : 'Add Person to Playground'}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {lang === 'pt'
                ? 'Escolha a forma de inclusão: Convidar por E-mail ou Criar Convidado.'
                : 'Choose method: Invite by Email or Create Guest.'}
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

        {/* Option Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMemberType('user');
              setError('');
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              memberType === 'user'
                ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'Convidar por E-mail' : 'Invite via Email'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMemberType('guest');
              setError('');
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              memberType === 'guest'
                ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'Novo Convidado' : 'New Guest'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* USER INVITE FORM */}
        {memberType === 'user' && (
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                {lang === 'pt' ? 'E-MAIL DO USUÁRIO' : 'USER EMAIL'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                {lang === 'pt' ? 'FUNÇÃO (ROLE)' : 'ROLE'}
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 transition-colors"
              >
                <option value={PlaygroundRole.Viewer}>1 - Viewer (Visualizador)</option>
                <option value={PlaygroundRole.Contributor}>2 - Contributor (Colaborador)</option>
                <option value={PlaygroundRole.Manager}>3 - Manager (Gestor)</option>
                <option value={PlaygroundRole.Owner}>4 - Owner (Proprietário)</option>
              </select>
            </div>

            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-[11px] text-indigo-700 dark:text-indigo-300">
              <p className="font-semibold">
                {lang === 'pt'
                  ? 'Se houver um usuário com este email, ele será adicionado ao seu playground'
                  : 'If a user with this email exists, they will be added to your playground'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-11 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{lang === 'pt' ? 'Enviar Convite' : 'Send Invite'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* GUEST FORM */}
        {memberType === 'guest' && (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                {lang === 'pt' ? 'NOME DO CONVIDADO' : 'GUEST NAME'}
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={lang === 'pt' ? 'Ex: Maria Silva' : 'E.g. Maria Silva'}
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                {lang === 'pt' ? 'IDADE' : 'AGE'}
              </label>
              <input
                type="number"
                value={guestAge}
                onChange={(e) => setGuestAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="25"
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-11 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'pt' ? 'Criar Membro' : 'Create Member'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

