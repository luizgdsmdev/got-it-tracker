import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Person, Playground, GlobalSettings } from '../types';
import { translations } from '../translations';

// Subcomponents
import ConfigurePlaygroundForm from './configure-playground/ConfigurePlaygroundForm';

interface ConfigurePlaygroundViewProps {
  people: Person[];
  currentUser?: Person;
  settings: GlobalSettings;
  onAddPlayground: (playground: Omit<Playground, 'id' | 'balance' | 'progress'>) => void;
  onNavigate: (screen: any) => void;
  lang: 'pt' | 'en';
  onAddPerson: (person: Omit<Person, 'id' | 'initials' | 'colorTheme'> | Person) => void;
}

export default function ConfigurePlaygroundView({
  people,
  currentUser,
  settings,
  onAddPlayground,
  onNavigate,
  lang,
}: ConfigurePlaygroundViewProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requireVerification, setRequireVerification] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(
        lang === 'pt'
          ? 'Por favor, informe o nome do playground financeiro.'
          : 'Please enter the playground name.'
      );
      return;
    }
    if (!description.trim()) {
      setError(
        lang === 'pt'
          ? 'Por favor, informe uma breve descrição.'
          : 'Please enter a description.'
      );
      return;
    }

    const defaultOwnerName = currentUser?.name || people[0]?.name || '';
    const ownerUserId = currentUser?.id || people[0]?.id || '';

    onAddPlayground({
      name,
      description,
      ownerName: defaultOwnerName,
      requireVerification,
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      memberIds: [ownerUserId],
    });

    setSuccess(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto space-y-6 pb-12"
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

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a146b] dark:text-slate-100">
          {t.createPlaygroundTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          {lang === 'pt'
            ? 'Crie uma nova área financeira cooperativa definindo as informações básicas e regras de aprovação.'
            : 'Create a new cooperative financial area by defining basic info and approval rules.'}
        </p>
      </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
            {t.playgroundCreatedSuccess}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-500">
            {lang === 'pt' ? 'Redirecionando para o painel...' : 'Redirecting to dashboard...'}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <ConfigurePlaygroundForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            requireVerification={requireVerification}
            setRequireVerification={setRequireVerification}
            error={error}
            onCancel={() => onNavigate('dashboard')}
            t={t}
            lang={lang}
          />
        </form>
      )}
    </motion.div>
  );
}
