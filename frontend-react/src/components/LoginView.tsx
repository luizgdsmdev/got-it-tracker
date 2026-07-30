import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Languages, Sun, Moon } from 'lucide-react';
import { translations } from '../translations';
import { registerApi, loginApi, validatePassword, saveAuthData } from '../services/api';

// Subcomponents
import LoginForm from './login/LoginForm';
import RegisterForm from './login/RegisterForm';

interface LoginViewProps {
  lang: 'pt' | 'en';
  darkMode?: boolean;
  onToggleLang?: () => void;
  onToggleTheme?: () => void;
  onLoginSuccess: (user: any, accessToken?: string) => void;
}

export default function LoginView({
  lang,
  darkMode = false,
  onToggleLang,
  onToggleTheme,
  onLoginSuccess,
}: LoginViewProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration form state
  const [registerName, setRegisterName] = useState('');
  const [registerAge, setRegisterAge] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (tab === 'login') {
      if (!email.trim()) {
        setError(t.validationEmail);
        return;
      }
      if (!password.trim()) {
        setError(lang === 'pt' ? 'Por favor informe a senha.' : 'Please enter your password.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await loginApi({ email, password });
        const { accessToken, refreshToken, expiresAt, user } = response.value;

        // Save token and user securely in browser localStorage
        saveAuthData(accessToken, refreshToken, expiresAt, user);

        setSuccessMsg(lang === 'pt' ? 'Login realizado com sucesso!' : 'Login successful!');
        setTimeout(() => {
          onLoginSuccess(user, accessToken);
        }, 300);
      } catch (err: any) {
        setError(err.message || (lang === 'pt' ? 'Falha no login.' : 'Login failed.'));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register submission
      if (!registerName.trim() || !registerEmail.trim() || !registerAge || !registerPassword.trim()) {
        setError(t.validationFields);
        return;
      }

      const ageNum = Number(registerAge);
      if (isNaN(ageNum) || ageNum <= 0) {
        setError(lang === 'pt' ? 'Informe uma idade válida.' : 'Please enter a valid age.');
        return;
      }

      // Password Validation: must contain 1 uppercase, 1 lowercase, 1 digit, 1 special char, 8-100 len
      const passVal = validatePassword(registerPassword);
      if (!passVal.valid) {
        setError(passVal.error || 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await registerApi({
          name: registerName,
          age: ageNum,
          email: registerEmail,
          password: registerPassword,
        });

        const registeredUser = response.value;

        // Auto-fill login form with response email and password
        setEmail(registeredUser.email || registerEmail);
        setPassword(registerPassword);

        // Switch to login tab & inform user
        setTab('login');
        setSuccessMsg(
          lang === 'pt'
            ? 'Cadastro realizado com sucesso! Os campos de login foram preenchidos com seus dados.'
            : 'Registration successful! Login fields have been auto-filled with your credentials.'
        );

        // Clear register form state
        setRegisterName('');
        setRegisterAge('');
        setRegisterEmail('');
        setRegisterPassword('');
      } catch (err: any) {
        setError(err.message || (lang === 'pt' ? 'Falha no cadastro.' : 'Registration failed.'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[440px] w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-6"
    >
      {/* Top Header with Language & Theme options */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {tab === 'login' ? t.loginTitle : t.registerTitle}
        </span>
        <div className="flex items-center gap-2">
          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
            >
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'pt' ? 'PT' : 'EN'}</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={lang === 'pt' ? 'Alternar tema escuro/claro' : 'Toggle dark/light theme'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Tab Selection */}
      <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
        <button
          type="button"
          onClick={() => {
            setTab('login');
            setError('');
            setSuccessMsg('');
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'login'
              ? 'bg-white dark:bg-slate-700 text-[#1a146b] dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:dark:text-slate-300'
          }`}
        >
          {t.loginTitle}
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('register');
            setError('');
            setSuccessMsg('');
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            tab === 'register'
              ? 'bg-white dark:bg-slate-700 text-[#1a146b] dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:dark:text-slate-300'
          }`}
        >
          {t.registerTitle}
        </button>
      </div>

      {/* Dynamic Notifications */}
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug font-semibold">{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {tab === 'login' ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            t={t}
          />
        ) : (
          <RegisterForm
            registerName={registerName}
            setRegisterName={setRegisterName}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerAge={registerAge}
            setRegisterAge={setRegisterAge}
            registerPassword={registerPassword}
            setRegisterPassword={setRegisterPassword}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            t={t}
          />
        )}
      </div>
    </motion.div>
  );
}

