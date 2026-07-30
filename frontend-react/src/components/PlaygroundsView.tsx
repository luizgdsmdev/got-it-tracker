import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowLeft, Calendar, RotateCcw } from 'lucide-react';
import { Playground, Transaction, GlobalSettings } from '../types';
import { translations } from '../translations';

// Subcomponents
import PlaygroundsAtmosphere from './playground/PlaygroundsAtmosphere';
import PlaygroundGridItem from './playground/PlaygroundGridItem';
import WeeklyComparisonChart from './playground/WeeklyComparisonChart';

interface PlaygroundsViewProps {
  playgrounds: Playground[];
  transactions?: Transaction[];
  settings: GlobalSettings;
  onNavigate: (screen: any, payload?: string) => void;
  lang: 'pt' | 'en';
}

export default function PlaygroundsView({
  playgrounds,
  transactions = [],
  settings,
  onNavigate,
  lang,
}: PlaygroundsViewProps) {
  const t = translations[lang];

  // Date Filter States
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'month' | 'year'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().substring(0, 7));
  const [selectedYear, setSelectedYear] = useState<string>(() => `${new Date().getFullYear()}`);

  // Filter transactions by date
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (!tx.date) return filterMode === 'all';
      const cleanDate = tx.date.split('T')[0];

      if (filterMode === 'day') {
        return cleanDate === selectedDate;
      }
      if (filterMode === 'month') {
        return cleanDate.startsWith(selectedMonth);
      }
      if (filterMode === 'year') {
        return cleanDate.startsWith(selectedYear);
      }
      return true;
    });
  }, [transactions, filterMode, selectedDate, selectedMonth, selectedYear]);

  // Totals calculated strictly from API transactions
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);
  }, [filteredTransactions]);

  const consolidatedBalance = totalIncome - totalExpense;

  // Filter label description
  const filterLabel = useMemo(() => {
    if (filterMode === 'day') {
      const parts = selectedDate.split('-');
      const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : selectedDate;
      return lang === 'pt' ? `Filtrado por Dia (${formatted})` : `Filtered by Day (${formatted})`;
    }
    if (filterMode === 'month') {
      const parts = selectedMonth.split('-');
      const formatted = parts.length === 2 ? `${parts[1]}/${parts[0]}` : selectedMonth;
      return lang === 'pt' ? `Filtrado por Mês (${formatted})` : `Filtered by Month (${formatted})`;
    }
    if (filterMode === 'year') {
      return lang === 'pt' ? `Filtrado por Ano (${selectedYear})` : `Filtered by Year (${selectedYear})`;
    }
    return lang === 'pt' ? 'Todas as transações do servidor' : 'All server transactions';
  }, [filterMode, selectedDate, selectedMonth, selectedYear, lang]);

  // Playgrounds with dynamic balances computed from transactions
  const playgroundsWithBalances = useMemo(() => {
    return playgrounds.map((p) => {
      const pTransactions = transactions.filter((tx) => tx.playgroundId === p.id);
      const pBalance = pTransactions.reduce(
        (acc, tx) => acc + (tx.type === 'income' ? tx.value : -tx.value),
        0
      );
      return { ...p, balance: pBalance };
    });
  }, [playgrounds, transactions]);

  // Weekly data dynamically computed from filtered API transactions
  const weeklyData = useMemo(() => {
    const isPt = lang === 'pt';
    const weeklySums = [
      { week: isPt ? 'Sem. 1' : 'WK 1', income: 0, expense: 0 },
      { week: isPt ? 'Sem. 2' : 'WK 2', income: 0, expense: 0 },
      { week: isPt ? 'Sem. 3' : 'WK 3', income: 0, expense: 0 },
      { week: isPt ? 'Sem. 4' : 'WK 4', income: 0, expense: 0 },
    ];

    filteredTransactions.forEach((tx) => {
      let day = 1;
      if (tx.date) {
        const cleanDate = tx.date.split('T')[0].replace(/\//g, '-');
        const parts = cleanDate.split('-');
        if (parts.length >= 3) {
          day = parseInt(parts[2], 10) || 1;
        }
      }

      let weekIdx = 0;
      if (day >= 22) weekIdx = 3;
      else if (day >= 15) weekIdx = 2;
      else if (day >= 8) weekIdx = 1;

      if (tx.type === 'income') {
        weeklySums[weekIdx].income += tx.value;
      } else {
        weeklySums[weekIdx].expense += tx.value;
      }
    });

    const maxVal = Math.max(
      ...weeklySums.map((w) => Math.max(w.income, w.expense)),
      1
    );

    return weeklySums.map((w) => ({
      ...w,
      incomeHeight: w.income > 0 ? `${Math.min(100, Math.max(12, Math.round((w.income / maxVal) * 100)))}%` : '6px',
      expenseHeight: w.expense > 0 ? `${Math.min(100, Math.max(12, Math.round((w.expense / maxVal) * 100)))}%` : '6px',
    }));
  }, [filteredTransactions, lang]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
      id="playgrounds-view"
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
          {t.playgroundsTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          {t.playgroundsDesc}
        </p>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4" id="playgrounds-date-filter-bar">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            {lang === 'pt' ? 'Filtro por Data:' : 'Date Filter:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Mode Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'pt' ? 'Tudo' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'pt' ? 'Dia' : 'Day'}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'month'
                  ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'pt' ? 'Mês' : 'Month'}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('year')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'year'
                  ? 'bg-white dark:bg-slate-900 text-[#1a146b] dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'pt' ? 'Ano' : 'Year'}
            </button>
          </div>

          {/* Conditional Inputs */}
          {filterMode === 'day' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          )}

          {filterMode === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          )}

          {filterMode === 'year' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          )}

          {filterMode !== 'all' && (
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title={lang === 'pt' ? 'Limpar filtro' : 'Clear filter'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Atmospheric overview card */}
      <PlaygroundsAtmosphere
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        consolidatedBalance={consolidatedBalance}
        settings={settings}
        t={t}
        lang={lang}
        filterLabel={filterLabel}
      />

      {/* Playgrounds Grid */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold pl-1">
          {t.activePlaygrounds}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="playgrounds-grid-list">
          {playgroundsWithBalances.map((play) => (
            <PlaygroundGridItem
              key={play.id}
              playground={play}
              settings={settings}
              onNavigate={onNavigate}
              t={t}
              lang={lang}
            />
          ))}

          {/* Dotted "+" Add Playground Card */}
          <div
            onClick={() => onNavigate('configure-playground')}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:dark:border-indigo-500 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/20 hover:dark:bg-indigo-950/10 transition-all min-h-[320px] group"
            id="btn-add-playground-card"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-800 text-[#1a146b] dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-4">
              {t.newPlayground}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[200px] mt-1 leading-relaxed">
              {t.newPlaygroundDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Expenses vs Income Weekly bar chart comparison */}
      <WeeklyComparisonChart
        weeklyData={weeklyData}
        settings={settings}
        t={t}
        lang={lang}
      />
    </motion.div>
  );
}

