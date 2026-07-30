import React from 'react';
import { Playground, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface PlaygroundGridItemProps {
  playground: Playground;
  settings: GlobalSettings;
  onNavigate: (screen: any, payload?: string) => void;
  t: any;
  lang: 'pt' | 'en';
  key?: string;
}

export default function PlaygroundGridItem({
  playground,
  settings,
  onNavigate,
  t,
  lang,
}: PlaygroundGridItemProps) {
  return (
    <div
      onClick={() => onNavigate('playground-detail', playground.id)}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200 active:scale-[0.99] cursor-pointer group"
      id={`playground-grid-item-${playground.id}`}
    >
      <div>
        <div className="h-40 w-full relative">
          <img
            src={playground.image}
            alt={playground.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/20" />
          <span className="absolute top-4 right-4 text-[10px] uppercase font-bold bg-white/90 dark:bg-slate-900/90 text-[#1a146b] dark:text-indigo-400 px-2.5 py-1 rounded shadow">
            {lang === 'pt' ? 'Ativo' : 'Active'}
          </span>
        </div>

        <div className="p-5 space-y-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {playground.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {playground.description}
          </p>
        </div>
      </div>

      {playground.target ? (
        <div className="p-5 pt-0 space-y-3">
          <div className="space-y-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1a146b] dark:bg-indigo-500 h-full rounded-full"
                style={{ width: `${playground.progress || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>{t.playgroundMeta}: {formatCurrency(playground.target, settings.defaultCurrency)}</span>
              <span>{playground.progress}% {lang === 'pt' ? 'atingido' : 'achieved'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-3" />
      )}
    </div>
  );
}
