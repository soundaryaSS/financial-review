/**
 * All Transactions Ledger View Component
 * Searchable, filterable, and editable table of all ingested bank transactions.
 */

import { Transaction } from './types';
import { formatCurrency, getConfidenceBadge } from './utils';

export function renderLedgerView(
  transactions: Transaction[],
  categories: string[],
  selectedCategory = '',
  selectedPeriod = '',
  selectedPnl = '',
  searchTerm = '',
  onEditTransaction: (tx: Transaction) => void
): string {
  const count = transactions.length;

  const tableRows = transactions.length
    ? transactions
        .map(tx => {
          const isIncome = tx.type === 'credit';
          const pnlBadge = tx.is_pnl
            ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">P&L</span>`
            : `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-700">Non-P&L</span>`;

          const reviewBadge = tx.review_required
            ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">FLAGGED</span>`
            : '';

          return `
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 text-xs cursor-pointer ledger-row" data-tx-id="${tx.id}">
              <td class="py-2.5 px-3 font-mono text-slate-400 font-medium">${tx.id}</td>
              <td class="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">${tx.date}</td>
              <td class="py-2.5 px-3 font-medium text-slate-100">
                <div class="flex items-center gap-2">
                  <span class="truncate max-w-xs md:max-w-md">${tx.description}</span>
                  ${reviewBadge}
                </div>
              </td>
              <td class="py-2.5 px-3 whitespace-nowrap text-slate-300">
                <span class="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium border border-slate-700">
                  ${tx.category}
                </span>
              </td>
              <td class="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[120px]">${tx.subcategory}</td>
              <td class="py-2.5 px-3 text-center">${pnlBadge}</td>
              <td class="py-2.5 px-3 text-center">${getConfidenceBadge(tx.confidence)}</td>
              <td class="py-2.5 px-3 text-right font-mono font-bold ${isIncome ? 'text-emerald-400' : 'text-slate-100'} whitespace-nowrap">
                ${isIncome ? '+' : '-'}${formatCurrency(tx.amount)}
              </td>
              <td class="py-2.5 px-3 text-center">
                <button class="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 edit-tx-btn" data-tx-id="${tx.id}">
                  Edit
                </button>
              </td>
            </tr>
          `;
        })
        .join('')
    : `
      <tr>
        <td colspan="9" class="py-8 text-center text-xs text-slate-500">
          No transactions match your active search and filter criteria.
        </td>
      </tr>
    `;

  const categoryOptions = categories
    .map(c => `<option value="${c}" ${c === selectedCategory ? 'selected' : ''}>${c}</option>`)
    .join('');

  return `
    <div class="space-y-4">
      <!-- Toolbar & Ingestion Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Bank Transaction Ledger
            <span class="text-xs font-normal text-slate-400">(${count} items)</span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Normalized bank entries with automated categorization, reasoning audit trail, and manual correction controls.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Ingest CSV Button -->
          <label class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-sm">
            <span>↑ Ingest CSV</span>
            <input type="file" id="csv-upload-input" accept=".csv" class="hidden" />
          </label>

          <!-- Reset Benchmark -->
          <button id="reset-dataset-btn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
            ↻ Reset Dataset
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            id="ledger-search-input"
            placeholder="Search description, ID, or vendor..."
            value="${searchTerm}"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- Category Dropdown -->
        <div>
          <select id="ledger-category-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All Categories</option>
            ${categoryOptions}
          </select>
        </div>

        <!-- Period Dropdown -->
        <div>
          <select id="ledger-period-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All Periods</option>
            <option value="2026-01" ${selectedPeriod === '2026-01' ? 'selected' : ''}>2026-01</option>
            <option value="2026-02" ${selectedPeriod === '2026-02' ? 'selected' : ''}>2026-02</option>
            <option value="2026-03" ${selectedPeriod === '2026-03' ? 'selected' : ''}>2026-03</option>
          </select>
        </div>

        <!-- P&L Status Dropdown -->
        <div>
          <select id="ledger-pnl-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All P&L Types</option>
            <option value="true" ${selectedPnl === 'true' ? 'selected' : ''}>P&L Only</option>
            <option value="false" ${selectedPnl === 'false' ? 'selected' : ''}>Non-P&L (Balance Sheet)</option>
          </select>
        </div>
      </div>

      <!-- Ledger Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10 bg-slate-950 border-b border-slate-800">
              <tr class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th class="py-2.5 px-3">TX ID</th>
                <th class="py-2.5 px-3">Date</th>
                <th class="py-2.5 px-3">Description</th>
                <th class="py-2.5 px-3">Category</th>
                <th class="py-2.5 px-3">Subcategory</th>
                <th class="py-2.5 px-3 text-center">P&L</th>
                <th class="py-2.5 px-3 text-center">AI Confidence</th>
                <th class="py-2.5 px-3 text-right">Amount</th>
                <th class="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
