import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Person } from '../types';
import { translations } from '../translations';

// Subcomponents
import PersonCard from './people/PersonCard';
import AddPersonModal from './people/AddPersonModal';

interface PeopleViewProps {
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id' | 'initials' | 'colorTheme'>) => void;
  onDeletePerson: (id: string) => void;
  lang: 'pt' | 'en';
  onNavigate: (screen: any) => void;
}

export default function PeopleView({
  people,
  onAddPerson,
  onDeletePerson,
  lang,
  onNavigate,
}: PeopleViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = translations[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
      id="people-view"
    >
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer group transition-colors mb-3"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{lang === 'pt' ? 'Voltar para o Painel' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a146b] dark:text-slate-100">
            {t.peopleTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            {t.peopleDesc}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          type="button"
        >
          <UserPlus className="w-4 h-4" />
          {t.registerResident}
        </button>
      </div>

      {/* People Cards Grid */}
      <div className="grid grid-cols-1 gap-3" id="people-cards-list">
        {people.map((p) => (
          <PersonCard
            key={p.id}
            person={p}
            onDelete={onDeletePerson}
            t={t}
          />
        ))}
      </div>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddPerson}
        t={t}
        lang={lang}
      />
    </motion.div>
  );
}
