/**
 * Master Application Controller (Pure TypeScript + Tailwind)
 * Coordinates tabs, reactive data re-fetching, drawers, modals, and AI analyst interaction.
 */

import {
  fetchPnL,
  fetchVariances,
  fetchReviewQueue,
  fetchTransactions,
  updateTransaction,
  askFinancialAnalyst,
  uploadTransactionsCSV,
  resetBenchmarkDataset,
  loadBenchmarkDataset
} from './api';

import {
  PnLStatement,
  Transaction,
  VarianceAnalysis,
  ReviewItem,
  ChatMessage,
  ChatCitation,
  PnLLineItem
} from './types';

import { renderPnLView } from './pnlView';
import { renderVarianceView } from './varianceView';
import { renderReviewQueueView } from './reviewQueueView';
import { renderLedgerView } from './ledgerView';
import { renderAnalystView } from './analystView';
import { formatCurrency, getConfidenceBadge, getCurrency, setCurrency } from './utils';

// Application State
let currentTab: 'pnl' | 'variance' | 'review' | 'ledger' | 'analyst' = 'pnl';
let pnlData: PnLStatement | null = null;
let variancesData: VarianceAnalysis[] = [];
let reviewQueueData: ReviewItem[] = [];
let allTransactions: Transaction[] = [];
let chatHistory: ChatMessage[] = [];
let isAnalystLoading = false;

// Ledger Filters State
let filterCategory = '';
let filterPeriod = '';
let filterPnl = '';
let filterSearch = '';

// Review Queue Filters State
let reviewFilterCategory = '';
let reviewFilterSeverity = '';
let reviewFilterSearch = '';

// Active Edit Transaction
let editingTx: Transaction | null = null;

// DOM Elements
const viewContainer = document.getElementById('view-container')!;
const reviewCountBadge = document.getElementById('review-count-badge')!;
const auditDrawer = document.getElementById('audit-drawer')!;
const drawerBackdrop = document.getElementById('drawer-backdrop')!;
const closeDrawerBtn = document.getElementById('close-drawer-btn')!;
const drawerTitle = document.getElementById('drawer-title')!;
const drawerSubtitle = document.getElementById('drawer-subtitle')!;
const drawerTxList = document.getElementById('drawer-tx-list')!;
const drawerTotalAmount = document.getElementById('drawer-total-amount')!;

// Modal Elements
const editModal = document.getElementById('edit-modal')!;
const modalBackdrop = document.getElementById('modal-backdrop')!;
const closeModalBtn = document.getElementById('close-modal-btn')!;
const cancelModalBtn = document.getElementById('cancel-modal-btn')!;
const saveModalBtn = document.getElementById('save-modal-btn')!;
const modalTxDesc = document.getElementById('modal-tx-desc')!;
const modalTxMeta = document.getElementById('modal-tx-meta')!;
const modalCatSelect = document.getElementById('modal-cat-select') as HTMLSelectElement;
const modalSubcatInput = document.getElementById('modal-subcat-input') as HTMLInputElement;
const modalPnlSelect = document.getElementById('modal-pnl-select') as HTMLSelectElement;
const modalNotesInput = document.getElementById('modal-notes-input') as HTMLTextAreaElement;

// Toast
const toast = document.getElementById('toast')!;
const toastMessage = document.getElementById('toast-message')!;

