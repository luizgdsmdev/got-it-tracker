import { Person, Transaction, Playground, Approval, GlobalSettings } from './types';

export const initialPeople: Person[] = [];

export const initialTransactions: Transaction[] = [];

export const initialPlaygrounds: Playground[] = [];

export const initialApprovals: Approval[] = [];

export const initialSettings: GlobalSettings = {
  defaultCurrency: 'USD',
  monthlyClosingDate: 28,
  autoExport: true,
  limitBreachAlerts: true,
};
