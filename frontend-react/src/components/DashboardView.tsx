import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Person, Transaction, GlobalSettings, Playground } from '../types';
import { translations } from '../translations';
import { filterTransactionsByStatus } from '../utils';
import { StatusFilterValue } from './common/ApprovalStatusFilter';

// Modular Dashboard Components
import BalanceHeroCard from './dashboard/BalanceHeroCard';
import PlaygroundsSection from './dashboard/PlaygroundsSection';
import WeeklyComparisonChart from './dashboard/WeeklyComparisonChart';
import SmartTipCard from './dashboard/SmartTipCard';
import RecentActivityList from './dashboard/RecentActivityList';

interface DashboardViewProps {
  transactions: Transaction[];
  people: Person[];
  playgrounds: Playground[];
  settings: GlobalSettings;
  onNavigate: (screen: any, payload?: string) => void;
  currentUser: Person;
  lang: 'pt' | 'en';
  onAddPerson: (person: Omit<Person, 'id' | 'initials' | 'colorTheme'>, playgroundIds?: string[]) => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

export default function DashboardView({
  transactions,
  people,
  playgrounds,
  settings,
  onNavigate,
  lang,
  onSelectTransaction,
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('approved');

  const t = translations[lang];

  // Counts of transactions by status
  const heroCounts = useMemo(() => {
    return {
      all: transactions.length,
      approved: transactions.filter((t) => t.approvalStatus === 1 || t.approvalStatus === undefined).length,
      pending: transactions.filter((t) => t.approvalStatus === 0).length,
      rejected: transactions.filter((t) => t.approvalStatus === 2).length,
    };
  }, [transactions]);

  // Filter transactions for Big Numbers calculation according to selected status filter
  const filteredBigNumberTransactions = useMemo(() => {
    return filterTransactionsByStatus(transactions, statusFilter);
  }, [transactions, statusFilter]);

  // Calculate stats for Big Numbers
  const expenses = filteredBigNumberTransactions.filter((t) => t.type === 'expense');
  const incomes = filteredBigNumberTransactions.filter((t) => t.type === 'income');

  const totalExpense = expenses.reduce((acc, t) => acc + t.value, 0);
  const totalIncome = incomes.reduce((acc, t) => acc + t.value, 0);
  const totalBalance = totalIncome - totalExpense;

  // Calculate playgrounds with dynamic balances from transactions
  const playgroundsWithBalances = playgrounds.map((p) => {
    const pTransactions = transactions.filter((tx) => tx.playgroundId === p.id);
    const pBalance = pTransactions.reduce(
      (acc, tx) => acc + (tx.type === 'income' ? tx.value : -tx.value),
      0
    );
    return { ...p, balance: pBalance };
  });

  // Calculate dynamic weekly data from transaction dates for current month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const currentMonthTx = transactions.filter((tx) => {
    if (!tx.date) return false;
    const parts = tx.date.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      return year === currentYear && month === currentMonth;
    }
    return false;
  });

  // Use current month transactions if present, otherwise use all transactions
  const chartTxList = currentMonthTx.length > 0 ? currentMonthTx : transactions;

  const weeklySums = [
    { week: 'W1', income: 0, expense: 0 },
    { week: 'W2', income: 0, expense: 0 },
    { week: 'W3', income: 0, expense: 0 },
    { week: 'W4', income: 0, expense: 0 },
  ];

  chartTxList.forEach((tx) => {
    let day = 1;
    if (tx.date) {
      const parts = tx.date.split('-');
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

  const weeklyData = weeklySums.map((w) => ({
    ...w,
    incomeHeight: w.income > 0 ? `${Math.min(100, Math.max(15, Math.round((w.income / maxVal) * 100)))}%` : '6px',
    expenseHeight: w.expense > 0 ? `${Math.min(100, Math.max(15, Math.round((w.expense / maxVal) * 100)))}%` : '6px',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 pb-16"
      id="dashboard-view"
    >
      {/* Total Balance Hero Card with Status Filter for Big Numbers */}
      <BalanceHeroCard
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        settings={settings}
        t={t}
        lang={lang}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={heroCounts}
      />


      {/* Playgrounds Section with Name Search */}
      <PlaygroundsSection
        playgrounds={playgroundsWithBalances}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        settings={settings}
        t={t}
        lang={lang}
        onNavigate={onNavigate}
      />

      {/* Period Comparison Charts & Bento Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Period Comparison Chart (12 cols) */}
        <WeeklyComparisonChart
          weeklyData={weeklyData}
          settings={settings}
          t={t}
          lang={lang}
        />

        {/* Smart Tip (4 cols) - Commented out for now
        <SmartTipCard
          t={t}
          onNavigate={onNavigate}
        />
        */}
      </div>

      {/* Recent Activity List */}
      <RecentActivityList
        transactions={transactions}
        people={people}
        settings={settings}
        t={t}
        lang={lang}
        onNavigate={onNavigate}
        onSelectTransaction={onSelectTransaction}
      />
    </motion.div>
  );
}

