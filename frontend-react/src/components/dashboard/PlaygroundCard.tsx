import React from 'react';
import { Playground, GlobalSettings } from '../../types';
import { formatCurrency } from '../../utils';

interface PlaygroundCardProps {
  play: Playground;
  settings: GlobalSettings;
  t: any;
  onNavigate: (screen: any, payload?: string) => void;
  key?: string;
}

export default function PlaygroundCard({
  play,
  settings,
  t,
  onNavigate,
}: PlaygroundCardProps) {
  return (
    <div
      onClick={() => onNavigate('playground-detail', play.id)}
      className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200 active:scale-[0.99] cursor-pointer group"
    >
      <div>
        <div className="h-32 w-full relative">
          <img
            src={play.image}
            alt={play.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/25" />
          {play.requireVerification && (
            <span className="absolute top-3 right-3 text-[9px] uppercase font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow">
              {t.requireApprovalLabel}
            </span>
          )}
        </div>

        <div className="p-4 space-y-1">
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
            {play.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1">
            {play.description}
          </p>
        </div>
      </div>

      {play.target ? (
        <div className="p-4 pt-0 space-y-2">
          <div className="space-y-1">
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1a146b] dark:bg-indigo-500 h-full rounded-full"
                style={{ width: `${play.progress || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>{t.playgroundMeta}: {formatCurrency(play.target, settings.defaultCurrency)}</span>
              <span>{play.progress || 0}% {t.playgroundProgress}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-2" />
      )}
    </div>
  );
}
