import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Person, Transaction, GlobalSettings, Playground } from '../types';
import { getCurrencySymbol } from '../utils';
import { translations } from '../translations';
import { getAllMembersByPlaygroundApi, PlaygroundMemberApiItem } from '../services/playgroundMemberService';
import { getAuthUser } from '../services/api';

// Subcomponents
import AddTransactionForm from './add-transaction/AddTransactionForm';

interface AddTransactionViewProps {
  people: Person[];
  playgrounds: Playground[];
  settings: GlobalSettings;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<any> | void;
  onNavigate: (screen: any) => void;
  lang: 'pt' | 'en';
  preSelectedPlaygroundId?: string | null;
  currentUser?: Person;
}

export default function AddTransactionView({
  people,
  playgrounds,
  settings,
  onAddTransaction,
  onNavigate,
  lang,
  preSelectedPlaygroundId,
  currentUser,
}: AddTransactionViewProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [playgroundId, setPlaygroundId] = useState(preSelectedPlaygroundId || '');
  const [apiMembers, setApiMembers] = useState<PlaygroundMemberApiItem[] | null>(null);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Auto-select first playground if not selected
  useEffect(() => {
    if (!playgroundId && playgrounds.length > 0) {
      setPlaygroundId(playgrounds[0].id);
    }
  }, [playgrounds, playgroundId]);
  
  // Fetch members from API whenever playgroundId changes
  useEffect(() => {
    if (!playgroundId) {
      setApiMembers(null);
      return;
    }

    let isMounted = true;
    setIsLoadingMembers(true);

    getAllMembersByPlaygroundApi(playgroundId)
      .then((members: PlaygroundMemberApiItem[]) => {
        if (isMounted) {
          if (Array.isArray(members)) {
            setApiMembers(members);
          } else {
            setApiMembers([]);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch playground members from API:', err);
        if (isMounted) {
          // Fallback to local memberIds if API error occurs
          setApiMembers(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingMembers(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [playgroundId]);

  // Filter people based on members of the selected playground
  const selectedPlayground = playgrounds.find((p) => p.id === playgroundId);
  const currentMemberIds = selectedPlayground?.memberIds || [];

  const authUser = getAuthUser();
  const currentUserId = authUser?.id || currentUser?.id || '';

  const filteredPeople: Person[] = playgroundId
    ? (apiMembers !== null
        ? apiMembers.map((item) => {
            const pid = item.personId || item.userId || '';
            const found = people.find((p) => p.id.toLowerCase() === pid.toLowerCase() || (p.email && item.userId && p.id === item.userId));
            const isCurrentUser = Boolean(currentUserId && pid.toLowerCase() === currentUserId.toLowerCase());

            let displayName = '';
            if (isCurrentUser) {
              displayName = lang === 'pt' ? 'Você' : 'You';
            } else if (found && found.name && !found.name.includes('-')) {
              displayName = found.name;
            } else if (item.name) {
              displayName = item.name;
            } else if (found && found.name) {
              displayName = found.name;
            } else if (found && found.email) {
              const emailName = found.email.split('@')[0];
              displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            } else {
              displayName = lang === 'pt' ? 'Membro' : 'Member';
            }

            return {
              id: pid,
              name: displayName,
              initials: found?.initials || displayName.slice(0, 2).toUpperCase() || 'MB',
              age: item.age ?? found?.age ?? 25,
              role: 'Member',
              tag: found?.tag || pid.substring(0, 4),
              spendingLimit: found?.spendingLimit || 1000,
              permissionEnabled: true,
              email: found?.email,
            };
          })
        : (currentMemberIds.length > 0
            ? currentMemberIds.map((pid) => {
                const found = people.find((p) => p.id.toLowerCase() === pid.toLowerCase());
                const isCurrentUser = Boolean(currentUserId && pid.toLowerCase() === currentUserId.toLowerCase());

                let displayName = '';
                if (isCurrentUser) {
                  displayName = lang === 'pt' ? 'Você' : 'You';
                } else if (found && found.name) {
                  displayName = found.name;
                } else if (found && found.email) {
                  const emailName = found.email.split('@')[0];
                  displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                } else {
                  displayName = lang === 'pt' ? 'Membro' : 'Member';
                }

                return {
                  id: pid,
                  name: displayName,
                  initials: found?.initials || 'MB',
                  age: found?.age ?? 25,
                  role: 'Member',
                  tag: found?.tag || pid.substring(0, 4),
                  spendingLimit: found?.spendingLimit || 1000,
                  permissionEnabled: true,
                };
              })
            : people.map((p) => {
                const isCurrentUser = Boolean(currentUserId && p.id.toLowerCase() === currentUserId.toLowerCase());
                return isCurrentUser ? { ...p, name: lang === 'pt' ? 'Você' : 'You' } : p;
              })))
    : [];

  const [personId, setPersonId] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [minorWarning, setMinorWarning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync personId when playgroundId or filteredPeople changes
  useEffect(() => {
    if (filteredPeople.length > 0) {
      const isValid = filteredPeople.some(
        (p) => personId && p.id.toLowerCase() === personId.toLowerCase()
      );
      if (!isValid) {
        // Prefer selecting current user if present in filteredPeople
        const userInList = filteredPeople.find(
          (p) => currentUserId && p.id.toLowerCase() === currentUserId.toLowerCase()
        );
        if (userInList) {
          setPersonId(userInList.id);
        } else {
          setPersonId(filteredPeople[0].id);
        }
      }
    } else {
      setPersonId('');
    }
  }, [playgroundId, filteredPeople]);

  const t = translations[lang];

  // Check if chosen person is minor (e.g. Under 18)
  const selectedPerson = filteredPeople.find(
    (p) => personId && p.id.toLowerCase() === personId.toLowerCase()
  ) || people.find((p) => personId && p.id.toLowerCase() === personId.toLowerCase());

  useEffect(() => {
    if (selectedPerson && selectedPerson.age < 18) {
      setMinorWarning(true);
      // Force to expense if income is selected
      if (type === 'income') {
        setType('expense');
      }
    } else {
      setMinorWarning(false);
    }
  }, [personId, selectedPerson, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!description.trim()) {
      setError(lang === 'pt' ? 'Por favor, informe a descrição da transação.' : 'Please enter the transaction description.');
      return;
    }

    if (!playgroundId) {
      setError(lang === 'pt' ? 'Por favor, selecione um playground.' : 'Please select a playground.');
      return;
    }

    if (!value || Number(value) <= 0) {
      setError(lang === 'pt' ? 'Por favor, informe um valor válido maior que zero.' : 'Please enter a valid value greater than zero.');
      return;
    }

    // Double check minor restriction
    if (selectedPerson && selectedPerson.age < 18 && type === 'income') {
      setError(t.minorWarningText);
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddTransaction({
        description,
        value: Number(value),
        type,
        personId,
        category: type === 'income' ? 'Income' : 'General',
        playgroundId: playgroundId || undefined,
        isPublic,
      });

      setSuccess(true);
      setDescription('');
      setValue('');
    } catch (err: any) {
      console.error('Error submitting transaction:', err);
      const errMsg = err?.message || err?.errorType || (lang === 'pt' ? 'Erro ao salvar transação no servidor.' : 'Failed to save transaction on server.');
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = getCurrencySymbol(settings.defaultCurrency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-[600px] mx-auto space-y-6 pb-12"
      id="add-transaction-view"
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

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a146b] dark:text-slate-100">
          {t.addTransactionTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          {t.addTransactionDesc}
        </p>
      </div>

      <AddTransactionForm
        type={type}
        setType={setType}
        description={description}
        setDescription={setDescription}
        value={value}
        setValue={setValue}
        playgroundId={playgroundId}
        setPlaygroundId={setPlaygroundId}
        personId={personId}
        setPersonId={setPersonId}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        playgrounds={playgrounds}
        filteredPeople={filteredPeople}
        selectedPerson={selectedPerson}
        minorWarning={minorWarning}
        error={error}
        success={success}
        setSuccess={setSuccess}
        isSubmitting={isSubmitting}
        currencySymbol={currencySymbol}
        handleSubmit={handleSubmit}
        isLoadingMembers={isLoadingMembers}
        t={t}
        lang={lang}
      />
    </motion.div>
  );
}