function showToast(msg: string) {
  toastMessage.textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

// Data Fetching and Reactive Reload
async function loadAllData() {
  try {
    const [pnl, vars, queue, txs] = await Promise.all([
      fetchPnL(),
      fetchVariances('2026-02', '2026-03'),
      fetchReviewQueue(),
      fetchTransactions()
    ]);

    pnlData = pnl;
    variancesData = vars;
    reviewQueueData = queue;
    allTransactions = txs;

    reviewCountBadge.textContent = String(queue.length);

    // Update dynamic header status
    const statusDot = document.getElementById('header-status-dot');
    const statusText = document.getElementById('header-status-text');
    if (statusDot && statusText) {
      if (txs.length === 0) {
        statusDot.className = 'w-2 h-2 rounded-full bg-slate-500';
        statusText.textContent = 'Blank Ledger (0 Txs)';
      } else {
        statusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
        statusText.textContent = `Q1 2026 Audit (${txs.length} Txs)`;
      }
    }

    renderCurrentTab();
  } catch (err: any) {
    console.error('Failed to load data from backend:', err);
    viewContainer.innerHTML = `
      <div class="p-8 bg-rose-950/40 border border-rose-800 rounded-xl text-center">
        <h3 class="text-sm font-bold text-rose-300">Backend Connection Error</h3>
        <p class="text-xs text-slate-400 mt-1">Make sure the FastAPI server is running on http://localhost:8000.</p>
        <button id="retry-btn" class="mt-4 px-4 py-1.5 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white">Retry Connection</button>
      </div>
    `;
    document.getElementById('retry-btn')?.addEventListener('click', loadAllData);
  }
}

function updateCurrencyUI() {
  const currentCurr = getCurrency();
  const usdBtn = document.getElementById('currency-usd-btn');
  const inrBtn = document.getElementById('currency-inr-btn');
  if (usdBtn && inrBtn) {
    if (currentCurr === 'INR') {
      inrBtn.className = 'px-2.5 py-1 rounded transition-all text-emerald-400 bg-slate-800 shadow-sm font-bold';
      usdBtn.className = 'px-2.5 py-1 rounded transition-all text-slate-400 hover:text-slate-200';
    } else {
      usdBtn.className = 'px-2.5 py-1 rounded transition-all text-emerald-400 bg-slate-800 shadow-sm font-bold';
      inrBtn.className = 'px-2.5 py-1 rounded transition-all text-slate-400 hover:text-slate-200';
    }
  }
}

// Ingestion and Reset Handlers
async function handleFileUpload(file: File) {
  try {
    showToast('Ingesting and classifying bank transactions...');
    const res = await uploadTransactionsCSV(file);
    if ((res as any).detected_currency === 'INR') {
      setCurrency('INR');
      updateCurrencyUI();
      showToast(`Detected Indian Rupees (₹) in CSV! Classified ${res.count} transactions.`);
    } else {
      showToast(`Successfully classified ${res.count} transactions!`);
    }
    await loadAllData();
  } catch (err: any) {
    console.error(err);
    alert(`CSV Ingestion error: ${err.message}`);
  }
}

async function handleResetToBlank() {
  if (confirm('Are you sure you want to clear all transactions and reset to a completely blank ledger?')) {
    try {
      await resetBenchmarkDataset();
      chatHistory = [];
      showToast('Ledger cleared (0 transactions).');
      await loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(`Reset error: ${err.message}`);
    }
  }
}

async function handleLoadBenchmark() {
  try {
    showToast('Loading NYC Restaurant benchmark dataset (181 Txs)...');
    const res = await loadBenchmarkDataset();
    showToast(`Loaded ${res.count} verified transactions!`);
    await loadAllData();
  } catch (err: any) {
    console.error(err);
    alert(`Failed to load benchmark dataset: ${err.message}`);
  }
}

// Drawer Control: Opens transaction list for inspection
function openAuditDrawer(title: string, subtitle: string, txs: Transaction[]) {
  drawerTitle.textContent = title;
  drawerSubtitle.textContent = subtitle;

  const total = txs.reduce((sum, t) => sum + t.amount, 0);
  drawerTotalAmount.textContent = formatCurrency(total);

  if (!txs.length) {
    drawerTxList.innerHTML = `<div class="text-xs text-slate-500 italic p-4">No matching transactions found in active ledger.</div>`;
  } else {
    drawerTxList.innerHTML = txs
      .map(
        t => `
          <div class="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-slate-700 transition-all flex items-start justify-between gap-3 text-xs">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-slate-400 font-bold">${t.id}</span>
                <span class="font-mono text-[11px] text-slate-500">${t.date}</span>
                ${getConfidenceBadge(t.confidence)}
              </div>
              <div class="font-semibold text-slate-200">${t.description}</div>
              <div class="text-[11px] text-slate-400">
                ${t.category} &bull; ${t.subcategory}
              </div>
              ${t.reasoning ? `<div class="text-[10px] text-slate-500 italic">Audit note: ${t.reasoning}</div>` : ''}
            </div>
            <div class="text-right shrink-0">
              <div class="font-mono font-bold text-slate-100">${formatCurrency(t.amount)}</div>
              <button class="mt-2 px-2 py-0.5 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 drawer-edit-btn" data-tx-id="${t.id}">
                Reclassify
              </button>
            </div>
          </div>
        `
      )
      .join('');
  }

  auditDrawer.classList.remove('hidden');

  // Wire drawer edit buttons
  drawerTxList.querySelectorAll('.drawer-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id');
      const targetTx = allTransactions.find(t => t.id === txId);
      if (targetTx) {
        closeDrawer();
        openEditModal(targetTx);
      }
    });
  });
}

