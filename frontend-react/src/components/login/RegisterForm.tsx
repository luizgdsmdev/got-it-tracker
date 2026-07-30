import React from 'react';
import { Mail, User, UserPlus2, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  registerName: string;
  setRegisterName: (name: string) => void;
  registerEmail: string;
  setRegisterEmail: (email: string) => void;
  registerAge: string;
  setRegisterAge: (age: string) => void;
  registerPassword: string;
  setRegisterPassword: (pass: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  t: any;
}

export default function RegisterForm({
  registerName,
  setRegisterName,
  registerEmail,
  setRegisterEmail,
  registerAge,
  setRegisterAge,
  registerPassword,
  setRegisterPassword,
  onSubmit,
  isLoading = false,
  t,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
          {t.nameLabel}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
            placeholder="Ex: Luiz"
            type="text"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
          {t.emailLabel}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
            placeholder="email@exemplo.com"
            type="email"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.ageLabel}
          </label>
          <input
            value={registerAge}
            onChange={(e) => setRegisterAge(e.target.value)}
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
            placeholder="Ex: 30"
            type="number"
            min="1"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
            {t.passwordLabel}
          </label>
          <input
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <p className="text-[10px] text-slate-400 leading-tight pl-1">
        A senha deve ter entre 8 e 100 caracteres e conter ao menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:shadow transition-all active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
          </>
        ) : (
          <>
            {t.btnRegister} <UserPlus2 className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
