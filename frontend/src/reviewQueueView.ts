/**
 * Human-in-the-Loop Review Queue View Component
 * Surfaces uncertain, anomalous, and judgment-requiring items for accountant resolution.
 * Includes Category & Severity filtering and quick category pills.
 */

import { ReviewItem, Transaction } from './types';
import { formatCurrency, getSeverityBadge, getConfidenceBadge } from './utils';

export function renderReviewQueueView(
  items: ReviewItem[],
  categories: string[],
  selectedCategory = '',
  selectedSeverity = '',
  searchTerm = '',
  onResolveItem: (txId: string, action: 'approve' | 'reclassify' | 'exclude', tx: Transaction) => void
): string {
  // Category counts
  const categoryCounts: Record<string, number> = {};
  items.forEach(it => {
    const c = it.transaction.category;
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });

  // Filter items
  let filtered = items;
  if (selectedCategory) {
    filtered = filtered.filter(it => it.transaction.category === selectedCategory);
  }
  if (selectedSeverity) {
    filtered = filtered.filter(it => it.severity === selectedSeverity);
  }
  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    filtered = filtered.filter(
      it =>
        it.transaction.description.toLowerCase().includes(s) ||
        it.transaction.id.toLowerCase().includes(s) ||
        it.transaction.subcategory.toLowerCase().includes(s)
    );
  }

  const categoryOptions = categories
    .map(c => `<option value="${c}" ${c === selectedCategory ? 'selected' : ''}>${c} (${categoryCounts[c] || 0})</option>`)
    .join('');

  // Quick category pills
  const allPill = `
    <button class="review-cat-pill px-3 py-1 rounded-full text-xs font-medium transition-all ${
      selectedCategory === ''
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
    }" data-category="">
      All Categories (${items.length})
    </button>
  `;

  const categoryPills = categories
    .filter(c => (categoryCounts[c] || 0) > 0)
    .map(c => {
      const isSelected = selectedCategory === c;
      return `
        <button class="review-cat-pill px-3 py-1 rounded-full text-xs font-medium transition-all ${
          isSelected
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
        }" data-category="${c}">
          ${c} (${categoryCounts[c]})
        </button>
      `;
    })
    .join('');

  const rows = filtered.length
    ? filtered
        .map(item => {
          const tx = item.transaction;
          const flagLabels: Record<string, string> = {
            low_confidence: 'Low Classification Confidence',
            anomaly_amount: 'Unusual Amount Spike',
            personal_vs_business: 'Peer-to-Peer Transfer (Personal vs Business)',
            unclear_memo: 'Unrecorded Check / Missing Memo',
            capital_vs_opex: 'Capitalization Threshold ($2k+ Hardware/Asset)'
          };

          const flagTitle = flagLabels[item.flag_type] || item.flag_type;

          return `
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all review-card" data-tx-id="${tx.id}">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <!-- Left: Transaction Info & Flag -->
                <div class="space-y-1.5 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold">${tx.id}</span>
                    <span class="text-xs font-mono text-slate-400">${tx.date}</span>
                    ${getSeverityBadge(item.severity)}
                    ${getConfidenceBadge(tx.confidence)}
                  </div>

                  <div class="text-sm font-bold text-slate-100 mt-1">
                    ${tx.description}
                  </div>

                  <div class="text-xs text-slate-400 flex items-center gap-2">
                    <span>Category: <strong class="text-slate-300 font-medium">${tx.category}</strong></span>
                    <span>•</span>
                    <span>Subcategory: <strong class="text-slate-300 font-medium">${tx.subcategory}</strong></span>
                    <span>•</span>
                    <span>P&L Status: <strong class="${tx.is_pnl ? 'text-emerald-400' : 'text-amber-400'}">${tx.is_pnl ? 'Included in P&L' : 'Non-P&L (Balance Sheet)'}</strong></span>
                  </div>

                  <!-- Audit Flag Box -->
                  <div class="mt-2.5 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs">
                    <div class="font-semibold text-amber-400/90 flex items-center gap-1.5">
                      <span>⚠</span>
                      <span>${flagTitle}</span>
                    </div>
                    <p class="text-slate-400 mt-0.5 leading-relaxed">
                      ${item.suggested_action}
                    </p>
                    ${
                      tx.review_reason
                        ? `<p class="text-[11px] text-slate-500 mt-1 italic">Reason: "${tx.review_reason}"</p>`
                        : ''
                    }
                  </div>
                </div>

                <!-- Right: Amount & Actions -->
                <div class="flex flex-col md:items-end justify-between gap-3 shrink-0">
                  <div class="text-xl font-bold font-mono text-slate-100 md:text-right">
                    ${formatCurrency(tx.amount)}
                    <span class="text-[10px] text-slate-400 uppercase font-sans block">${tx.type}</span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all approve-btn shadow-sm"
                      data-tx-id="${tx.id}">
                      ✓ Approve
                    </button>

                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all reclassify-btn shadow-sm"
                      data-tx-id="${tx.id}">
                      ✎ Reclassify
                    </button>

                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all exclude-btn shadow-sm"
                      data-tx-id="${tx.id}">
                      Exclude from P&L
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400 text-xs">
        No flagged review items match your active filters (${selectedCategory || 'All categories'}).
      </div>
    `;

  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Human-in-the-Loop Review Queue
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ${filtered.length} of ${items.length} Items
            </span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Filter by accounting category to review and resolve uncertain classifications, capitalization alerts, or pass-through taxes.
          </p>
        </div>

        <div class="text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
          <span class="text-slate-200 font-semibold">Verification Guarantee:</span> All manual resolutions immediately re-calculate the P&L.
        </div>
      </div>

      <!-- Quick Category Pills -->
      <div class="flex flex-wrap items-center gap-2 pb-1">
        ${allPill}
        ${categoryPills}
      </div>

      <!-- Filter Controls Toolbar -->
      <div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            id="review-search-input"
            placeholder="Search flagged item, vendor, or ID..."
            value="${searchTerm}"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- Category Dropdown Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400 font-medium whitespace-nowrap">Category:</label>
          <select id="review-category-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="">All Categories (${items.length})</option>
            ${categoryOptions}
          </select>
        </div>

        <!-- Severity Dropdown Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400 font-medium whitespace-nowrap">Severity:</label>
          <select id="review-severity-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="">All Severities</option>
            <option value="high" ${selectedSeverity === 'high' ? 'selected' : ''}>High Attention</option>
            <option value="medium" ${selectedSeverity === 'medium' ? 'selected' : ''}>Medium Review</option>
            <option value="low" ${selectedSeverity === 'low' ? 'selected' : ''}>Low Judgment</option>
          </select>
        </div>
      </div>

      <!-- Queue Cards List -->
      <div class="space-y-3">
        ${rows}
      </div>
    </div>
  `;
}
