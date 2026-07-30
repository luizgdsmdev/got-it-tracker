import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Person } from '../../types';

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
  t: any;
  key?: string;
}

export default function PersonCard({ person, onDelete, t }: PersonCardProps) {
  return (
    <div
      className="bg-white dark:bg-slate-900 p-4 rounded-3xl flex items-center justify-between group hover:shadow-md transition-all border border-slate-100 dark:border-slate-800"
      id={`person-card-${person.id}`}
    >
      <div className="flex items-center gap-4">
        {person.avatarUrl ? (
          <img
            src={person.avatarUrl}
            alt={person.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-slate-100"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ${person.colorTheme || 'bg-indigo-100 text-indigo-700'}`}>
            {person.initials}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {person.name}
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">
              {person.age} {t.yearsOld} • {person.role}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {t.tagLabel}: {person.tag}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="p-2 text-slate-400 hover:text-[#1a146b] dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title={t.editTooltip}
          type="button"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(person.id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-colors cursor-pointer"
          title={t.deleteTooltip}
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