function closeDrawer() {
  auditDrawer.classList.add('hidden');
}

// Modal Control: Reclassify Transaction
function openEditModal(tx: Transaction) {
  editingTx = tx;
  modalTxDesc.textContent = tx.description;
  modalTxMeta.textContent = `${tx.id} • ${tx.date} • ${formatCurrency(tx.amount)} (${tx.type.toUpperCase()})`;
  modalCatSelect.value = tx.category;
  modalSubcatInput.value = tx.subcategory;
  modalPnlSelect.value = String(tx.is_pnl);
  modalNotesInput.value = '';

  editModal.classList.remove('hidden');
}

function closeModal() {
  editModal.classList.add('hidden');
  editingTx = null;
}

async function handleSaveReclassification() {
  if (!editingTx) return;

  const newCat = modalCatSelect.value;
  const newSubcat = modalSubcatInput.value.trim() || 'General';
  const newIsPnl = modalPnlSelect.value === 'true';
  const notes = modalNotesInput.value.trim();

  try {
    await updateTransaction(editingTx.id, {
      category: newCat,
      subcategory: newSubcat,
      is_pnl: newIsPnl,
      review_required: false, // Clearing review requirement on human update
      notes: notes || 'Updated via manual review modal'
    });

    closeModal();
    showToast(`Transaction ${editingTx.id} reclassified to ${newCat}. P&L recomputed!`);
    await loadAllData();
  } catch (err: any) {
    alert(`Error updating transaction: ${err.message}`);
  }
}

