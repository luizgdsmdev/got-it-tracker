import { apiFetch, parseApiError, ApiError } from './api';
import { Transaction } from '../types';

export interface ApiTransaction {
  id: string;
  playgroundId: string;
  personId: string;
  description: string;
  amount: number;
  type: number; // 1 = Income, 2 = Expense
  isPublic?: boolean;
  approvalStatus?: number;
  createdAt?: string;
  transactionDate?: string;
}

export interface CreateTransactionPayload {
  playgroundId: string;
  personId: string;
  description: string;
  amount: number;
  type: number; // 1 = Income, 2 = Expense
  isPublic: boolean;
}

export interface UpdateTransactionPayload {
  description: string;
  amount: number;
  type: number;
  transactionDate?: string;
}

/**
 * Map API Transaction to Frontend Transaction
 */
export function mapApiTransactionToFrontend(apiTx: any): Transaction {
  const raw = apiTx?.value || apiTx?.result || apiTx || {};
  const isIncome = raw.type === 1 || String(raw.type).toLowerCase() === 'income';
  const rawAmount = raw.amount !== undefined ? raw.amount : (raw.value !== undefined ? raw.value : 0);
  const dateStr = raw.createdAt || raw.transactionDate || raw.date || new Date().toISOString();

  return {
    id: raw.id || `tx_${Date.now()}`,
    description: raw.description || '',
    value: Number(rawAmount) || 0,
    type: isIncome ? 'income' : 'expense',
    date: typeof dateStr === 'string' ? dateStr.split('T')[0] : new Date().toISOString().split('T')[0],
    personId: raw.personId || '',
    category: isIncome ? 'Income' : 'Expense',
    playgroundId: raw.playgroundId || '',
    isPublic: raw.isPublic ?? true,
    approvalStatus: raw.approvalStatus,
  };
}

/**
 * Map Frontend Transaction Type string to API number
 */
export function mapTypeStringToNumber(type: 'income' | 'expense'): number {
  return type === 'income' ? 1 : 2;
}

/**
 * POST /api/transactions/playground/{playgroundID}
 * Create a transaction inside a playground
 */
export async function createTransactionApi(
  playgroundId: string,
  payload: CreateTransactionPayload
): Promise<ApiTransaction> {
  const res = await apiFetch(`transactions/playground/${playgroundId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  return data?.value || data?.result || data;
}

/**
 * GET /api/transactions/playground/{playgroundID}
 * Fetch all transactions for a specific playground
 */
export async function getPlaygroundTransactionsApi(
  playgroundId: string
): Promise<ApiTransaction[]> {
  const res = await apiFetch(`transactions/playground/${playgroundId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.value)) return data.value;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}

/**
 * GET /api/transactions/playground/{playgroundId}/{transactionId}
 * Fetch transaction by ID
 */
export async function getTransactionByIdApi(
  playgroundId: string,
  transactionId: string
): Promise<ApiTransaction> {
  const res = await apiFetch(`transactions/playground/${playgroundId}/${transactionId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  return data?.value || data?.result || data;
}

/**
 * PUT /api/transactions/playground/{playgroundId}/{transactionId}
 * Update a transaction
 */
export async function updateTransactionApi(
  playgroundId: string,
  transactionId: string,
  payload: UpdateTransactionPayload
): Promise<ApiTransaction> {
  const res = await apiFetch(`transactions/playground/${playgroundId}/${transactionId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  return data?.value || data?.result || data;
}

/**
 * DELETE /api/transactions/playground/{playgroundId}/{transactionId}
 * Delete a transaction
 */
export async function deleteTransactionApi(
  playgroundId: string,
  transactionId: string
): Promise<ApiTransaction> {
  const res = await apiFetch(`transactions/playground/${playgroundId}/${transactionId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  return data?.value || data?.result || data;
}

/**
 * GET /api/transactions/all
 * Fetch all transactions for the current user/person across playgrounds
 */
export async function getAllPersonTransactionsApi(): Promise<ApiTransaction[]> {
  const res = await apiFetch('transactions/all', {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.value)) return data.value;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}
