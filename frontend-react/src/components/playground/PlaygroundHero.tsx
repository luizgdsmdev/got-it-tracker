import React from 'react';
import { ArrowUp, ArrowDown, ShieldCheck, Clock, XCircle, Layers } from 'lucide-react';
import { Playground, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';
import { StatusFilterValue } from '../common/ApprovalStatusFilter';

interface PlaygroundHeroProps {
  playground: Playground;
  playgroundBalance: number;
  playgroundIncome?: number;
  playgroundExpenses?: number;
  progressPercent: number;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
  statusFilter?: StatusFilterValue;
  onStatusFilterChange?: (status: StatusFilterValue) => void;
  counts?: {
    all?: number;
    approved?: number;
    pending?: number;
    rejected?: number;
  };
}

export default function PlaygroundHero({
  playground,
  playgroundBalance,
  playgroundIncome = 0,
  playgroundExpenses = 0,
  progressPercent,
  settings,
  t,
  lang,
  statusFilter = 'approved',
  onStatusFilterChange,
  counts,
}: PlaygroundHeroProps) {
  const options: { id: StatusFilterValue; labelPt: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'approved', labelPt: 'Aprovados', labelEn: 'Approved', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> },
    { id: 'all', labelPt: 'Todos', labelEn: 'All', icon: <Layers className="w-3.5 h-3.5 text-indigo-200" /> },
    { id: 'pending', labelPt: 'Pendentes', labelEn: 'Pending', icon: <Clock className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'rejected', labelPt: 'Rejeitados', labelEn: 'Rejected', icon: <XCircle className="w-3.5 h-3.5 text-rose-300" /> },
  ];

  return (
    <section
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8 text-white shadow-xl bg-gradient-to-br from-[#1a146b] to-[#312e81]"
      id="playground-detail-hero"
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header Row: Image, Name, Description & Status Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0">
              <img
                src={playground.image}
                alt={playground.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                {playground.name}
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed max-w-xl mt-0.5 line-clamp-2">
                {playground.description}
              </p>
            </div>
          </div>

          {/* Status Filter for Big Numbers (Mobile Scrollable) */}
          {onStatusFilterChange && (
            <div className="flex flex-col lg:items-end gap-1.5 max-w-full">
              <span className="text-[10px] uppercase font-extrabold text-slate-300 tracking-wider">
                {lang === 'pt' ? 'Filtro dos Totais:' : 'Totals Filter:'}
              </span>
              <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15 gap-1 max-w-full overflow-x-auto scrollbar-none touch-pan-x">
                {options.map((opt) => {
                  const isActive = statusFilter === opt.id;
                  const count = counts ? counts[opt.id] : undefined;
                  const labelText = lang === 'pt' ? opt.labelPt : opt.labelEn;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onStatusFilterChange(opt.id)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                        isActive
                          ? 'bg-white text-[#1a146b] shadow-md font-extrabold scale-105'
                          : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {opt.icon}
                      <span>{labelText}</span>
                      {count !== undefined && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive ? 'bg-indigo-100 text-[#1a146b]' : 'bg-white/20 text-white'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Value Cards: Saldo Consolidado, Rendimentos, Despesas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* 1. Saldo Consolidado */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-indigo-200 font-extrabold">
              {lang === 'pt' ? 'Saldo Consolidado' : 'Consolidated Balance'}
            </p>
            <div className="mt-2">
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                playgroundBalance >= 0 ? 'text-[#6dfe9c]' : 'text-rose-400'
              }`}>
                {formatCurrency(playgroundBalance, settings.defaultCurrency)}
              </h2>
              {playground.target && (
                <p className="text-[10px] text-slate-300 font-semibold mt-1 truncate">
                  {t.playgroundMeta}: {formatCurrency(playground.target, settings.defaultCurrency)}
                </p>
              )}
            </div>
          </div>

          {/* 2. Rendimentos (Income) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-extrabold">
                {lang === 'pt' ? 'Rendimentos' : 'Income'}
              </p>
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-300">
                <ArrowUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-emerald-300 tracking-tight">
                {formatCurrency(playgroundIncome, settings.defaultCurrency)}
              </h3>
              <p className="text-[10px] text-slate-300 mt-1">
                {lang === 'pt' ? 'Entradas aprovadas/filtradas' : 'Approved/filtered income'}
              </p>
            </div>
          </div>

          {/* 3. Despesas (Expenses) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-rose-300 font-extrabold">
                {lang === 'pt' ? 'Despesas' : 'Expenses'}
              </p>
              <span className="p-1 rounded-full bg-rose-500/20 text-rose-300">
                <ArrowDown className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-rose-300 tracking-tight">
                {formatCurrency(playgroundExpenses, settings.defaultCurrency)}
              </h3>
              <p className="text-[10px] text-slate-300 mt-1">
                {lang === 'pt' ? 'Saídas aprovadas/filtradas' : 'Approved/filtered expenses'}
              </p>
            </div>
          </div>
        </div>

        {/* Target Goal Progress Bar */}
        {playground.target && (
          <div className="pt-2 border-t border-white/10 space-y-1 relative z-10">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6dfe9c] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-300 font-bold">
              <span>{progressPercent}% {lang === 'pt' ? 'da meta alcançada' : 'of target reached'}</span>
              <span>{formatCurrency(playground.target - playgroundBalance, settings.defaultCurrency)} {lang === 'pt' ? 'restantes' : 'remaining'}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

