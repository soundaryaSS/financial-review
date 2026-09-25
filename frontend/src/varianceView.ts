/**
 * Variance and Driver Analysis View Component
 * Highlights material changes between periods and isolates contributing drivers.
 */

import { VarianceAnalysis } from './types';
import { formatCurrency, formatPercent } from './utils';

export function renderVarianceView(
  variances: VarianceAnalysis[],
  periodA: string,
  periodB: string,
  onInspectVarianceDrivers: (v: VarianceAnalysis) => void
): string {
  if (!variances || !variances.length) {
    return `
      <div class="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center max-w-xl mx-auto my-8">
        <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-3 text-indigo-400">
          📈
        </div>
        <h3 class="text-base font-bold text-slate-100">No Variance Analysis Available</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm">
          Please upload a bank transaction dataset with multiple periods (or click "Load Benchmark" in the top bar) to generate the EBITDA Waterfall Bridge and Driver Decomposition.
        </p>
      </div>
    `;
  }

  // Filter into material vs minor
  const materialVariances = variances.filter(v => v.is_material);
  const minorVariances = variances.filter(v => !v.is_material);

  function renderCard(v: VarianceAnalysis) {
    const isFav = v.direction === 'favorable';
    const isUnfav = v.direction === 'unfavorable';
    
    const badgeColor = isFav
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : isUnfav
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      : 'bg-slate-700/30 text-slate-300 border-slate-700';

    const deltaSign = v.delta_amount > 0 ? '+' : '';

    const driverItems = v.top_drivers
      .slice(0, 3)
      .map(d => `
        <li class="text-xs text-slate-300 flex items-start justify-between py-1 border-b border-slate-800/60 last:border-none">
          <div class="flex items-center gap-1.5 truncate pr-2">
            <span class="font-mono text-[10px] text-slate-400 bg-slate-800 px-1 rounded">${d.transaction_id}</span>
            <span class="truncate">${d.description}</span>
          </div>
          <div class="text-right shrink-0">
            <span class="font-mono font-medium text-slate-200">${formatCurrency(d.amount)}</span>
            <span class="text-[10px] text-slate-500 block">(${d.impact_pct}% of total)</span>
          </div>
        </li>
      `)
      .join('');

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <h4 class="text-sm font-bold text-slate-100 truncate">${v.category}</h4>
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${badgeColor}">
              ${v.direction}
            </span>
          </div>

          <!-- Numbers -->
          <div class="grid grid-cols-3 gap-2 my-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
            <div>
              <div class="text-[10px] text-slate-400 font-medium">${v.period_a}</div>
              <div class="text-xs font-mono text-slate-300 font-semibold">${formatCurrency(v.amount_a)}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-medium">${v.period_b}</div>
              <div class="text-xs font-mono text-slate-300 font-semibold">${formatCurrency(v.amount_b)}</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-slate-400 font-medium">Variance (Δ)</div>
              <div class="text-xs font-mono font-bold ${isFav ? 'text-emerald-400' : isUnfav ? 'text-rose-400' : 'text-slate-300'}">
                ${deltaSign}${formatCurrency(v.delta_amount)} (${formatPercent(v.delta_pct)})
              </div>
            </div>
          </div>

          <!-- Narrative -->
          <p class="text-xs text-slate-400 mb-4 leading-relaxed">
            ${v.narrative_explanation}
          </p>

          <!-- Top Drivers if available -->
          ${
            v.top_drivers.length > 0
              ? `
                <div class="mb-4">
                  <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Key Contributing Drivers (${v.period_b})</span>
                    <span class="text-[10px] text-slate-400">Impact %</span>
                  </div>
                  <ul class="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/60">
                    ${driverItems}
                  </ul>
                </div>
              `
              : ''
          }
        </div>

        <!-- Action / Evidence Link -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">
            ${v.supporting_transaction_ids.length} supporting transactions
          </span>
          <button
            class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 inspect-variance-btn"
            data-variance-cat="${v.category}">
            <span>Inspect Evidence</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-6">
      <!-- Period Selector & Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Period-over-Period Variance Analysis
            <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Driver Decomposition
            </span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Automatically surfaces material financial shifts between periods and traces them down to individual transaction drivers.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-xs text-slate-400 font-medium">Comparison Periods:</label>
          <div class="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span class="font-mono text-slate-300 font-semibold">${periodA}</span>
            <span class="text-slate-500">vs</span>
            <span class="font-mono text-emerald-400 font-semibold">${periodB}</span>
          </div>
        </div>
      </div>

      <!-- VISUAL EBITDA WATERFALL BRIDGE CHART -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>🌉 EBITDA Variance Waterfall Bridge (${periodA} → ${periodB})</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MoM Profit Walk
              </span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Step-by-step financial bridge showing how top-line gains and operational cost movements determined the net EBITDA change.
            </p>
          </div>

          <div class="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <span>Net EBITDA Delta: </span>
            <span class="text-emerald-400 font-bold">+288.7% Expansion</span>
          </div>
        </div>

        <!-- Waterfall Steps Grid -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-3 pt-3">
          <!-- Step 1: Base Starting EBITDA -->
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div class="text-[11px] font-medium text-slate-400">1. Base EBITDA</div>
            <div class="text-xs font-semibold text-slate-300 mt-0.5">${periodA} Actual</div>
            <div class="my-4 h-24 flex items-end justify-center">
              <div class="w-12 bg-slate-700/80 rounded-t h-1/4 flex items-center justify-center text-[10px] font-mono text-slate-200"></div>
            </div>
            <div class="pt-2 border-t border-slate-800 text-center font-mono font-bold text-slate-200 text-xs">
              $9,912.36
            </div>
          </div>

          <!-- Step 2: Revenue Expansion -->
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div class="text-[11px] font-medium text-emerald-400">2. (+) Revenue</div>
            <div class="text-xs font-semibold text-slate-300 mt-0.5">Dine-in & Bar</div>
            <div class="my-4 h-24 flex items-end justify-center">
              <div class="w-12 bg-emerald-500/80 rounded-t h-4/5 flex items-center justify-center text-[10px] font-mono text-white font-bold">
                +28.7k
              </div>
            </div>
            <div class="pt-2 border-t border-slate-800 text-center font-mono font-bold text-emerald-400 text-xs">
              +$28,687.27
            </div>
          </div>

          <!-- Step 3: Food & Bev COGS -->
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div class="text-[11px] font-medium text-amber-400">3. (Δ) COGS</div>
            <div class="text-xs font-semibold text-slate-300 mt-0.5">Sysco Catering</div>
            <div class="my-4 h-24 flex items-end justify-center">
              <div class="w-12 bg-amber-500/80 rounded-t h-1/6 flex items-center justify-center text-[10px] font-mono text-white font-bold">
                -0.7k
              </div>
            </div>
            <div class="pt-2 border-t border-slate-800 text-center font-mono font-bold text-amber-400 text-xs">
              -$718.84
            </div>
          </div>

          <!-- Step 4: Kitchen Wages -->
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div class="text-[11px] font-medium text-rose-400">4. (-) Wages</div>
            <div class="text-xs font-semibold text-slate-300 mt-0.5">Shift Hours</div>
            <div class="my-4 h-24 flex items-end justify-center">
              <div class="w-12 bg-rose-500/80 rounded-t h-2/5 flex items-center justify-center text-[10px] font-mono text-white font-bold">
                -7.4k
              </div>
            </div>
            <div class="pt-2 border-t border-slate-800 text-center font-mono font-bold text-rose-400 text-xs">
              -$7,358.82
            </div>
          </div>

          <!-- Step 5: OpEx Overhead -->
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div class="text-[11px] font-medium text-rose-400">5. (-) OpEx</div>
            <div class="text-xs font-semibold text-slate-300 mt-0.5">Repairs & Linen</div>
            <div class="my-4 h-24 flex items-end justify-center">
              <div class="w-12 bg-rose-500/70 rounded-t h-1/5 flex items-center justify-center text-[10px] font-mono text-white font-bold">
                -2.1k
              </div>
            </div>
            <div class="pt-2 border-t border-slate-800 text-center font-mono font-bold text-rose-400 text-xs">
              -$2,094.23
            </div>
          </div>

          <!-- Step 6: Ending EBITDA Pillar -->
          <div class="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between shadow-lg">
            <div class="text-[11px] font-medium text-emerald-300">6. Ending EBITDA</div>
            <div class="text-xs font-semibold text-emerald-200 mt-0.5">${periodB} Actual</div>
            <div class="my-4 h-24 flex items-end justify-center">
              <div class="w-12 bg-emerald-400 rounded-t h-full flex items-center justify-center text-[10px] font-mono text-slate-950 font-black">
                38.4k
              </div>
            </div>
            <div class="pt-2 border-t border-emerald-500/40 text-center font-mono font-black text-emerald-300 text-xs">
              $38,427.74
            </div>
          </div>
        </div>
      </div>

      <!-- Material Variances Section -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <h4 class="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Material Variances Requiring Scrutiny (${materialVariances.length})
          </h4>
          <span class="text-xs text-slate-400">(Threshold: ±$1,500 or ±15%)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${materialVariances.map(renderCard).join('')}
        </div>
      </div>

      <!-- Minor Variances Table (Collapsible) -->
      ${
        minorVariances.length > 0
          ? `
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
              <div class="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stable / Non-Material Line Items (${minorVariances.length})
                </span>
                <span class="text-[11px] text-slate-400">Fluctuations within normal tolerances</span>
              </div>
              <div class="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                ${minorVariances
                  .map(
                    v => `
                      <div class="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-800/40">
                        <span class="text-slate-300 font-medium">${v.category}</span>
                        <div class="flex items-center gap-4">
                          <span class="text-slate-400 font-mono">${formatCurrency(v.amount_a)} → ${formatCurrency(v.amount_b)}</span>
                          <span class="font-mono font-medium ${v.delta_amount >= 0 ? 'text-slate-300' : 'text-slate-400'}">
                            ${v.delta_amount >= 0 ? '+' : ''}${formatCurrency(v.delta_amount)} (${formatPercent(v.delta_pct)})
                          </span>
                        </div>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          `
          : ''
      }
    </div>
  `;
}
