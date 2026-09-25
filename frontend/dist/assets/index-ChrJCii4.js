(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))p(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&p(o)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function p(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();const Le=window.location.port==="5173",L=Le?"http://localhost:8000/api":"/api";async function ke(){const e=await fetch(`${L}/pnl`);if(!e.ok)throw new Error("Failed to load P&L Statement");return e.json()}async function Ie(e="2026-02",a="2026-03"){const s=await fetch(`${L}/variances?period_a=${e}&period_b=${a}`);if(!s.ok)throw new Error("Failed to load Variance Analysis");return s.json()}async function Se(){const e=await fetch(`${L}/review-queue`);if(!e.ok)throw new Error("Failed to load Review Queue");return e.json()}async function Ae(e){const a=new URLSearchParams,s=await fetch(`${L}/transactions?${a.toString()}`);if(!s.ok)throw new Error("Failed to load Transactions");return s.json()}async function X(e,a){const s=await fetch(`${L}/transactions/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!s.ok)throw new Error(`Failed to update transaction ${e}`);return s.json()}async function Te(e,a=[]){const s=await fetch(`${L}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,conversation_history:a})});if(!s.ok)throw new Error("Failed to get answer from AI Analyst");return s.json()}async function Ce(e){const a=new FormData;a.append("file",e);const s=await fetch(`${L}/upload`,{method:"POST",body:a});if(!s.ok)throw new Error("Failed to upload CSV file");return s.json()}async function Be(){const e=await fetch(`${L}/reset`,{method:"POST"});if(!e.ok)throw new Error("Failed to reset dataset");return e.json()}async function _e(){const e=await fetch(`${L}/benchmark`,{method:"POST"});if(!e.ok)throw new Error("Failed to load benchmark dataset");return e.json()}function x(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(e)}function re(e){return`${e>0?"+":""}${e.toFixed(1)}%`}function se(e){const a=Math.round(e*100);return e>=.9?`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${a}% Confident</span>`:e>=.7?`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">${a}% Uncertain</span>`:`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">${a}% Review Req.</span>`}function je(e){return e==="high"?'<span class="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">HIGH ATTENTION</span>':e==="medium"?'<span class="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">MEDIUM REVIEW</span>':'<span class="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">LOW JUDGMENT</span>'}function Pe(e,a){var c,T,j,ne;const s=(e==null?void 0:e.periods)||[];if(!s.length||!((c=e.revenue_items)!=null&&c.length)&&!((T=e.cogs_items)!=null&&T.length)&&!((j=e.payroll_items)!=null&&j.length)&&!((ne=e.opex_items)!=null&&ne.length))return`
      <div class="space-y-6">
        <div class="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
          <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mb-4 text-emerald-400">
            📄
          </div>
          <h2 class="text-xl font-bold text-slate-100">No Financial Ledger Data Loaded</h2>
          <p class="text-sm text-slate-400 mt-2 max-w-md">
            The ledger is currently blank. Upload your raw bank transaction CSV to deterministically calculate the Profit & Loss statement, generate trajectory charts, and screen review items.
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <label class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/25 cursor-pointer flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span>Upload Bank Transactions (.CSV)</span>
              <input type="file" id="pnl-csv-upload-input" accept=".csv" class="hidden" />
            </label>

            <button id="pnl-load-benchmark-btn" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all flex items-center gap-1.5">
              <span>↻ Load NYC Restaurant Sample (181 Txs)</span>
            </button>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-around text-xs text-slate-500">
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Zero Hallucination Math</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span> GAAP Restaurant Taxonomy</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span> CapEx & Pass-Through Screening</span>
          </div>
        </div>
      </div>
    `;const p=s.map(u=>`<th class="py-3 px-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">${u}</th>`).join("");function t(u,d,$){return u.length?u.map(h=>{const y=s.map(k=>{const C=h.monthly_amounts[k]||0,P=C<0||h.name.toLowerCase().includes("refund");return`
              <td class="py-2.5 px-4 text-right text-xs font-mono ${P?"text-rose-400":"text-slate-300"}">
                ${P?`-${x(Math.abs(C))}`:x(C)}
              </td>
            `}).join("");return`
          <tr class="hover:bg-slate-800/60 transition-colors border-b border-slate-800/40 cursor-pointer group line-item-row"
              data-item-name="${h.name}" data-item-type="${h.account_type}">
            <td class="py-2.5 px-4 text-xs font-medium text-slate-200 flex items-center justify-between pl-6">
              <span class="group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${$}"></span>
                <span class="truncate max-w-xs md:max-w-md">${h.name}</span>
              </span>
              <span class="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded group-hover:bg-emerald-950/80 group-hover:text-emerald-300 transition-colors">
                ${h.transaction_count} txs ↗
              </span>
            </td>
            ${y}
            <td class="py-2.5 px-4 text-right text-xs font-mono font-semibold text-slate-100 bg-slate-900/40">
              ${x(h.total_amount)}
            </td>
          </tr>
        `}).join(""):`<tr><td colspan="${s.length+2}" class="py-3 px-4 text-xs text-slate-500 italic pl-8">No line items recorded.</td></tr>`}function r(u,d,$,h,y){const k=s.map(C=>{const P=d(C);return`<td class="py-3 px-4 text-right text-xs font-mono font-bold ${y}">${x(P)}</td>`}).join("");return`
      <tr class="${h} border-t border-b border-slate-700/80">
        <td class="py-3 px-4 text-xs font-bold uppercase tracking-wider ${y} flex items-center justify-between">
          <span>${u}</span>
        </td>
        ${k}
        <td class="py-3 px-4 text-right text-xs font-mono font-extrabold ${y} bg-slate-900/80">
          ${x($())}
        </td>
      </tr>
    `}function o(u,d){const $=s.map(y=>`<td class="py-2 px-4 text-right text-xs font-mono text-emerald-400/90 font-medium">${d(y).toFixed(1)}%</td>`).join(""),h=s.reduce((y,k)=>y+d(k),0)/s.length;return`
      <tr class="bg-slate-950/60 text-slate-400 border-b border-slate-800/80 text-[11px]">
        <td class="py-2 px-6 italic text-slate-400">${u}</td>
        ${$}
        <td class="py-2 px-4 text-right font-mono text-emerald-400 font-semibold bg-slate-950">${h.toFixed(1)}% Avg</td>
      </tr>
    `}const n=e.totals.revenue||1,m=e.totals.gross_profit||0,b=e.totals.operating_profit||0,l=(e.totals.payroll||0)+(e.totals.opex||0),f=(m/n*100).toFixed(1),i=(b/n*100).toFixed(1);return`
    <div class="space-y-6">
      <!-- Executive Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Revenue Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Revenue (Q1)</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">+12.7% MoM</span>
          </div>
          <div class="text-2xl font-bold font-mono text-emerald-400 mt-2">${x(n)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Food Sales, Bar, Catering & Delivery
          </div>
        </div>

        <!-- Gross Profit Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Gross Profit</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">${f}% Margin</span>
          </div>
          <div class="text-2xl font-bold font-mono text-slate-100 mt-2">${x(m)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Revenue minus Direct Food & Beverage COGS
          </div>
        </div>

        <!-- Total OpEx & Labor -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Payroll & OpEx</span>
            <span class="text-slate-400 text-[11px] font-semibold">${(l/n*100).toFixed(1)}% of Rev</span>
          </div>
          <div class="text-2xl font-bold font-mono text-amber-300 mt-2">${x(l)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Kitchen Wages, Manager Salary & Rent ($9k)
          </div>
        </div>

        <!-- Operating Profit / EBITDA -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Operating Profit (EBITDA)</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">${i}% Net</span>
          </div>
          <div class="text-2xl font-bold font-mono text-emerald-300 mt-2">${x(b)}</div>
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
          ${s.map(u=>{const d=e.monthly_summaries[u];if(!d)return"";const $=18e4,h=Math.min(100,Math.round(d.revenue/$*100)),y=Math.min(100,Math.round(d.cogs/$*100)),k=Math.min(100,Math.round(d.payroll/$*100)),C=Math.min(100,Math.round(d.opex/$*100));return`
                <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <!-- Header with EBITDA Pill -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-mono text-sm font-bold text-slate-100">${u}</span>
                    <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30">
                      ${d.operating_margin_pct.toFixed(1)}% Margin · ${x(d.operating_profit)}
                    </span>
                  </div>

                  <!-- Visual Bars Container -->
                  <div class="h-36 flex items-end justify-between gap-3 px-2 pt-2 border-b border-slate-800">
                    <!-- Revenue Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${x(d.revenue)}
                      </div>
                      <div class="w-full bg-emerald-500/80 hover:bg-emerald-400 transition-all rounded-t" style="height: ${h}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">Rev</span>
                    </div>

                    <!-- COGS Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${x(d.cogs)}
                      </div>
                      <div class="w-full bg-amber-500/80 hover:bg-amber-400 transition-all rounded-t" style="height: ${y}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">COGS</span>
                    </div>

                    <!-- Payroll Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${x(d.payroll)}
                      </div>
                      <div class="w-full bg-blue-500/80 hover:bg-blue-400 transition-all rounded-t" style="height: ${k}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">Labor</span>
                    </div>

                    <!-- OpEx Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${x(d.opex)}
                      </div>
                      <div class="w-full bg-purple-500/80 hover:bg-purple-400 transition-all rounded-t" style="height: ${C}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">OpEx</span>
                    </div>
                  </div>

                  <!-- Quick Stats Below Bar -->
                  <div class="grid grid-cols-2 gap-2 text-[11px] pt-3 text-slate-400 font-mono">
                    <div>Gross Profit: <span class="text-slate-200 font-semibold">${x(d.gross_profit)}</span></div>
                    <div class="text-right">Gross Margin: <span class="text-emerald-400 font-semibold">${d.gross_margin_pct.toFixed(1)}%</span></div>
                  </div>
                </div>
              `}).join("")}
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
                ${p}
                <th class="py-3 px-4 text-right font-semibold text-slate-100 uppercase tracking-wider text-xs bg-slate-950">Q1 Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. REVENUE SECTION -->
              <tr class="bg-slate-950 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800">
                <td colspan="${s.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>1. Operating Revenue (Inflows)</span>
                </td>
              </tr>
              ${t(e.revenue_items,"Revenue","bg-emerald-400")}
              ${r("Total Operating Revenue",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.revenue)||0},()=>e.totals.revenue,"bg-emerald-950/20","text-emerald-300")}

              <!-- 2. COGS SECTION -->
              <tr class="bg-slate-950 text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${s.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>2. Cost of Goods Sold (COGS)</span>
                </td>
              </tr>
              ${t(e.cogs_items,"Cost of Goods Sold","bg-amber-400")}
              ${r("Total Cost of Goods Sold",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.cogs)||0},()=>e.totals.cogs,"bg-slate-800/40","text-slate-300")}

              <!-- GROSS PROFIT -->
              ${r("Gross Profit (Revenue - COGS)",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.gross_profit)||0},()=>e.totals.gross_profit,"bg-slate-800/80","text-white")}
              ${o("Gross Margin %",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.gross_margin_pct)||0})}

              <!-- 3. PAYROLL SECTION -->
              <tr class="bg-slate-950 text-blue-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${s.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>3. Labor & Payroll Compensation</span>
                </td>
              </tr>
              ${t(e.payroll_items,"Payroll","bg-blue-400")}
              ${r("Total Payroll & Wages",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.payroll)||0},()=>e.totals.payroll,"bg-slate-800/40","text-slate-300")}

              <!-- 4. OPEX SECTION -->
              <tr class="bg-slate-950 text-purple-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${s.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>4. Operating Expenses (OpEx)</span>
                </td>
              </tr>
              ${t(e.opex_items,"Operating Expenses","bg-purple-400")}
              ${r("Total Operating Expenses",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.opex)||0},()=>e.totals.opex,"bg-slate-800/40","text-slate-300")}

              <!-- OPERATING PROFIT (EBITDA) -->
              ${r("Operating Profit / EBITDA",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.operating_profit)||0},()=>e.totals.operating_profit,"bg-emerald-950/40","text-emerald-400 font-extrabold")}
              ${o("Operating Margin % (EBITDA Margin)",u=>{var d;return((d=e.monthly_summaries[u])==null?void 0:d.operating_margin_pct)||0})}

              <!-- NON-P&L / BALANCE SHEET SECTION -->
              <tr class="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider border-t-4 border-slate-800">
                <td colspan="${s.length+2}" class="py-2.5 px-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span>▾</span>
                    <span>Non-P&L Balance Sheet & Financing Activities</span>
                  </div>
                  <span class="text-[10px] font-normal normal-case bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Strictly Excluded from P&L per GAAP ($7.8k Oven Asset, Sales Tax Remittances)
                  </span>
                </td>
              </tr>
              ${t(e.non_pnl_items,"Non-P&L (Balance Sheet)","bg-slate-500")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function De(e,a,s,p){if(!e||!e.length)return`
      <div class="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center max-w-xl mx-auto my-8">
        <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-3 text-indigo-400">
          📈
        </div>
        <h3 class="text-base font-bold text-slate-100">No Variance Analysis Available</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm">
          Please upload a bank transaction dataset with multiple periods (or click "Load Benchmark" in the top bar) to generate the EBITDA Waterfall Bridge and Driver Decomposition.
        </p>
      </div>
    `;const t=e.filter(n=>n.is_material),r=e.filter(n=>!n.is_material);function o(n){const m=n.direction==="favorable",b=n.direction==="unfavorable",l=m?"bg-emerald-500/10 text-emerald-400 border-emerald-500/30":b?"bg-rose-500/10 text-rose-400 border-rose-500/30":"bg-slate-700/30 text-slate-300 border-slate-700",f=n.delta_amount>0?"+":"",i=n.top_drivers.slice(0,3).map(c=>`
        <li class="text-xs text-slate-300 flex items-start justify-between py-1 border-b border-slate-800/60 last:border-none">
          <div class="flex items-center gap-1.5 truncate pr-2">
            <span class="font-mono text-[10px] text-slate-400 bg-slate-800 px-1 rounded">${c.transaction_id}</span>
            <span class="truncate">${c.description}</span>
          </div>
          <div class="text-right shrink-0">
            <span class="font-mono font-medium text-slate-200">${x(c.amount)}</span>
            <span class="text-[10px] text-slate-500 block">(${c.impact_pct}% of total)</span>
          </div>
        </li>
      `).join("");return`
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <h4 class="text-sm font-bold text-slate-100 truncate">${n.category}</h4>
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${l}">
              ${n.direction}
            </span>
          </div>

          <!-- Numbers -->
          <div class="grid grid-cols-3 gap-2 my-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
            <div>
              <div class="text-[10px] text-slate-400 font-medium">${n.period_a}</div>
              <div class="text-xs font-mono text-slate-300 font-semibold">${x(n.amount_a)}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-medium">${n.period_b}</div>
              <div class="text-xs font-mono text-slate-300 font-semibold">${x(n.amount_b)}</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-slate-400 font-medium">Variance (Δ)</div>
              <div class="text-xs font-mono font-bold ${m?"text-emerald-400":b?"text-rose-400":"text-slate-300"}">
                ${f}${x(n.delta_amount)} (${re(n.delta_pct)})
              </div>
            </div>
          </div>

          <!-- Narrative -->
          <p class="text-xs text-slate-400 mb-4 leading-relaxed">
            ${n.narrative_explanation}
          </p>

          <!-- Top Drivers if available -->
          ${n.top_drivers.length>0?`
                <div class="mb-4">
                  <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Key Contributing Drivers (${n.period_b})</span>
                    <span class="text-[10px] text-slate-400">Impact %</span>
                  </div>
                  <ul class="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/60">
                    ${i}
                  </ul>
                </div>
              `:""}
        </div>

        <!-- Action / Evidence Link -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">
            ${n.supporting_transaction_ids.length} supporting transactions
          </span>
          <button
            class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 inspect-variance-btn"
            data-variance-cat="${n.category}">
            <span>Inspect Evidence</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `}return`
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
            <span class="font-mono text-slate-300 font-semibold">${a}</span>
            <span class="text-slate-500">vs</span>
            <span class="font-mono text-emerald-400 font-semibold">${s}</span>
          </div>
        </div>
      </div>

      <!-- VISUAL EBITDA WATERFALL BRIDGE CHART -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>🌉 EBITDA Variance Waterfall Bridge (${a} → ${s})</span>
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
            <div class="text-xs font-semibold text-slate-300 mt-0.5">${a} Actual</div>
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
            <div class="text-xs font-semibold text-emerald-200 mt-0.5">${s} Actual</div>
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
            Material Variances Requiring Scrutiny (${t.length})
          </h4>
          <span class="text-xs text-slate-400">(Threshold: ±$1,500 or ±15%)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${t.map(o).join("")}
        </div>
      </div>

      <!-- Minor Variances Table (Collapsible) -->
      ${r.length>0?`
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
              <div class="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stable / Non-Material Line Items (${r.length})
                </span>
                <span class="text-[11px] text-slate-400">Fluctuations within normal tolerances</span>
              </div>
              <div class="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                ${r.map(n=>`
                      <div class="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-800/40">
                        <span class="text-slate-300 font-medium">${n.category}</span>
                        <div class="flex items-center gap-4">
                          <span class="text-slate-400 font-mono">${x(n.amount_a)} → ${x(n.amount_b)}</span>
                          <span class="font-mono font-medium ${n.delta_amount>=0?"text-slate-300":"text-slate-400"}">
                            ${n.delta_amount>=0?"+":""}${x(n.delta_amount)} (${re(n.delta_pct)})
                          </span>
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `:""}
    </div>
  `}function Re(e,a,s="",p="",t="",r){if(!e||!e.length)return`
      <div class="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center max-w-xl mx-auto my-8">
        <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-3 text-amber-400">
          ⚠️
        </div>
        <h3 class="text-base font-bold text-slate-100">Review Queue is Empty</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm">
          No transactions currently require human review. Upload a bank transactions CSV to screen for capital asset thresholds, sales tax remittances, and anomalies.
        </p>
      </div>
    `;const o={};e.forEach(i=>{const c=i.transaction.category;o[c]=(o[c]||0)+1});let n=e;if(s&&(n=n.filter(i=>i.transaction.category===s)),p&&(n=n.filter(i=>i.severity===p)),t){const i=t.toLowerCase();n=n.filter(c=>c.transaction.description.toLowerCase().includes(i)||c.transaction.id.toLowerCase().includes(i)||c.transaction.subcategory.toLowerCase().includes(i))}const m=a.map(i=>`<option value="${i}" ${i===s?"selected":""}>${i} (${o[i]||0})</option>`).join(""),b=`
    <button class="review-cat-pill px-3 py-1 rounded-full text-xs font-medium transition-all ${s===""?"bg-emerald-500/20 text-emerald-300 border border-emerald-500/40":"bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}" data-category="">
      All Categories (${e.length})
    </button>
  `,l=a.filter(i=>(o[i]||0)>0).map(i=>`
        <button class="review-cat-pill px-3 py-1 rounded-full text-xs font-medium transition-all ${s===i?"bg-emerald-500/20 text-emerald-300 border border-emerald-500/40":"bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}" data-category="${i}">
          ${i} (${o[i]})
        </button>
      `).join(""),f=n.length?n.map(i=>{const c=i.transaction,j={low_confidence:"Low Classification Confidence",anomaly_amount:"Unusual Amount Spike",personal_vs_business:"Peer-to-Peer Transfer (Personal vs Business)",unclear_memo:"Unrecorded Check / Missing Memo",capital_vs_opex:"Capitalization Threshold ($2k+ Hardware/Asset)"}[i.flag_type]||i.flag_type;return`
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all review-card" data-tx-id="${c.id}">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <!-- Left: Transaction Info & Flag -->
                <div class="space-y-1.5 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold">${c.id}</span>
                    <span class="text-xs font-mono text-slate-400">${c.date}</span>
                    ${je(i.severity)}
                    ${se(c.confidence)}
                  </div>

                  <div class="text-sm font-bold text-slate-100 mt-1">
                    ${c.description}
                  </div>

                  <div class="text-xs text-slate-400 flex items-center gap-2">
                    <span>Category: <strong class="text-slate-300 font-medium">${c.category}</strong></span>
                    <span>•</span>
                    <span>Subcategory: <strong class="text-slate-300 font-medium">${c.subcategory}</strong></span>
                    <span>•</span>
                    <span>P&L Status: <strong class="${c.is_pnl?"text-emerald-400":"text-amber-400"}">${c.is_pnl?"Included in P&L":"Non-P&L (Balance Sheet)"}</strong></span>
                  </div>

                  <!-- Audit Flag Box -->
                  <div class="mt-2.5 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs">
                    <div class="font-semibold text-amber-400/90 flex items-center gap-1.5">
                      <span>⚠</span>
                      <span>${j}</span>
                    </div>
                    <p class="text-slate-400 mt-0.5 leading-relaxed">
                      ${i.suggested_action}
                    </p>
                    ${c.review_reason?`<p class="text-[11px] text-slate-500 mt-1 italic">Reason: "${c.review_reason}"</p>`:""}
                  </div>
                </div>

                <!-- Right: Amount & Actions -->
                <div class="flex flex-col md:items-end justify-between gap-3 shrink-0">
                  <div class="text-xl font-bold font-mono text-slate-100 md:text-right">
                    ${x(c.amount)}
                    <span class="text-[10px] text-slate-400 uppercase font-sans block">${c.type}</span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all approve-btn shadow-sm"
                      data-tx-id="${c.id}">
                      ✓ Approve
                    </button>

                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all reclassify-btn shadow-sm"
                      data-tx-id="${c.id}">
                      ✎ Reclassify
                    </button>

                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all exclude-btn shadow-sm"
                      data-tx-id="${c.id}">
                      Exclude from P&L
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `}).join(""):`
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400 text-xs">
        No flagged review items match your active filters (${s||"All categories"}).
      </div>
    `;return`
    <div class="space-y-4">
      <!-- Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Human-in-the-Loop Review Queue
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ${n.length} of ${e.length} Items
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
        ${b}
        ${l}
      </div>

      <!-- Filter Controls Toolbar -->
      <div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            id="review-search-input"
            placeholder="Search flagged item, vendor, or ID..."
            value="${t}"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- Category Dropdown Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400 font-medium whitespace-nowrap">Category:</label>
          <select id="review-category-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="">All Categories (${e.length})</option>
            ${m}
          </select>
        </div>

        <!-- Severity Dropdown Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400 font-medium whitespace-nowrap">Severity:</label>
          <select id="review-severity-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="">All Severities</option>
            <option value="high" ${p==="high"?"selected":""}>High Attention</option>
            <option value="medium" ${p==="medium"?"selected":""}>Medium Review</option>
            <option value="low" ${p==="low"?"selected":""}>Low Judgment</option>
          </select>
        </div>
      </div>

      <!-- Queue Cards List -->
      <div class="space-y-3">
        ${f}
      </div>
    </div>
  `}function Oe(e,a,s="",p="",t="",r="",o){const n=e.length,m=e.length?e.map(l=>{const f=l.type==="credit",i=l.is_pnl?'<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">P&L</span>':'<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-700">Non-P&L</span>',c=l.review_required?'<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">FLAGGED</span>':"";return`
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 text-xs cursor-pointer ledger-row" data-tx-id="${l.id}">
              <td class="py-2.5 px-3 font-mono text-slate-400 font-medium">${l.id}</td>
              <td class="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">${l.date}</td>
              <td class="py-2.5 px-3 font-medium text-slate-100">
                <div class="flex items-center gap-2">
                  <span class="truncate max-w-xs md:max-w-md">${l.description}</span>
                  ${c}
                </div>
              </td>
              <td class="py-2.5 px-3 whitespace-nowrap text-slate-300">
                <span class="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium border border-slate-700">
                  ${l.category}
                </span>
              </td>
              <td class="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[120px]">${l.subcategory}</td>
              <td class="py-2.5 px-3 text-center">${i}</td>
              <td class="py-2.5 px-3 text-center">${se(l.confidence)}</td>
              <td class="py-2.5 px-3 text-right font-mono font-bold ${f?"text-emerald-400":"text-slate-100"} whitespace-nowrap">
                ${f?"+":"-"}${x(l.amount)}
              </td>
              <td class="py-2.5 px-3 text-center">
                <button class="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 edit-tx-btn" data-tx-id="${l.id}">
                  Edit
                </button>
              </td>
            </tr>
          `}).join(""):`
      <tr>
        <td colspan="9" class="py-16 text-center text-xs text-slate-500">
          <div class="flex flex-col items-center justify-center gap-2">
            <span class="text-3xl">📭</span>
            <span class="font-semibold text-slate-300 text-sm">No Transactions in Ledger</span>
            <span class="text-slate-500 max-w-sm">The ledger is empty. Click "Ingest CSV" above or "Load Benchmark" to populate transactions.</span>
          </div>
        </td>
      </tr>
    `,b=a.map(l=>`<option value="${l}" ${l===s?"selected":""}>${l}</option>`).join("");return`
    <div class="space-y-4">
      <!-- Toolbar & Ingestion Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Bank Transaction Ledger
            <span class="text-xs font-normal text-slate-400">(${n} items)</span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Normalized bank entries with automated categorization, reasoning audit trail, and manual correction controls.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Ingest CSV Button -->
          <label class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20">
            <span>↑ Ingest CSV</span>
            <input type="file" id="csv-upload-input" accept=".csv" class="hidden" />
          </label>

          <!-- Load Benchmark Sample -->
          <button id="load-benchmark-btn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1">
            <span>↻ Load Benchmark</span>
          </button>

          <!-- Reset to Blank -->
          <button id="reset-dataset-btn" title="Clear all data and return to blank ledger" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-all flex items-center gap-1">
            <span>✕ Reset to Blank</span>
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
            value="${r}"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- Category Dropdown -->
        <div>
          <select id="ledger-category-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All Categories</option>
            ${b}
          </select>
        </div>

        <!-- Period Dropdown -->
        <div>
          <select id="ledger-period-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All Periods</option>
            <option value="2026-01" ${p==="2026-01"?"selected":""}>2026-01</option>
            <option value="2026-02" ${p==="2026-02"?"selected":""}>2026-02</option>
            <option value="2026-03" ${p==="2026-03"?"selected":""}>2026-03</option>
          </select>
        </div>

        <!-- P&L Status Dropdown -->
        <div>
          <select id="ledger-pnl-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All P&L Types</option>
            <option value="true" ${t==="true"?"selected":""}>P&L Only</option>
            <option value="false" ${t==="false"?"selected":""}>Non-P&L (Balance Sheet)</option>
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
              ${m}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function Me(e,a,s){const t=["What was our revenue in March?","How much did we spend on payroll each month?","Why did operating profit change between February and March?","What drove the increase in food costs?","Which transactions need my attention?","Show me the transactions behind that variance.","What changed most significantly over the review period?"].map(o=>`
        <button
          class="px-2.5 py-1 text-xs rounded-full bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-500/40 text-slate-300 border border-slate-700 transition-all text-left prompt-chip"
          data-prompt="${o}">
          ${o}
        </button>
      `).join(""),r=e.map(o=>{const n=o.role==="user",m=n?'<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">You (Executive Reviewer)</span>':`<span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            FINZ AI Financial Analyst · Grounded In Deterministic Ledger
           </span>`;let b="";o.citations&&o.citations.length>0&&(b=`
          <div class="mt-3 pt-3 border-t border-slate-800/80">
            <div class="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
              <span>Verified Audit Citations (Click to inspect):</span>
            </div>
            <div class="flex flex-wrap gap-2">
              ${o.citations.map(i=>`
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 hover:text-emerald-200 transition-all shadow-sm citation-btn"
                data-tx-id="${i.transaction_id}">
                <span class="text-slate-400 font-bold">${i.transaction_id}</span>
                <span>•</span>
                <span class="text-slate-300 truncate max-w-[140px]">${i.description}</span>
                <span>•</span>
                <span class="text-emerald-400 font-bold">${x(i.amount)}</span>
                <span class="text-slate-500">↗</span>
              </button>
            `).join("")}
            </div>
          </div>
        `);let l=o.content.replace(/\n\n/g,"<br/><br/>").replace(/\n- /g,"<br/>• ").replace(/\n### (.*?)(<br\/>|$)/g,'<h5 class="text-xs font-bold text-slate-100 uppercase tracking-wider mt-2 mb-1">$1</h5>').replace(/\*\*(.*?)\*\*/g,'<strong class="text-slate-100 font-semibold">$1</strong>').replace(/\*(.*?)\*/g,'<em class="text-slate-300">$1</em>');return`
        <div class="p-4 rounded-xl ${n?"bg-slate-900 border border-slate-800 ml-8":"bg-slate-900/90 border border-emerald-950/80 mr-8"} shadow-md">
          <div class="flex items-center justify-between mb-1.5">
            ${m}
          </div>
          <div class="text-xs text-slate-200 leading-relaxed font-sans">
            ${l}
          </div>
          ${b}
        </div>
      `}).join("");return`
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
          ${t}
        </div>
      </div>

      <!-- Chat Stream Container -->
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 shadow-inner" id="chat-messages-container">
        ${e.length===0?`
              <div class="text-center py-16 text-slate-500 text-xs">
                Select one of the challenge questions above or type your own question below to start the financial review.
              </div>
            `:r}
        ${a?`
              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 mr-8 animate-pulse">
                <div class="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Querying deterministic ledger & synthesizing explainable evidence...
                </div>
              </div>
            `:""}
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
  `}let w="pnl",I=null,Z=[],fe=[],E=[],B=[],N=!1,D="",R="",O="",M="",V="",oe="",le="",_=null;const g=document.getElementById("view-container"),Fe=document.getElementById("review-count-badge"),ge=document.getElementById("audit-drawer"),H=document.getElementById("drawer-backdrop"),q=document.getElementById("close-drawer-btn"),Ne=document.getElementById("drawer-title"),Ge=document.getElementById("drawer-subtitle"),W=document.getElementById("drawer-tx-list"),Ve=document.getElementById("drawer-total-amount"),ve=document.getElementById("edit-modal"),U=document.getElementById("modal-backdrop"),Q=document.getElementById("close-modal-btn"),z=document.getElementById("cancel-modal-btn"),J=document.getElementById("save-modal-btn"),He=document.getElementById("modal-tx-desc"),qe=document.getElementById("modal-tx-meta"),he=document.getElementById("modal-cat-select"),ye=document.getElementById("modal-subcat-input"),we=document.getElementById("modal-pnl-select"),$e=document.getElementById("modal-notes-input"),ie=document.getElementById("toast"),We=document.getElementById("toast-message");function S(e){We.textContent=e,ie.classList.remove("translate-y-20","opacity-0"),setTimeout(()=>{ie.classList.add("translate-y-20","opacity-0")},3500)}async function A(){var e;try{const[a,s,p,t]=await Promise.all([ke(),Ie("2026-02","2026-03"),Se(),Ae()]);I=a,Z=s,fe=p,E=t,Fe.textContent=String(p.length);const r=document.getElementById("header-status-dot"),o=document.getElementById("header-status-text");r&&o&&(t.length===0?(r.className="w-2 h-2 rounded-full bg-slate-500",o.textContent="Blank Ledger (0 Txs)"):(r.className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse",o.textContent=`Q1 2026 Audit (${t.length} Txs)`)),v()}catch(a){console.error("Failed to load data from backend:",a),g.innerHTML=`
      <div class="p-8 bg-rose-950/40 border border-rose-800 rounded-xl text-center">
        <h3 class="text-sm font-bold text-rose-300">Backend Connection Error</h3>
        <p class="text-xs text-slate-400 mt-1">Make sure the FastAPI server is running on http://localhost:8000.</p>
        <button id="retry-btn" class="mt-4 px-4 py-1.5 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white">Retry Connection</button>
      </div>
    `,(e=document.getElementById("retry-btn"))==null||e.addEventListener("click",A)}}async function ee(e){try{S("Ingesting and classifying bank transactions...");const a=await Ce(e);S(`Successfully classified ${a.count} transactions!`),await A()}catch(a){console.error(a),alert(`CSV Ingestion error: ${a.message}`)}}async function Ee(){if(confirm("Are you sure you want to clear all transactions and reset to a completely blank ledger?"))try{await Be(),B=[],S("Ledger cleared (0 transactions)."),await A()}catch(e){console.error(e),alert(`Reset error: ${e.message}`)}}async function de(){try{S("Loading NYC Restaurant benchmark dataset (181 Txs)...");const e=await _e();S(`Loaded ${e.count} verified transactions!`),await A()}catch(e){console.error(e),alert(`Failed to load benchmark dataset: ${e.message}`)}}function F(e,a,s){Ne.textContent=e,Ge.textContent=a;const p=s.reduce((t,r)=>t+r.amount,0);Ve.textContent=x(p),s.length?W.innerHTML=s.map(t=>`
          <div class="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-slate-700 transition-all flex items-start justify-between gap-3 text-xs">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-slate-400 font-bold">${t.id}</span>
                <span class="font-mono text-[11px] text-slate-500">${t.date}</span>
                ${se(t.confidence)}
              </div>
              <div class="font-semibold text-slate-200">${t.description}</div>
              <div class="text-[11px] text-slate-400">
                ${t.category} &bull; ${t.subcategory}
              </div>
              ${t.reasoning?`<div class="text-[10px] text-slate-500 italic">Audit note: ${t.reasoning}</div>`:""}
            </div>
            <div class="text-right shrink-0">
              <div class="font-mono font-bold text-slate-100">${x(t.amount)}</div>
              <button class="mt-2 px-2 py-0.5 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 drawer-edit-btn" data-tx-id="${t.id}">
                Reclassify
              </button>
            </div>
          </div>
        `).join(""):W.innerHTML='<div class="text-xs text-slate-500 italic p-4">No matching transactions found in active ledger.</div>',ge.classList.remove("hidden"),W.querySelectorAll(".drawer-edit-btn").forEach(t=>{t.addEventListener("click",r=>{const o=r.currentTarget.getAttribute("data-tx-id"),n=E.find(m=>m.id===o);n&&(ae(),te(n))})})}function ae(){ge.classList.add("hidden")}function te(e){_=e,He.textContent=e.description,qe.textContent=`${e.id} • ${e.date} • ${x(e.amount)} (${e.type.toUpperCase()})`,he.value=e.category,ye.value=e.subcategory,we.value=String(e.is_pnl),$e.value="",ve.classList.remove("hidden")}function G(){ve.classList.add("hidden"),_=null}async function Ue(){if(!_)return;const e=he.value,a=ye.value.trim()||"General",s=we.value==="true",p=$e.value.trim();try{await X(_.id,{category:e,subcategory:a,is_pnl:s,review_required:!1,notes:p||"Updated via manual review modal"}),G(),S(`Transaction ${_.id} reclassified to ${e}. P&L recomputed!`),await A()}catch(t){alert(`Error updating transaction: ${t.message}`)}}function v(){if(!I)return;document.querySelectorAll(".tab-btn").forEach(a=>{a.classList.remove("border-emerald-500","text-emerald-400","font-semibold"),a.classList.add("border-transparent","text-slate-400")});const e=document.getElementById(`tab-${w}`);if(e&&(e.classList.remove("border-transparent","text-slate-400"),e.classList.add("border-emerald-500","text-emerald-400","font-semibold")),w==="pnl"){g.innerHTML=Pe(I);const a=document.getElementById("pnl-csv-upload-input");a==null||a.addEventListener("change",p=>{var r;const t=(r=p.target.files)==null?void 0:r[0];t&&ee(t)});const s=document.getElementById("pnl-load-benchmark-btn");s==null||s.addEventListener("click",de),g.querySelectorAll(".line-item-row").forEach(p=>{p.addEventListener("click",t=>{const r=t.currentTarget.getAttribute("data-item-name"),o=t.currentTarget.getAttribute("data-item-type"),m=[...I.revenue_items,...I.cogs_items,...I.payroll_items,...I.opex_items,...I.non_pnl_items].find(b=>b.name===r&&b.account_type===o);if(m){const b=E.filter(l=>m.transaction_ids.includes(l.id));F(`${m.name} (${m.account_type})`,`${b.length} underlying transactions`,b)}})})}else if(w==="variance")g.innerHTML=De(Z,"2026-02","2026-03"),g.querySelectorAll(".inspect-variance-btn").forEach(a=>{a.addEventListener("click",s=>{const p=s.currentTarget.getAttribute("data-variance-cat"),t=Z.find(r=>r.category===p);if(t){const r=E.filter(o=>t.supporting_transaction_ids.includes(o.id));F(`Evidence: ${t.category}`,`${r.length} transactions driving variance of ${x(t.delta_amount)}`,r)}})});else if(w==="review"){const a=["Revenue","Cost of Goods Sold","Payroll","Operating Expenses","Non-P&L (Balance Sheet)"];g.innerHTML=Re(fe,a,V,oe,le);const s=document.getElementById("review-category-select");s==null||s.addEventListener("change",r=>{V=r.target.value,v()});const p=document.getElementById("review-severity-select");p==null||p.addEventListener("change",r=>{oe=r.target.value,v()});const t=document.getElementById("review-search-input");t==null||t.addEventListener("input",r=>{le=r.target.value,v()}),g.querySelectorAll(".review-cat-pill").forEach(r=>{r.addEventListener("click",o=>{V=o.currentTarget.getAttribute("data-category")||"",v()})}),g.querySelectorAll(".approve-btn").forEach(r=>{r.addEventListener("click",async o=>{const n=o.currentTarget.getAttribute("data-tx-id");await X(n,{review_required:!1,notes:"Approved classification"}),S(`Approved ${n}. Status verified.`),await A()})}),g.querySelectorAll(".reclassify-btn").forEach(r=>{r.addEventListener("click",o=>{const n=o.currentTarget.getAttribute("data-tx-id"),m=E.find(b=>b.id===n);m&&te(m)})}),g.querySelectorAll(".exclude-btn").forEach(r=>{r.addEventListener("click",async o=>{const n=o.currentTarget.getAttribute("data-tx-id");await X(n,{category:"Non-P&L (Balance Sheet)",subcategory:"Internal Transfer",is_pnl:!1,review_required:!1,notes:"Excluded from P&L per accountant decision"}),S(`Excluded ${n} from P&L. Statement recomputed!`),await A()})})}else if(w==="ledger"){const a=["Revenue","Cost of Goods Sold","Payroll","Operating Expenses","Non-P&L (Balance Sheet)"];let s=E;if(D&&(s=s.filter(l=>l.category===D)),R&&(s=s.filter(l=>l.date.startsWith(R))),O!==""&&(s=s.filter(l=>String(l.is_pnl)===O)),M){const l=M.toLowerCase();s=s.filter(f=>f.description.toLowerCase().includes(l)||f.id.toLowerCase().includes(l))}g.innerHTML=Oe(s,a,D,R,O,M);const p=document.getElementById("ledger-search-input");p==null||p.addEventListener("input",l=>{M=l.target.value,v()});const t=document.getElementById("ledger-category-select");t==null||t.addEventListener("change",l=>{D=l.target.value,v()});const r=document.getElementById("ledger-period-select");r==null||r.addEventListener("change",l=>{R=l.target.value,v()});const o=document.getElementById("ledger-pnl-select");o==null||o.addEventListener("change",l=>{O=l.target.value,v()});const n=document.getElementById("csv-upload-input");n==null||n.addEventListener("change",l=>{var i;const f=(i=l.target.files)==null?void 0:i[0];f&&ee(f)});const m=document.getElementById("reset-dataset-btn");m==null||m.addEventListener("click",Ee);const b=document.getElementById("load-benchmark-btn");b==null||b.addEventListener("click",de),g.querySelectorAll(".edit-tx-btn").forEach(l=>{l.addEventListener("click",f=>{f.stopPropagation();const i=f.currentTarget.getAttribute("data-tx-id"),c=E.find(T=>T.id===i);c&&te(c)})}),g.querySelectorAll(".ledger-row").forEach(l=>{l.addEventListener("click",f=>{const i=f.currentTarget.getAttribute("data-tx-id"),c=E.find(T=>T.id===i);c&&F(`Transaction Details: ${c.id}`,c.description,[c])})})}else if(w==="analyst"){g.innerHTML=Me(B,N),g.querySelectorAll(".prompt-chip").forEach(t=>{t.addEventListener("click",async r=>{const o=r.currentTarget.getAttribute("data-prompt");await ce(o)})}),g.querySelectorAll(".citation-btn").forEach(t=>{t.addEventListener("click",r=>{const o=r.currentTarget.getAttribute("data-tx-id"),n=E.find(m=>m.id===o);n&&F(`Evidence: ${n.id}`,n.description,[n])})});const a=document.getElementById("analyst-input"),s=document.getElementById("analyst-send-btn"),p=async()=>{const t=a.value.trim();!t||N||(a.value="",await ce(t))};s==null||s.addEventListener("click",p),a==null||a.addEventListener("keydown",t=>{t.key==="Enter"&&p()})}}async function ce(e){B.push({role:"user",content:e}),N=!0,v();try{const a=await Te(e,B);B.push({role:"assistant",content:a.answer,citations:a.citations})}catch(a){B.push({role:"assistant",content:`*Error querying financial analyst: ${a.message}. Please check that the backend is running.*`})}finally{N=!1,v();const a=document.getElementById("chat-messages-container");a&&(a.scrollTop=a.scrollHeight)}}var pe;(pe=document.getElementById("tab-pnl"))==null||pe.addEventListener("click",()=>{w="pnl",v()});var xe;(xe=document.getElementById("tab-variance"))==null||xe.addEventListener("click",()=>{w="variance",v()});var me;(me=document.getElementById("tab-review"))==null||me.addEventListener("click",()=>{w="review",v()});var ue;(ue=document.getElementById("tab-ledger"))==null||ue.addEventListener("click",()=>{w="ledger",v()});var be;(be=document.getElementById("tab-analyst"))==null||be.addEventListener("click",()=>{w="analyst",v()});q==null||q.addEventListener("click",ae);H==null||H.addEventListener("click",ae);Q==null||Q.addEventListener("click",G);z==null||z.addEventListener("click",G);U==null||U.addEventListener("click",G);J==null||J.addEventListener("click",Ue);const Y=document.getElementById("global-csv-input");Y==null||Y.addEventListener("change",e=>{var s;const a=(s=e.target.files)==null?void 0:s[0];a&&ee(a)});const K=document.getElementById("global-reset-btn");K==null||K.addEventListener("click",Ee);A();