// Render Active Tab View
function renderCurrentTab() {
  if (!pnlData) return;

  // Update tab navigation classes
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-emerald-500', 'text-emerald-400', 'font-semibold');
    btn.classList.add('border-transparent', 'text-slate-400');
  });

  const activeBtn = document.getElementById(`tab-${currentTab}`);
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-400');
    activeBtn.classList.add('border-emerald-500', 'text-emerald-400', 'font-semibold');
  }

  // Render view template
  if (currentTab === 'pnl') {
    viewContainer.innerHTML = renderPnLView(pnlData, item => {
      // Find all transactions matching this line item
      const txs = allTransactions.filter(t => item.transaction_ids.includes(t.id));
      openAuditDrawer(`${item.name} (${item.account_type})`, `${txs.length} transactions totaling ${formatCurrency(item.total_amount)}`, txs);
    });

    const pnlUpload = document.getElementById('pnl-csv-upload-input') as HTMLInputElement;
    pnlUpload?.addEventListener('change', e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    });

    const pnlBenchmarkBtn = document.getElementById('pnl-load-benchmark-btn');
    pnlBenchmarkBtn?.addEventListener('click', handleLoadBenchmark);

    // Wire line item click listeners
    viewContainer.querySelectorAll('.line-item-row').forEach(row => {
      row.addEventListener('click', e => {
        const itemName = (e.currentTarget as HTMLElement).getAttribute('data-item-name');
        const itemType = (e.currentTarget as HTMLElement).getAttribute('data-item-type');
        const allItems = [
          ...pnlData!.revenue_items,
          ...pnlData!.cogs_items,
          ...pnlData!.payroll_items,
          ...pnlData!.opex_items,
          ...pnlData!.non_pnl_items
        ];
        const match = allItems.find(i => i.name === itemName && i.account_type === itemType);
        if (match) {
          const txs = allTransactions.filter(t => match.transaction_ids.includes(t.id));
          openAuditDrawer(`${match.name} (${match.account_type})`, `${txs.length} underlying transactions`, txs);
        }
      });
    });
  } else if (currentTab === 'variance') {
    viewContainer.innerHTML = renderVarianceView(variancesData, '2026-02', '2026-03', v => {
      const txs = allTransactions.filter(t => v.supporting_transaction_ids.includes(t.id));
      openAuditDrawer(`Evidence: ${v.category}`, `Supporting transactions driving variance of ${formatCurrency(v.delta_amount)}`, txs);
    });

    // Wire inspect buttons
    viewContainer.querySelectorAll('.inspect-variance-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-variance-cat');
        const vMatch = variancesData.find(v => v.category === cat);
        if (vMatch) {
          const txs = allTransactions.filter(t => vMatch.supporting_transaction_ids.includes(t.id));
          openAuditDrawer(`Evidence: ${vMatch.category}`, `${txs.length} transactions driving variance of ${formatCurrency(vMatch.delta_amount)}`, txs);
        }
      });
    });
  } else if (currentTab === 'review') {
    const categories = [
      'Revenue',
      'Cost of Goods Sold',
      'Payroll',
      'Operating Expenses',
      'Non-P&L (Balance Sheet)'
    ];

    viewContainer.innerHTML = renderReviewQueueView(
      reviewQueueData,
      categories,
      reviewFilterCategory,
      reviewFilterSeverity,
      reviewFilterSearch,
      (txId, action, tx) => {
        if (action === 'reclassify') {
          openEditModal(tx);
        }
      }
    );

    // Wire Review Queue Category Selector
    const revCatSelect = document.getElementById('review-category-select') as HTMLSelectElement;
    revCatSelect?.addEventListener('change', e => {
      reviewFilterCategory = (e.target as HTMLSelectElement).value;
      renderCurrentTab();
    });

    // Wire Review Queue Severity Selector
    const revSevSelect = document.getElementById('review-severity-select') as HTMLSelectElement;
    revSevSelect?.addEventListener('change', e => {
      reviewFilterSeverity = (e.target as HTMLSelectElement).value;
      renderCurrentTab();
    });

    // Wire Review Queue Search Input
    const revSearchInput = document.getElementById('review-search-input') as HTMLInputElement;
    revSearchInput?.addEventListener('input', e => {
      reviewFilterSearch = (e.target as HTMLInputElement).value;
      renderCurrentTab();
    });

    // Wire Review Queue Category Quick Pills
    viewContainer.querySelectorAll('.review-cat-pill').forEach(pill => {
      pill.addEventListener('click', e => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-category') || '';
        reviewFilterCategory = cat;
        renderCurrentTab();
      });
    });

    // Wire Review Queue action buttons
    viewContainer.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id')!;
        await updateTransaction(txId, { review_required: false, notes: 'Approved classification' });
        showToast(`Approved ${txId}. Status verified.`);
        await loadAllData();
      });
    });

    viewContainer.querySelectorAll('.reclassify-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id')!;
        const target = allTransactions.find(t => t.id === txId);
        if (target) openEditModal(target);
      });
    });

    viewContainer.querySelectorAll('.exclude-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id')!;
        await updateTransaction(txId, {
          category: 'Non-P&L (Balance Sheet)',
          subcategory: 'Internal Transfer',
          is_pnl: false,
          review_required: false,
          notes: 'Excluded from P&L per accountant decision'
        });
        showToast(`Excluded ${txId} from P&L. Statement recomputed!`);
        await loadAllData();
      });
    });
  } else if (currentTab === 'ledger') {
    const categories = [
      'Revenue',
      'Cost of Goods Sold',
      'Payroll',
      'Operating Expenses',
      'Non-P&L (Balance Sheet)'
    ];

    // Filter transactions based on active inputs
    let filtered = allTransactions;
    if (filterCategory) filtered = filtered.filter(t => t.category === filterCategory);
    if (filterPeriod) filtered = filtered.filter(t => t.date.startsWith(filterPeriod));
    if (filterPnl !== '') filtered = filtered.filter(t => String(t.is_pnl) === filterPnl);
    if (filterSearch) {
      const s = filterSearch.toLowerCase();
      filtered = filtered.filter(t => t.description.toLowerCase().includes(s) || t.id.toLowerCase().includes(s));
    }

    viewContainer.innerHTML = renderLedgerView(
      filtered,
      categories,
      filterCategory,
      filterPeriod,
      filterPnl,
      filterSearch,
      tx => openEditModal(tx)
    );

    // Wire Ledger Controls
    const searchInput = document.getElementById('ledger-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', e => {
      filterSearch = (e.target as HTMLInputElement).value;
      renderCurrentTab();
    });

    const catSelect = document.getElementById('ledger-category-select') as HTMLSelectElement;
    catSelect?.addEventListener('change', e => {
      filterCategory = (e.target as HTMLSelectElement).value;
      renderCurrentTab();
    });

    const periodSelect = document.getElementById('ledger-period-select') as HTMLSelectElement;
    periodSelect?.addEventListener('change', e => {
      filterPeriod = (e.target as HTMLSelectElement).value;
      renderCurrentTab();
    });

    const pnlSelect = document.getElementById('ledger-pnl-select') as HTMLSelectElement;
    pnlSelect?.addEventListener('change', e => {
      filterPnl = (e.target as HTMLSelectElement).value;
      renderCurrentTab();
    });

    const uploadInput = document.getElementById('csv-upload-input') as HTMLInputElement;
    uploadInput?.addEventListener('change', e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    });

    const resetBtn = document.getElementById('reset-dataset-btn');
    resetBtn?.addEventListener('click', handleResetToBlank);

    const benchmarkBtn = document.getElementById('load-benchmark-btn');
    benchmarkBtn?.addEventListener('click', handleLoadBenchmark);

    viewContainer.querySelectorAll('.edit-tx-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id');
        const target = allTransactions.find(t => t.id === txId);
        if (target) openEditModal(target);
      });
    });

    viewContainer.querySelectorAll('.ledger-row').forEach(row => {
      row.addEventListener('click', e => {
        const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id');
        const target = allTransactions.find(t => t.id === txId);
        if (target) {
          openAuditDrawer(`Transaction Details: ${target.id}`, target.description, [target]);
        }
      });
    });
  } else if (currentTab === 'analyst') {
    viewContainer.innerHTML = renderAnalystView(chatHistory, isAnalystLoading, citation => {
      const target = allTransactions.find(t => t.id === citation.transaction_id);
      if (target) {
        openAuditDrawer(`Cited Transaction: ${target.id}`, target.description, [target]);
      }
    });

    // Wire prompt chips
    viewContainer.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', async e => {
        const promptText = (e.currentTarget as HTMLElement).getAttribute('data-prompt')!;
        await sendAnalystMessage(promptText);
      });
    });

    // Wire citation chips
    viewContainer.querySelectorAll('.citation-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const txId = (e.currentTarget as HTMLElement).getAttribute('data-tx-id')!;
        const target = allTransactions.find(t => t.id === txId);
        if (target) {
          openAuditDrawer(`Evidence: ${target.id}`, target.description, [target]);
        }
      });
    });

    // Wire input and send button
    const analystInput = document.getElementById('analyst-input') as HTMLInputElement;
    const analystSendBtn = document.getElementById('analyst-send-btn');

    const handleSend = async () => {
      const msg = analystInput.value.trim();
      if (!msg || isAnalystLoading) return;
      analystInput.value = '';
      await sendAnalystMessage(msg);
    };

    analystSendBtn?.addEventListener('click', handleSend);
    analystInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

