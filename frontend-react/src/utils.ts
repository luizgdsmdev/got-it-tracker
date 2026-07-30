export function getCurrencySymbol(currency: 'USD' | 'EUR' | 'GBP' | 'JPY'): string {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'JPY':
      return '¥';
    case 'USD':
    default:
      return '$';
  }
}

export function formatCurrency(amount: number, currency: 'USD' | 'EUR' | 'GBP' | 'JPY'): string {
  const symbol = getCurrencySymbol(currency);
  // Simple clean formatting
  return `${amount < 0 ? '-' : ''}${symbol}${Math.abs(amount).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatRelativeDate(dateStr: string, lang: 'pt' | 'en' = 'pt'): string {
  if (!dateStr) {
    return lang === 'pt' ? 'Hoje' : 'Today';
  }

  let txDate: Date;

  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      txDate = new Date(year, month, day);
    } else {
      txDate = new Date(dateStr);
    }
  } else if (dateStr.length === 10 && dateStr.includes('-')) {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    txDate = new Date(year, month, day);
  } else {
    txDate = new Date(dateStr);
  }

  if (isNaN(txDate.getTime())) {
    return dateStr;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());

  const diffInMs = today.getTime() - targetDay.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  let timeStr = '';
  if (dateStr.includes('T')) {
    const timePart = dateStr.split('T')[1];
    if (timePart) {
      const timeClean = timePart.substring(0, 5);
      if (timeClean && timeClean.includes(':')) {
        timeStr = timeClean;
      }
    }
  }

  if (diffInDays === 0) {
    if (timeStr) {
      return lang === 'pt' ? `Hoje às ${timeStr}` : `Today at ${timeStr}`;
    }
    return lang === 'pt' ? 'Hoje' : 'Today';
  }

  if (diffInDays === 1) {
    if (timeStr) {
      return lang === 'pt' ? `Ontem às ${timeStr}` : `Yesterday at ${timeStr}`;
    }
    return lang === 'pt' ? 'Ontem' : 'Yesterday';
  }

  if (diffInDays === -1) {
    return lang === 'pt' ? 'Amanhã' : 'Tomorrow';
  }

  if (diffInDays < -1) {
    const daysAhead = Math.abs(diffInDays);
    return lang === 'pt' ? `Em ${daysAhead} dias` : `In ${daysAhead} days`;
  }

  if (diffInDays > 1 && diffInDays <= 6) {
    return lang === 'pt' ? `${diffInDays} dias atrás` : `${diffInDays} days ago`;
  }

  if (diffInDays >= 7 && diffInDays < 14) {
    return lang === 'pt' ? 'Semana passada' : 'Last week';
  }

  if (diffInDays >= 14 && diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return lang === 'pt' ? `${weeks} semanas atrás` : `${weeks} weeks ago`;
  }

  if (diffInDays >= 30 && diffInDays < 60) {
    return lang === 'pt' ? 'Mês passado' : 'Last month';
  }

  if (diffInDays >= 60 && diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return lang === 'pt' ? `${months} meses atrás` : `${months} months ago`;
  }

  if (diffInDays >= 365 && diffInDays < 730) {
    return lang === 'pt' ? 'Ano passado' : 'Last year';
  }

  const years = Math.floor(diffInDays / 365);
  return lang === 'pt' ? `${years} anos atrás` : `${years} years ago`;
}

export type ApprovalStatusKey = 'approved' | 'pending' | 'rejected';

export interface ApprovalStatusInfo {
  key: ApprovalStatusKey;
  label: string;
  badgeClass: string;
  dotClass: string;
}

export function getApprovalStatusInfo(status?: number, lang: 'pt' | 'en' = 'pt'): ApprovalStatusInfo {
  if (status === 0) {
    return {
      key: 'pending',
      label: lang === 'pt' ? 'Pendente' : 'Pending',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      dotClass: 'bg-amber-500',
    };
  }
  if (status === 2) {
    return {
      key: 'rejected',
      label: lang === 'pt' ? 'Rejeitado' : 'Rejected',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      dotClass: 'bg-rose-500',
    };
  }
  return {
    key: 'approved',
    label: lang === 'pt' ? 'Aprovado' : 'Approved',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    dotClass: 'bg-emerald-500',
  };
}

export function filterTransactionsByStatus<T extends { approvalStatus?: number }>(
  transactions: T[],
  filter: 'all' | 'approved' | 'pending' | 'rejected'
): T[] {
  if (filter === 'all') return transactions;
  if (filter === 'approved') {
    return transactions.filter((t) => t.approvalStatus === 1 || t.approvalStatus === undefined);
  }
  if (filter === 'pending') {
    return transactions.filter((t) => t.approvalStatus === 0);
  }
  if (filter === 'rejected') {
    return transactions.filter((t) => t.approvalStatus === 2);
  }
  return transactions;
}

