import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Lock, Calendar, Save, Loader2, AlertCircle } from 'lucide-react';
import { updateUserApi, validatePassword, getAuthUser } from '../../services/api';
import { Person } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'pt' | 'en';
  currentUser?: Person;
  onProfileUpdated: (updatedUser: any) => void;
  addToast: (toast: any) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  lang,
  currentUser,
  onProfileUpdated,
  addToast,
}: EditProfileModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const currentAuth = getAuthUser() || {};
      const initialName = currentAuth.name || currentUser?.name || '';
      const initialEmail = currentAuth.email || currentUser?.email || '';
      const initialAge = currentAuth.age != null ? String(currentAuth.age) : currentUser?.age != null ? String(currentUser.age) : '';

      setName(initialName);
      setEmail(initialEmail);
      setAge(initialAge);
      setPassword('');
      setError('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(lang === 'pt' ? 'O nome não pode ficar em branco.' : 'Name cannot be empty.');
      return;
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      setError(lang === 'pt' ? 'Informe uma idade válida.' : 'Please enter a valid age.');
      return;
    }

    const trimmedPassword = password.trim();
    if (trimmedPassword) {
      const passVal = validatePassword(trimmedPassword);
      if (!passVal.valid) {
        setError(passVal.error || (lang === 'pt' ? 'A senha deve conter maiúscula, minúscula, número e caractere especial (mínimo 8 caracteres).' : 'Password must contain uppercase, lowercase, number, and special character.'));
        return;
      }
    }

    // Email is read-only and retrieved from auth/currentUser
    const currentAuth = getAuthUser() || {};
    const userEmail = currentAuth.email || currentUser?.email || email;

    const payload = {
      name: trimmedName,
      age: ageNum,
      email: userEmail,
      password: trimmedPassword || 'qwQW12!@', // default strong password if untouched
    };

    setIsLoading(true);

    try {
      const response = await updateUserApi(payload);

      const val = response.value || (response as any);
      const updatedUser = val?.user || {
        id: currentAuth.id || currentUser?.id,
        name: payload.name,
        age: payload.age,
        email: payload.email,
      };

      onProfileUpdated(updatedUser);
      addToast({
        type: 'success',
        title: lang === 'pt' ? 'Perfil Atualizado' : 'Profile Updated',
        message: lang === 'pt' ? 'Perfil e tokens atualizados no navegador!' : 'Profile and tokens updated successfully!',
      });
      onClose();
    } catch (err: any) {
      console.error('Update user error:', err);
      setError(err.message || (lang === 'pt' ? 'Erro ao atualizar perfil.' : 'Failed to update profile.'));
      addToast({
        type: 'error',
        title: err.errorType || (lang === 'pt' ? 'Erro' : 'Error'),
        message: err.message || (lang === 'pt' ? 'Erro ao atualizar perfil.' : 'Failed to update profile.'),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-[#1a146b] dark:text-slate-100">
                {lang === 'pt' ? 'Editar Meu Perfil' : 'Edit Profile'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'pt' ? 'Atualização de nome, idade e senha' : 'Update name, age, and password'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'pt' ? 'Nome Completo' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'pt' ? 'Idade' : 'Age'}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Email (Disabled / Readonly) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'pt' ? 'E-mail (Não editável)' : 'Email (Read-only)'}
                </label>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded-md">
                  {lang === 'pt' ? 'Bloqueado' : 'Locked'}
                </span>
              </div>
              <div className="relative opacity-75">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed select-none font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'pt' ? 'Não é permitido alterar o e-mail cadastrado.' : 'Email address cannot be modified.'}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'pt' ? 'Senha' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="qwQW12!@"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'pt' ? 'Exigido caractere maiúsculo, minúsculo, número e caractere especial.' : 'Requires uppercase, lowercase, digit, and special character.'}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'pt' ? 'Salvando...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{lang === 'pt' ? 'Salvar Alterações' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