async function sendAnalystMessage(msg: string) {
  chatHistory.push({ role: 'user', content: msg });
  isAnalystLoading = true;
  renderCurrentTab();

  try {
    const res = await askFinancialAnalyst(msg, chatHistory);
    chatHistory.push({
      role: 'assistant',
      content: res.answer,
      citations: res.citations
    });
  } catch (err: any) {
    chatHistory.push({
      role: 'assistant',
      content: `*Error querying financial analyst: ${err.message}. Please check that the backend is running.*`
    });
  } finally {
    isAnalystLoading = false;
    renderCurrentTab();

    // Scroll chat to bottom
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}

// Global Event Listeners
document.getElementById('tab-pnl')?.addEventListener('click', () => {
  currentTab = 'pnl';
  renderCurrentTab();
});
document.getElementById('tab-variance')?.addEventListener('click', () => {
  currentTab = 'variance';
  renderCurrentTab();
});
document.getElementById('tab-review')?.addEventListener('click', () => {
  currentTab = 'review';
  renderCurrentTab();
});
document.getElementById('tab-ledger')?.addEventListener('click', () => {
  currentTab = 'ledger';
  renderCurrentTab();
});
document.getElementById('tab-analyst')?.addEventListener('click', () => {
  currentTab = 'analyst';
  renderCurrentTab();
});

// Drawer & Modal close listeners
closeDrawerBtn?.addEventListener('click', closeDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);
closeModalBtn?.addEventListener('click', closeModal);
cancelModalBtn?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);
saveModalBtn?.addEventListener('click', handleSaveReclassification);

// Global Header Ingestion and Reset Listeners
const globalCsvInput = document.getElementById('global-csv-input') as HTMLInputElement;
globalCsvInput?.addEventListener('change', e => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) handleFileUpload(file);
});

const globalResetBtn = document.getElementById('global-reset-btn');
globalResetBtn?.addEventListener('click', handleResetToBlank);

// Currency Switcher Listeners ($ USD vs ₹ INR)
document.getElementById('currency-usd-btn')?.addEventListener('click', () => {
  setCurrency('USD');
  updateCurrencyUI();
  showToast('Currency set to US Dollars ($)');
  renderCurrentTab();
});

document.getElementById('currency-inr-btn')?.addEventListener('click', () => {
  setCurrency('INR');
  updateCurrencyUI();
  showToast('Currency set to Indian Rupees (₹)');
  renderCurrentTab();
});

// Boot
updateCurrencyUI();
loadAllData();
