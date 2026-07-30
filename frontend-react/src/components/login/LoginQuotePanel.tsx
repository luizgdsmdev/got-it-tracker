import React from 'react';
import { Star } from 'lucide-react';

export default function LoginQuotePanel() {
  return (
    <div className="hidden md:flex flex-col justify-between p-12 bg-slate-50 dark:bg-slate-950/20 w-[350px] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />

      <div className="space-y-4 relative z-10 my-auto">
        {/* Rating stars */}
        <div className="flex gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "A experiência mais simples e transparente que já encontrei para gerenciar as economias e limites de gastos de toda a minha família."
        </p>

        <div className="flex items-center gap-3 pt-4">
          <div className="w-10 h-10 rounded-full bg-[#6dfe9c] flex items-center justify-center text-emerald-900 font-bold text-xs shadow-inner">
            SJ
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Sarah Jenkins
            </p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              Early Access User
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400">
        © 2026 Got It Financial Inc.
      </div>
    </div>
  );
}
