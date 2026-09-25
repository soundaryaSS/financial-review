/**
 * Type-Safe API Client for FastAPI Backend
 */

import {
  PnLStatement,
  Transaction,
  TransactionUpdate,
  VarianceAnalysis,
  ReviewItem,
  ChatResponse,
  ChatMessage
} from './types';

// Dynamic API BASE: Uses relative '/api' in production or when served by FastAPI,
// or localhost:8000 during standalone frontend Vite dev (port 5173).
const isViteDev = window.location.port === '5173';
const API_BASE = isViteDev ? 'http://localhost:8000/api' : '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchPnL(): Promise<PnLStatement> {
  const res = await fetch(`${API_BASE}/pnl`);
  if (!res.ok) throw new Error('Failed to load P&L Statement');
  return res.json();
}

export async function fetchVariances(periodA = '2026-02', periodB = '2026-03'): Promise<VarianceAnalysis[]> {
  const res = await fetch(`${API_BASE}/variances?period_a=${periodA}&period_b=${periodB}`);
  if (!res.ok) throw new Error('Failed to load Variance Analysis');
  return res.json();
}

export async function fetchReviewQueue(): Promise<ReviewItem[]> {
  const res = await fetch(`${API_BASE}/review-queue`);
  if (!res.ok) throw new Error('Failed to load Review Queue');
  return res.json();
}

export async function fetchTransactions(filters?: {
  category?: string;
  period?: string;
  is_pnl?: boolean;
  review_required?: boolean;
  search?: string;
}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.period) params.append('period', filters.period);
  if (filters?.is_pnl !== undefined) params.append('is_pnl', String(filters.is_pnl));
  if (filters?.review_required !== undefined) params.append('review_required', String(filters.review_required));
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load Transactions');
  return res.json();
}

export async function updateTransaction(txId: string, update: TransactionUpdate): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions/${txId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  });
  if (!res.ok) throw new Error(`Failed to update transaction ${txId}`);
  return res.json();
}

export async function askFinancialAnalyst(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_history: history })
  });
  if (!res.ok) throw new Error('Failed to get answer from AI Analyst');
  return res.json();
}

export async function uploadTransactionsCSV(file: File): Promise<{ message: string; count: number }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload CSV file');
  return res.json();
}

export async function resetBenchmarkDataset(): Promise<{ message: string; count: number }> {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset dataset');
  return res.json();
}
