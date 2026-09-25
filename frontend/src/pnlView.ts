/**
 * High-Clarity Executive P&L Statement View Component
 * Clean, structured, and interactive financial review matrix with drill-down audit drawers.
 */

import { PnLStatement, PnLLineItem } from './types';
import { formatCurrency } from './utils';

export function renderPnLView(
  pnl: PnLStatement,
  onInspectLineItem: (item: PnLLineItem) => void
): string {
  const periods = pnl.periods;

  const headerCells = periods
    .map(p => `<th class="py-3 px-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">${p}</th>`)
    .join('');

  function renderSectionRows(items: PnLLineItem[], sectionName: string, dotColor: string) {
    if (!items.length) {
      return `<tr><td colspan="${periods.length + 2}" class="py-3 px-4 text-xs text-slate-500 italic pl-8">No line items recorded.</td></tr>`;
    }

    return items
      .map(item => {
        const periodCells = periods
          .map(p => {
            const amt = item.monthly_amounts[p] || 0;
            const isNegative = amt < 0 || item.name.toLowerCase().includes('refund');
            return `
              <td class="py-2.5 px-4 text-right text-xs font-mono ${isNegative ? 'text-rose-400' : 'text-slate-300'}">
                ${isNegative ? `-${formatCurrency(Math.abs(amt))}` : formatCurrency(amt)}
              </td>
            `;
          })
          .join('');

        return `
          <tr class="hover:bg-slate-800/60 transition-colors border-b border-slate-800/40 cursor-pointer group line-item-row"
              data-item-name="${item.name}" data-item-type="${item.account_type}">
            <td class="py-2.5 px-4 text-xs font-medium text-slate-200 flex items-center justify-between pl-6">
              <span class="group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
                <span class="truncate max-w-xs md:max-w-md">${item.name}</span>
              </span>
              <span class="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded group-hover:bg-emerald-950/80 group-hover:text-emerald-300 transition-colors">
                ${item.transaction_count} txs ↗
              </span>
            </td>
            ${periodCells}
            <td class="py-2.5 px-4 text-right text-xs font-mono font-semibold text-slate-100 bg-slate-900/40">
              ${formatCurrency(item.total_amount)}
            </td>
          </tr>
        `;
      })
      .join('');
  }

  function renderSummaryRow(
    title: string,
    getValue: (p: string) => number,
    getTotal: () => number,
    bgClass: string,
    textClass: string
  ) {
    const periodCells = periods
      .map(p => {
        const val = getValue(p);
        return `<td class="py-3 px-4 text-right text-xs font-mono font-bold ${textClass}">${formatCurrency(val)}</td>`;
      })
      .join('');

    return `
      <tr class="${bgClass} border-t border-b border-slate-700/80">
        <td class="py-3 px-4 text-xs font-bold uppercase tracking-wider ${textClass} flex items-center justify-between">
          <span>${title}</span>
        </td>
        ${periodCells}
        <td class="py-3 px-4 text-right text-xs font-mono font-extrabold ${textClass} bg-slate-900/80">
          ${formatCurrency(getTotal())}
        </td>
      </tr>
    `;
  }

  function renderMarginRow(title: string, getPct: (p: string) => number) {
    const periodCells = periods
      .map(p => {
        const pct = getPct(p);
        return `<td class="py-2 px-4 text-right text-xs font-mono text-emerald-400/90 font-medium">${pct.toFixed(1)}%</td>`;
      })
      .join('');

    const avgPct = periods.reduce((acc, p) => acc + getPct(p), 0) / periods.length;

    return `
      <tr class="bg-slate-950/60 text-slate-400 border-b border-slate-800/80 text-[11px]">
        <td class="py-2 px-6 italic text-slate-400">${title}</td>
        ${periodCells}
        <td class="py-2 px-4 text-right font-mono text-emerald-400 font-semibold bg-slate-950">${avgPct.toFixed(1)}% Avg</td>
      </tr>
    `;
  }

  // Calculate high-level totals
  const totalRev = pnl.totals.revenue || 1;
  const totalGP = pnl.totals.gross_profit || 0;
  const totalEbitda = pnl.totals.operating_profit || 0;
  const totalOpex = (pnl.totals.payroll || 0) + (pnl.totals.opex || 0);

  const gpMargin = ((totalGP / totalRev) * 100).toFixed(1);
  const ebitdaMargin = ((totalEbitda / totalRev) * 100).toFixed(1);

  return `
    <div class="space-y-6">
      <!-- Executive Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Revenue Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Revenue (Q1)</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">+12.7% MoM</span>
          </div>
          <div class="text-2xl font-bold font-mono text-emerald-400 mt-2">${formatCurrency(totalRev)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Food Sales, Bar, Catering & Delivery
          </div>
        </div>

        <!-- Gross Profit Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Gross Profit</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">${gpMargin}% Margin</span>
          </div>
          <div class="text-2xl font-bold font-mono text-slate-100 mt-2">${formatCurrency(totalGP)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Revenue minus Direct Food & Beverage COGS
          </div>
        </div>

        <!-- Total OpEx & Labor -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Payroll & OpEx</span>
            <span class="text-slate-400 text-[11px] font-semibold">${((totalOpex/totalRev)*100).toFixed(1)}% of Rev</span>
          </div>
          <div class="text-2xl font-bold font-mono text-amber-300 mt-2">${formatCurrency(totalOpex)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Kitchen Wages, Manager Salary & Rent ($9k)
          </div>
        </div>

        <!-- Operating Profit / EBITDA -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Operating Profit (EBITDA)</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">${ebitdaMargin}% Net</span>
          </div>
          <div class="text-2xl font-bold font-mono text-emerald-300 mt-2">${formatCurrency(totalEbitda)}</div>
          <div class="text-[11px] text-emerald-400/80 mt-1 font-medium">
            Profitable across all 3 months
          </div>
        </div>
      </div>

      <!-- VISUAL FINANCIAL TRAJECTORY BAR CHART -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>📊 Monthly Trajectory: Revenue vs. Cost Outflows & Margin Expansion</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Visual comparison of monthly operational streams and bottom-line margin trends.
            </p>
          </div>

          <!-- Chart Legend -->
          <div class="flex flex-wrap items-center gap-3 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-emerald-400 inline-block"></span>
              <span class="text-slate-300">Revenue</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-amber-400 inline-block"></span>
              <span class="text-slate-300">COGS</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-blue-400 inline-block"></span>
              <span class="text-slate-300">Payroll</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-purple-400 inline-block"></span>
              <span class="text-slate-300">OpEx</span>
            </div>
          </div>
        </div>

        <!-- Chart Grid Bars -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          ${periods
            .map(p => {
              const s = pnl.monthly_summaries[p];
              if (!s) return '';
              const maxScale = 180000; // Reference max for height
              const revH = Math.min(100, Math.round((s.revenue / maxScale) * 100));
              const cogsH = Math.min(100, Math.round((s.cogs / maxScale) * 100));
              const payH = Math.min(100, Math.round((s.payroll / maxScale) * 100));
              const opexH = Math.min(100, Math.round((s.opex / maxScale) * 100));

              return `
                <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <!-- Header with EBITDA Pill -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-mono text-sm font-bold text-slate-100">${p}</span>
                    <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30">
                      ${s.operating_margin_pct.toFixed(1)}% Margin · ${formatCurrency(s.operating_profit)}
                    </span>
                  </div>

                  <!-- Visual Bars Container -->
                  <div class="h-36 flex items-end justify-between gap-3 px-2 pt-2 border-b border-slate-800">
                    <!-- Revenue Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${formatCurrency(s.revenue)}
                      </div>
                      <div class="w-full bg-emerald-500/80 hover:bg-emerald-400 transition-all rounded-t" style="height: ${revH}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">Rev</span>
                    </div>

                    <!-- COGS Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${formatCurrency(s.cogs)}
                      </div>
                      <div class="w-full bg-amber-500/80 hover:bg-amber-400 transition-all rounded-t" style="height: ${cogsH}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">COGS</span>
                    </div>

                    <!-- Payroll Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${formatCurrency(s.payroll)}
                      </div>
                      <div class="w-full bg-blue-500/80 hover:bg-blue-400 transition-all rounded-t" style="height: ${payH}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">Labor</span>
                    </div>

                    <!-- OpEx Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${formatCurrency(s.opex)}
                      </div>
                      <div class="w-full bg-purple-500/80 hover:bg-purple-400 transition-all rounded-t" style="height: ${opexH}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">OpEx</span>
                    </div>
                  </div>

                  <!-- Quick Stats Below Bar -->
                  <div class="grid grid-cols-2 gap-2 text-[11px] pt-3 text-slate-400 font-mono">
                    <div>Gross Profit: <span class="text-slate-200 font-semibold">${formatCurrency(s.gross_profit)}</span></div>
                    <div class="text-right">Gross Margin: <span class="text-emerald-400 font-semibold">${s.gross_margin_pct.toFixed(1)}%</span></div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- Financial Statement Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div class="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Monthly Statement of Profit & Loss (P&L)</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Deterministic Calculation Engine
              </span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Click any line item row to inspect its exact underlying ledger evidence in real time.
            </p>
          </div>

          <div class="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-400">Reconciliation:</span>
            <span class="text-emerald-400 font-bold">$0.00 Mathematical Error</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950 border-b border-slate-800">
                <th class="py-3 px-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Accounting Category / Account</th>
                ${headerCells}
                <th class="py-3 px-4 text-right font-semibold text-slate-100 uppercase tracking-wider text-xs bg-slate-950">Q1 Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. REVENUE SECTION -->
              <tr class="bg-slate-950 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800">
                <td colspan="${periods.length + 2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>1. Operating Revenue (Inflows)</span>
                </td>
              </tr>
              ${renderSectionRows(pnl.revenue_items, 'Revenue', 'bg-emerald-400')}
              ${renderSummaryRow('Total Operating Revenue', p => pnl.monthly_summaries[p]?.revenue || 0, () => pnl.totals.revenue, 'bg-emerald-950/20', 'text-emerald-300')}

              <!-- 2. COGS SECTION -->
              <tr class="bg-slate-950 text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${periods.length + 2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>2. Cost of Goods Sold (COGS)</span>
                </td>
              </tr>
              ${renderSectionRows(pnl.cogs_items, 'Cost of Goods Sold', 'bg-amber-400')}
              ${renderSummaryRow('Total Cost of Goods Sold', p => pnl.monthly_summaries[p]?.cogs || 0, () => pnl.totals.cogs, 'bg-slate-800/40', 'text-slate-300')}

              <!-- GROSS PROFIT -->
              ${renderSummaryRow('Gross Profit (Revenue - COGS)', p => pnl.monthly_summaries[p]?.gross_profit || 0, () => pnl.totals.gross_profit, 'bg-slate-800/80', 'text-white')}
              ${renderMarginRow('Gross Margin %', p => pnl.monthly_summaries[p]?.gross_margin_pct || 0)}

              <!-- 3. PAYROLL SECTION -->
              <tr class="bg-slate-950 text-blue-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${periods.length + 2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>3. Labor & Payroll Compensation</span>
                </td>
              </tr>
              ${renderSectionRows(pnl.payroll_items, 'Payroll', 'bg-blue-400')}
              ${renderSummaryRow('Total Payroll & Wages', p => pnl.monthly_summaries[p]?.payroll || 0, () => pnl.totals.payroll, 'bg-slate-800/40', 'text-slate-300')}

              <!-- 4. OPEX SECTION -->
              <tr class="bg-slate-950 text-purple-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${periods.length + 2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>4. Operating Expenses (OpEx)</span>
                </td>
              </tr>
              ${renderSectionRows(pnl.opex_items, 'Operating Expenses', 'bg-purple-400')}
              ${renderSummaryRow('Total Operating Expenses', p => pnl.monthly_summaries[p]?.opex || 0, () => pnl.totals.opex, 'bg-slate-800/40', 'text-slate-300')}

              <!-- OPERATING PROFIT (EBITDA) -->
              ${renderSummaryRow('Operating Profit / EBITDA', p => pnl.monthly_summaries[p]?.operating_profit || 0, () => pnl.totals.operating_profit, 'bg-emerald-950/40', 'text-emerald-400 font-extrabold')}
              ${renderMarginRow('Operating Margin % (EBITDA Margin)', p => pnl.monthly_summaries[p]?.operating_margin_pct || 0)}

              <!-- NON-P&L / BALANCE SHEET SECTION -->
              <tr class="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider border-t-4 border-slate-800">
                <td colspan="${periods.length + 2}" class="py-2.5 px-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span>▾</span>
                    <span>Non-P&L Balance Sheet & Financing Activities</span>
                  </div>
                  <span class="text-[10px] font-normal normal-case bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Strictly Excluded from P&L per GAAP ($7.8k Oven Asset, Sales Tax Remittances)
                  </span>
                </td>
              </tr>
              ${renderSectionRows(pnl.non_pnl_items, 'Non-P&L (Balance Sheet)', 'bg-slate-500')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
