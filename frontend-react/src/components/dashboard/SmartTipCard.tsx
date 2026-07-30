import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

interface SmartTipCardProps {
  t: any;
  onNavigate: (screen: any) => void;
}

export default function SmartTipCard({ t, onNavigate }: SmartTipCardProps) {
  return (
    <section className="lg:col-span-4 bg-[#1a146b] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full" />
      <div className="space-y-4 relative z-10">
        <span className="p-2 rounded-xl bg-white/10 text-[#6dfe9c] inline-block">
          <Brain className="w-6 h-6" />
        </span>
        <h3 className="text-lg font-bold tracking-tight">{t.smartTip}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.smartTipText}
        </p>
      </div>
      <button
        onClick={() => onNavigate('reports')}
        className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all rounded-xl text-xs font-semibold flex items-center justify-center gap-2 relative z-10 cursor-pointer"
      >
        {t.viewFullAnalysis} <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
