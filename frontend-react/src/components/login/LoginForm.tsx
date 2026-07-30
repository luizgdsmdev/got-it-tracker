import React from 'react';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  t: any;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  isLoading = false,
  t,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
          {t.emailLabel}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
            placeholder="name@company.com"
            type="email"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="flex justify-between items-baseline pl-1">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {t.passwordLabel}
          </label>
          <a href="#" className="text-[10px] text-slate-400 hover:text-indigo-500 hover:underline">
            {t.forgotPassword}
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:shadow transition-all active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Entrando...
          </>
        ) : (
          <>
            {t.btnEnter} <LogIn className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
