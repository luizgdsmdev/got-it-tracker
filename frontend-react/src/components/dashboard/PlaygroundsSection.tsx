import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Playground, GlobalSettings } from '../../types';
import PlaygroundCard from './PlaygroundCard';

interface PlaygroundsSectionProps {
  playgrounds: Playground[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  settings: GlobalSettings;
  t: any;
  lang: 'pt' | 'en';
  onNavigate: (screen: any, payload?: string) => void;
}

export default function PlaygroundsSection({
  playgrounds,
  searchQuery,
  setSearchQuery,
  settings,
  t,
  lang,
  onNavigate,
}: PlaygroundsSectionProps) {
  // Filter playgrounds based on search query
  const filteredPlaygrounds = playgrounds.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1a146b] dark:text-slate-100">
            {t.activePlaygrounds}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'pt' ? 'Gerencie áreas de orçamento colaborativo.' : 'Manage collaborative budget spaces.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaygrounds}
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
          />
        </div>
      </div>

      {/* Playgrounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaygrounds.map((play) => (
          <PlaygroundCard
            key={play.id}
            play={play}
            settings={settings}
            t={t}
            onNavigate={onNavigate}
          />
        ))}

        {/* Add Playground Button Card */}
        <div
          onClick={() => onNavigate('configure-playground')}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all min-h-[180px] group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 text-[#1a146b] dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-3">
            {t.newPlayground}
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[180px] mt-1 leading-relaxed">
            {t.newPlaygroundDesc}
          </p>
        </div>
      </div>

      {filteredPlaygrounds.length === 0 && (
        <p className="text-center text-xs text-slate-400 py-4">{t.noPlaygroundsFound}</p>
      )}
    </section>
  );
}
