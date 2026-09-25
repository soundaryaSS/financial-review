/**
 * Conversational AI Financial Analyst View Component
 * Provides traceable conversational investigation grounded in deterministic figures.
 */

import { ChatMessage, ChatCitation } from './types';
import { formatCurrency } from './utils';

export function renderAnalystView(
  messages: ChatMessage[],
  isLoading: boolean,
  onCitationClick: (citation: ChatCitation) => void
): string {
  const samplePrompts = [
    "What was our revenue in March?",
    "How much did we spend on payroll each month?",
    "Why did operating profit change between February and March?",
    "What drove the increase in food costs?",
    "Which transactions need my attention?",
    "Show me the transactions behind that variance.",
    "What changed most significantly over the review period?"
  ];

  const sampleChips = samplePrompts
    .map(
      p => `
        <button
          class="px-2.5 py-1 text-xs rounded-full bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-500/40 text-slate-300 border border-slate-700 transition-all text-left prompt-chip"
          data-prompt="${p}">
          ${p}
        </button>
      `
    )
    .join('');

  const messageItems = messages
    .map(m => {
      const isUser = m.role === 'user';
      const roleBadge = isUser
        ? `<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">You (Executive Reviewer)</span>`
        : `<span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            FINZ AI Financial Analyst · Grounded In Deterministic Ledger
           </span>`;

      // Render citations as clickable chips
      let citationsHtml = '';
      if (m.citations && m.citations.length > 0) {
        const chips = m.citations
          .map(
            c => `
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 hover:text-emerald-200 transition-all shadow-sm citation-btn"
                data-tx-id="${c.transaction_id}">
                <span class="text-slate-400 font-bold">${c.transaction_id}</span>
                <span>•</span>
                <span class="text-slate-300 truncate max-w-[140px]">${c.description}</span>
                <span>•</span>
                <span class="text-emerald-400 font-bold">${formatCurrency(c.amount)}</span>
                <span class="text-slate-500">↗</span>
              </button>
            `
          )
          .join('');

        citationsHtml = `
          <div class="mt-3 pt-3 border-t border-slate-800/80">
            <div class="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
              <span>Verified Audit Citations (Click to inspect):</span>
            </div>
            <div class="flex flex-wrap gap-2">
              ${chips}
            </div>
          </div>
        `;
      }

      // Convert Markdown bold and bullets to HTML
      let formattedContent = m.content
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n- /g, '<br/>• ')
        .replace(/\n### (.*?)(<br\/>|$)/g, '<h5 class="text-xs font-bold text-slate-100 uppercase tracking-wider mt-2 mb-1">$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>');

      return `
        <div class="p-4 rounded-xl ${isUser ? 'bg-slate-900 border border-slate-800 ml-8' : 'bg-slate-900/90 border border-emerald-950/80 mr-8'} shadow-md">
          <div class="flex items-center justify-between mb-1.5">
            ${roleBadge}
          </div>
          <div class="text-xs text-slate-200 leading-relaxed font-sans">
            ${formattedContent}
          </div>
          ${citationsHtml}
        </div>
      `;
    })
    .join('');

  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            AI Financial Analyst
            <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Grounded in Structured Ledger Data
            </span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Ask any question about the company's financial performance. All answers are strictly calculated from the deterministic database and cited with verifiable transaction IDs.
          </p>
        </div>

        <div class="text-xs bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-slate-400">LLM Hallucination Guard: <strong class="text-emerald-400">Active</strong></span>
        </div>
      </div>

      <!-- Suggested Challenge Questions -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>Challenge Demonstration Queries (Click any to run):</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${sampleChips}
        </div>
      </div>

      <!-- Chat Stream Container -->
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 shadow-inner" id="chat-messages-container">
        ${
          messages.length === 0
            ? `
              <div class="text-center py-16 text-slate-500 text-xs">
                Select one of the challenge questions above or type your own question below to start the financial review.
              </div>
            `
            : messageItems
        }
        ${
          isLoading
            ? `
              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 mr-8 animate-pulse">
                <div class="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Querying deterministic ledger & synthesizing explainable evidence...
                </div>
              </div>
            `
            : ''
        }
      </div>

      <!-- Input Bar -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2 shadow-lg">
        <input
          type="text"
          id="analyst-input"
          placeholder="Ask a question (e.g. 'What was our revenue in March?' or 'Why did operating profit change?')..."
          class="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
        />
        <button
          id="analyst-send-btn"
          class="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-sm shrink-0">
          <span>Ask Analyst</span>
          <span>→</span>
        </button>
      </div>
    </div>
  `;
}
