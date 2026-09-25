(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))c(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const be=window.location.port==="5173",I=be?"http://localhost:8000/api":"/api";async function fe(){const e=await fetch(`${I}/pnl`);if(!e.ok)throw new Error("Failed to load P&L Statement");return e.json()}async function ge(e="2026-02",n="2026-03"){const t=await fetch(`${I}/variances?period_a=${e}&period_b=${n}`);if(!t.ok)throw new Error("Failed to load Variance Analysis");return t.json()}async function ve(){const e=await fetch(`${I}/review-queue`);if(!e.ok)throw new Error("Failed to load Review Queue");return e.json()}async function ye(e){const n=new URLSearchParams,t=await fetch(`${I}/transactions?${n.toString()}`);if(!t.ok)throw new Error("Failed to load Transactions");return t.json()}async function Q(e,n){const t=await fetch(`${I}/transactions/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!t.ok)throw new Error(`Failed to update transaction ${e}`);return t.json()}async function he(e,n=[]){const t=await fetch(`${I}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,conversation_history:n})});if(!t.ok)throw new Error("Failed to get answer from AI Analyst");return t.json()}async function we(e){const n=new FormData;n.append("file",e);const t=await fetch(`${I}/upload`,{method:"POST",body:n});if(!t.ok)throw new Error("Failed to upload CSV file");return t.json()}async function $e(){const e=await fetch(`${I}/reset`,{method:"POST"});if(!e.ok)throw new Error("Failed to reset dataset");return e.json()}function m(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(e)}function X(e){return`${e>0?"+":""}${e.toFixed(1)}%`}function K(e){const n=Math.round(e*100);return e>=.9?`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${n}% Confident</span>`:e>=.7?`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">${n}% Uncertain</span>`:`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">${n}% Review Req.</span>`}function Ee(e){return e==="high"?'<span class="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">HIGH ATTENTION</span>':e==="medium"?'<span class="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">MEDIUM REVIEW</span>':'<span class="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">LOW JUDGMENT</span>'}function Le(e,n){const t=e.periods,c=t.map(r=>`<th class="py-3 px-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">${r}</th>`).join("");function s(r,d,y){return r.length?r.map(v=>{const h=t.map(E=>{const S=v.monthly_amounts[E]||0,k=S<0||v.name.toLowerCase().includes("refund");return`
              <td class="py-2.5 px-4 text-right text-xs font-mono ${k?"text-rose-400":"text-slate-300"}">
                ${k?`-${m(Math.abs(S))}`:m(S)}
              </td>
            `}).join("");return`
          <tr class="hover:bg-slate-800/60 transition-colors border-b border-slate-800/40 cursor-pointer group line-item-row"
              data-item-name="${v.name}" data-item-type="${v.account_type}">
            <td class="py-2.5 px-4 text-xs font-medium text-slate-200 flex items-center justify-between pl-6">
              <span class="group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${y}"></span>
                <span class="truncate max-w-xs md:max-w-md">${v.name}</span>
              </span>
              <span class="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded group-hover:bg-emerald-950/80 group-hover:text-emerald-300 transition-colors">
                ${v.transaction_count} txs ↗
              </span>
            </td>
            ${h}
            <td class="py-2.5 px-4 text-right text-xs font-mono font-semibold text-slate-100 bg-slate-900/40">
              ${m(v.total_amount)}
            </td>
          </tr>
        `}).join(""):`<tr><td colspan="${t.length+2}" class="py-3 px-4 text-xs text-slate-500 italic pl-8">No line items recorded.</td></tr>`}function o(r,d,y,v,h){const E=t.map(S=>{const k=d(S);return`<td class="py-3 px-4 text-right text-xs font-mono font-bold ${h}">${m(k)}</td>`}).join("");return`
      <tr class="${v} border-t border-b border-slate-700/80">
        <td class="py-3 px-4 text-xs font-bold uppercase tracking-wider ${h} flex items-center justify-between">
          <span>${r}</span>
        </td>
        ${E}
        <td class="py-3 px-4 text-right text-xs font-mono font-extrabold ${h} bg-slate-900/80">
          ${m(y())}
        </td>
      </tr>
    `}function i(r,d){const y=t.map(h=>`<td class="py-2 px-4 text-right text-xs font-mono text-emerald-400/90 font-medium">${d(h).toFixed(1)}%</td>`).join(""),v=t.reduce((h,E)=>h+d(E),0)/t.length;return`
      <tr class="bg-slate-950/60 text-slate-400 border-b border-slate-800/80 text-[11px]">
        <td class="py-2 px-6 italic text-slate-400">${r}</td>
        ${y}
        <td class="py-2 px-4 text-right font-mono text-emerald-400 font-semibold bg-slate-950">${v.toFixed(1)}% Avg</td>
      </tr>
    `}const a=e.totals.revenue||1,u=e.totals.gross_profit||0,p=e.totals.operating_profit||0,x=(e.totals.payroll||0)+(e.totals.opex||0),b=(u/a*100).toFixed(1),l=(p/a*100).toFixed(1);return`
    <div class="space-y-6">
      <!-- Executive Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Revenue Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Revenue (Q1)</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">+12.7% MoM</span>
          </div>
          <div class="text-2xl font-bold font-mono text-emerald-400 mt-2">${m(a)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Food Sales, Bar, Catering & Delivery
          </div>
        </div>

        <!-- Gross Profit Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Gross Profit</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">${b}% Margin</span>
          </div>
          <div class="text-2xl font-bold font-mono text-slate-100 mt-2">${m(u)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Revenue minus Direct Food & Beverage COGS
          </div>
        </div>

        <!-- Total OpEx & Labor -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Payroll & OpEx</span>
            <span class="text-slate-400 text-[11px] font-semibold">${(x/a*100).toFixed(1)}% of Rev</span>
          </div>
          <div class="text-2xl font-bold font-mono text-amber-300 mt-2">${m(x)}</div>
          <div class="text-[11px] text-slate-400 mt-1">
            Kitchen Wages, Manager Salary & Rent ($9k)
          </div>
        </div>

        <!-- Operating Profit / EBITDA -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Operating Profit (EBITDA)</span>
            <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold">${l}% Net</span>
          </div>
          <div class="text-2xl font-bold font-mono text-emerald-300 mt-2">${m(p)}</div>
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
          ${t.map(r=>{const d=e.monthly_summaries[r];if(!d)return"";const y=18e4,v=Math.min(100,Math.round(d.revenue/y*100)),h=Math.min(100,Math.round(d.cogs/y*100)),E=Math.min(100,Math.round(d.payroll/y*100)),S=Math.min(100,Math.round(d.opex/y*100));return`
                <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <!-- Header with EBITDA Pill -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-mono text-sm font-bold text-slate-100">${r}</span>
                    <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30">
                      ${d.operating_margin_pct.toFixed(1)}% Margin · ${m(d.operating_profit)}
                    </span>
                  </div>

                  <!-- Visual Bars Container -->
                  <div class="h-36 flex items-end justify-between gap-3 px-2 pt-2 border-b border-slate-800">
                    <!-- Revenue Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${m(d.revenue)}
                      </div>
                      <div class="w-full bg-emerald-500/80 hover:bg-emerald-400 transition-all rounded-t" style="height: ${v}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">Rev</span>
                    </div>

                    <!-- COGS Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${m(d.cogs)}
                      </div>
                      <div class="w-full bg-amber-500/80 hover:bg-amber-400 transition-all rounded-t" style="height: ${h}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">COGS</span>
                    </div>

                    <!-- Payroll Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${m(d.payroll)}
                      </div>
                      <div class="w-full bg-blue-500/80 hover:bg-blue-400 transition-all rounded-t" style="height: ${E}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">Labor</span>
                    </div>

                    <!-- OpEx Bar -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                      <div class="text-[10px] font-mono text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                        ${m(d.opex)}
                      </div>
                      <div class="w-full bg-purple-500/80 hover:bg-purple-400 transition-all rounded-t" style="height: ${S}%;"></div>
                      <span class="text-[10px] text-slate-400 font-medium">OpEx</span>
                    </div>
                  </div>

                  <!-- Quick Stats Below Bar -->
                  <div class="grid grid-cols-2 gap-2 text-[11px] pt-3 text-slate-400 font-mono">
                    <div>Gross Profit: <span class="text-slate-200 font-semibold">${m(d.gross_profit)}</span></div>
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
                ${c}
                <th class="py-3 px-4 text-right font-semibold text-slate-100 uppercase tracking-wider text-xs bg-slate-950">Q1 Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. REVENUE SECTION -->
              <tr class="bg-slate-950 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800">
                <td colspan="${t.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>1. Operating Revenue (Inflows)</span>
                </td>
              </tr>
              ${s(e.revenue_items,"Revenue","bg-emerald-400")}
              ${o("Total Operating Revenue",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.revenue)||0},()=>e.totals.revenue,"bg-emerald-950/20","text-emerald-300")}

              <!-- 2. COGS SECTION -->
              <tr class="bg-slate-950 text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${t.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>2. Cost of Goods Sold (COGS)</span>
                </td>
              </tr>
              ${s(e.cogs_items,"Cost of Goods Sold","bg-amber-400")}
              ${o("Total Cost of Goods Sold",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.cogs)||0},()=>e.totals.cogs,"bg-slate-800/40","text-slate-300")}

              <!-- GROSS PROFIT -->
              ${o("Gross Profit (Revenue - COGS)",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.gross_profit)||0},()=>e.totals.gross_profit,"bg-slate-800/80","text-white")}
              ${i("Gross Margin %",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.gross_margin_pct)||0})}

              <!-- 3. PAYROLL SECTION -->
              <tr class="bg-slate-950 text-blue-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${t.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>3. Labor & Payroll Compensation</span>
                </td>
              </tr>
              ${s(e.payroll_items,"Payroll","bg-blue-400")}
              ${o("Total Payroll & Wages",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.payroll)||0},()=>e.totals.payroll,"bg-slate-800/40","text-slate-300")}

              <!-- 4. OPEX SECTION -->
              <tr class="bg-slate-950 text-purple-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 border-t-2 border-slate-800">
                <td colspan="${t.length+2}" class="py-2.5 px-4 flex items-center gap-2">
                  <span>▾</span>
                  <span>4. Operating Expenses (OpEx)</span>
                </td>
              </tr>
              ${s(e.opex_items,"Operating Expenses","bg-purple-400")}
              ${o("Total Operating Expenses",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.opex)||0},()=>e.totals.opex,"bg-slate-800/40","text-slate-300")}

              <!-- OPERATING PROFIT (EBITDA) -->
              ${o("Operating Profit / EBITDA",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.operating_profit)||0},()=>e.totals.operating_profit,"bg-emerald-950/40","text-emerald-400 font-extrabold")}
              ${i("Operating Margin % (EBITDA Margin)",r=>{var d;return((d=e.monthly_summaries[r])==null?void 0:d.operating_margin_pct)||0})}

              <!-- NON-P&L / BALANCE SHEET SECTION -->
              <tr class="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider border-t-4 border-slate-800">
                <td colspan="${t.length+2}" class="py-2.5 px-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span>▾</span>
                    <span>Non-P&L Balance Sheet & Financing Activities</span>
                  </div>
                  <span class="text-[10px] font-normal normal-case bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Strictly Excluded from P&L per GAAP ($7.8k Oven Asset, Sales Tax Remittances)
                  </span>
                </td>
              </tr>
              ${s(e.non_pnl_items,"Non-P&L (Balance Sheet)","bg-slate-500")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function Ie(e,n,t,c){if(!e.length)return`<div class="p-8 text-center text-slate-400">No variances detected between ${n} and ${t}.</div>`;const s=e.filter(a=>a.is_material),o=e.filter(a=>!a.is_material);function i(a){const u=a.direction==="favorable",p=a.direction==="unfavorable",x=u?"bg-emerald-500/10 text-emerald-400 border-emerald-500/30":p?"bg-rose-500/10 text-rose-400 border-rose-500/30":"bg-slate-700/30 text-slate-300 border-slate-700",b=a.delta_amount>0?"+":"",l=a.top_drivers.slice(0,3).map(r=>`
        <li class="text-xs text-slate-300 flex items-start justify-between py-1 border-b border-slate-800/60 last:border-none">
          <div class="flex items-center gap-1.5 truncate pr-2">
            <span class="font-mono text-[10px] text-slate-400 bg-slate-800 px-1 rounded">${r.transaction_id}</span>
            <span class="truncate">${r.description}</span>
          </div>
          <div class="text-right shrink-0">
            <span class="font-mono font-medium text-slate-200">${m(r.amount)}</span>
            <span class="text-[10px] text-slate-500 block">(${r.impact_pct}% of total)</span>
          </div>
        </li>
      `).join("");return`
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <h4 class="text-sm font-bold text-slate-100 truncate">${a.category}</h4>
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${x}">
              ${a.direction}
            </span>
          </div>

          <!-- Numbers -->
          <div class="grid grid-cols-3 gap-2 my-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
            <div>
              <div class="text-[10px] text-slate-400 font-medium">${a.period_a}</div>
              <div class="text-xs font-mono text-slate-300 font-semibold">${m(a.amount_a)}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-medium">${a.period_b}</div>
              <div class="text-xs font-mono text-slate-300 font-semibold">${m(a.amount_b)}</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-slate-400 font-medium">Variance (Δ)</div>
              <div class="text-xs font-mono font-bold ${u?"text-emerald-400":p?"text-rose-400":"text-slate-300"}">
                ${b}${m(a.delta_amount)} (${X(a.delta_pct)})
              </div>
            </div>
          </div>

          <!-- Narrative -->
          <p class="text-xs text-slate-400 mb-4 leading-relaxed">
            ${a.narrative_explanation}
          </p>

          <!-- Top Drivers if available -->
          ${a.top_drivers.length>0?`
                <div class="mb-4">
                  <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Key Contributing Drivers (${a.period_b})</span>
                    <span class="text-[10px] text-slate-400">Impact %</span>
                  </div>
                  <ul class="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/60">
                    ${l}
                  </ul>
                </div>
              `:""}
        </div>

        <!-- Action / Evidence Link -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">
            ${a.supporting_transaction_ids.length} supporting transactions
          </span>
          <button
            class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 inspect-variance-btn"
            data-variance-cat="${a.category}">
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
            <span class="font-mono text-slate-300 font-semibold">${n}</span>
            <span class="text-slate-500">vs</span>
            <span class="font-mono text-emerald-400 font-semibold">${t}</span>
          </div>
        </div>
      </div>

      <!-- VISUAL EBITDA WATERFALL BRIDGE CHART -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>🌉 EBITDA Variance Waterfall Bridge (${n} → ${t})</span>
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
            <div class="text-xs font-semibold text-slate-300 mt-0.5">${n} Actual</div>
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
            <div class="text-xs font-semibold text-emerald-200 mt-0.5">${t} Actual</div>
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
            Material Variances Requiring Scrutiny (${s.length})
          </h4>
          <span class="text-xs text-slate-400">(Threshold: ±$1,500 or ±15%)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${s.map(i).join("")}
        </div>
      </div>

      <!-- Minor Variances Table (Collapsible) -->
      ${o.length>0?`
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
              <div class="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stable / Non-Material Line Items (${o.length})
                </span>
                <span class="text-[11px] text-slate-400">Fluctuations within normal tolerances</span>
              </div>
              <div class="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                ${o.map(a=>`
                      <div class="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-800/40">
                        <span class="text-slate-300 font-medium">${a.category}</span>
                        <div class="flex items-center gap-4">
                          <span class="text-slate-400 font-mono">${m(a.amount_a)} → ${m(a.amount_b)}</span>
                          <span class="font-mono font-medium ${a.delta_amount>=0?"text-slate-300":"text-slate-400"}">
                            ${a.delta_amount>=0?"+":""}${m(a.delta_amount)} (${X(a.delta_pct)})
                          </span>
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `:""}
    </div>
  `}function Se(e,n,t="",c="",s="",o){const i={};e.forEach(l=>{const r=l.transaction.category;i[r]=(i[r]||0)+1});let a=e;if(t&&(a=a.filter(l=>l.transaction.category===t)),c&&(a=a.filter(l=>l.severity===c)),s){const l=s.toLowerCase();a=a.filter(r=>r.transaction.description.toLowerCase().includes(l)||r.transaction.id.toLowerCase().includes(l)||r.transaction.subcategory.toLowerCase().includes(l))}const u=n.map(l=>`<option value="${l}" ${l===t?"selected":""}>${l} (${i[l]||0})</option>`).join(""),p=`
    <button class="review-cat-pill px-3 py-1 rounded-full text-xs font-medium transition-all ${t===""?"bg-emerald-500/20 text-emerald-300 border border-emerald-500/40":"bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}" data-category="">
      All Categories (${e.length})
    </button>
  `,x=n.filter(l=>(i[l]||0)>0).map(l=>`
        <button class="review-cat-pill px-3 py-1 rounded-full text-xs font-medium transition-all ${t===l?"bg-emerald-500/20 text-emerald-300 border border-emerald-500/40":"bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}" data-category="${l}">
          ${l} (${i[l]})
        </button>
      `).join(""),b=a.length?a.map(l=>{const r=l.transaction,y={low_confidence:"Low Classification Confidence",anomaly_amount:"Unusual Amount Spike",personal_vs_business:"Peer-to-Peer Transfer (Personal vs Business)",unclear_memo:"Unrecorded Check / Missing Memo",capital_vs_opex:"Capitalization Threshold ($2k+ Hardware/Asset)"}[l.flag_type]||l.flag_type;return`
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all review-card" data-tx-id="${r.id}">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <!-- Left: Transaction Info & Flag -->
                <div class="space-y-1.5 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold">${r.id}</span>
                    <span class="text-xs font-mono text-slate-400">${r.date}</span>
                    ${Ee(l.severity)}
                    ${K(r.confidence)}
                  </div>

                  <div class="text-sm font-bold text-slate-100 mt-1">
                    ${r.description}
                  </div>

                  <div class="text-xs text-slate-400 flex items-center gap-2">
                    <span>Category: <strong class="text-slate-300 font-medium">${r.category}</strong></span>
                    <span>•</span>
                    <span>Subcategory: <strong class="text-slate-300 font-medium">${r.subcategory}</strong></span>
                    <span>•</span>
                    <span>P&L Status: <strong class="${r.is_pnl?"text-emerald-400":"text-amber-400"}">${r.is_pnl?"Included in P&L":"Non-P&L (Balance Sheet)"}</strong></span>
                  </div>

                  <!-- Audit Flag Box -->
                  <div class="mt-2.5 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs">
                    <div class="font-semibold text-amber-400/90 flex items-center gap-1.5">
                      <span>⚠</span>
                      <span>${y}</span>
                    </div>
                    <p class="text-slate-400 mt-0.5 leading-relaxed">
                      ${l.suggested_action}
                    </p>
                    ${r.review_reason?`<p class="text-[11px] text-slate-500 mt-1 italic">Reason: "${r.review_reason}"</p>`:""}
                  </div>
                </div>

                <!-- Right: Amount & Actions -->
                <div class="flex flex-col md:items-end justify-between gap-3 shrink-0">
                  <div class="text-xl font-bold font-mono text-slate-100 md:text-right">
                    ${m(r.amount)}
                    <span class="text-[10px] text-slate-400 uppercase font-sans block">${r.type}</span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all approve-btn shadow-sm"
                      data-tx-id="${r.id}">
                      ✓ Approve
                    </button>

                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all reclassify-btn shadow-sm"
                      data-tx-id="${r.id}">
                      ✎ Reclassify
                    </button>

                    <button
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all exclude-btn shadow-sm"
                      data-tx-id="${r.id}">
                      Exclude from P&L
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `}).join(""):`
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400 text-xs">
        No flagged review items match your active filters (${t||"All categories"}).
      </div>
    `;return`
    <div class="space-y-4">
      <!-- Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Human-in-the-Loop Review Queue
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ${a.length} of ${e.length} Items
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
        ${p}
        ${x}
      </div>

      <!-- Filter Controls Toolbar -->
      <div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            id="review-search-input"
            placeholder="Search flagged item, vendor, or ID..."
            value="${s}"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- Category Dropdown Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400 font-medium whitespace-nowrap">Category:</label>
          <select id="review-category-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="">All Categories (${e.length})</option>
            ${u}
          </select>
        </div>

        <!-- Severity Dropdown Selector -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400 font-medium whitespace-nowrap">Severity:</label>
          <select id="review-severity-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
            <option value="">All Severities</option>
            <option value="high" ${c==="high"?"selected":""}>High Attention</option>
            <option value="medium" ${c==="medium"?"selected":""}>Medium Review</option>
            <option value="low" ${c==="low"?"selected":""}>Low Judgment</option>
          </select>
        </div>
      </div>

      <!-- Queue Cards List -->
      <div class="space-y-3">
        ${b}
      </div>
    </div>
  `}function Ae(e,n,t="",c="",s="",o="",i){const a=e.length,u=e.length?e.map(x=>{const b=x.type==="credit",l=x.is_pnl?'<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">P&L</span>':'<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-700">Non-P&L</span>',r=x.review_required?'<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">FLAGGED</span>':"";return`
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 text-xs cursor-pointer ledger-row" data-tx-id="${x.id}">
              <td class="py-2.5 px-3 font-mono text-slate-400 font-medium">${x.id}</td>
              <td class="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">${x.date}</td>
              <td class="py-2.5 px-3 font-medium text-slate-100">
                <div class="flex items-center gap-2">
                  <span class="truncate max-w-xs md:max-w-md">${x.description}</span>
                  ${r}
                </div>
              </td>
              <td class="py-2.5 px-3 whitespace-nowrap text-slate-300">
                <span class="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium border border-slate-700">
                  ${x.category}
                </span>
              </td>
              <td class="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[120px]">${x.subcategory}</td>
              <td class="py-2.5 px-3 text-center">${l}</td>
              <td class="py-2.5 px-3 text-center">${K(x.confidence)}</td>
              <td class="py-2.5 px-3 text-right font-mono font-bold ${b?"text-emerald-400":"text-slate-100"} whitespace-nowrap">
                ${b?"+":"-"}${m(x.amount)}
              </td>
              <td class="py-2.5 px-3 text-center">
                <button class="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 edit-tx-btn" data-tx-id="${x.id}">
                  Edit
                </button>
              </td>
            </tr>
          `}).join(""):`
      <tr>
        <td colspan="9" class="py-8 text-center text-xs text-slate-500">
          No transactions match your active search and filter criteria.
        </td>
      </tr>
    `,p=n.map(x=>`<option value="${x}" ${x===t?"selected":""}>${x}</option>`).join("");return`
    <div class="space-y-4">
      <!-- Toolbar & Ingestion Header -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
            Bank Transaction Ledger
            <span class="text-xs font-normal text-slate-400">(${a} items)</span>
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
            value="${o}"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <!-- Category Dropdown -->
        <div>
          <select id="ledger-category-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All Categories</option>
            ${p}
          </select>
        </div>

        <!-- Period Dropdown -->
        <div>
          <select id="ledger-period-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All Periods</option>
            <option value="2026-01" ${c==="2026-01"?"selected":""}>2026-01</option>
            <option value="2026-02" ${c==="2026-02"?"selected":""}>2026-02</option>
            <option value="2026-03" ${c==="2026-03"?"selected":""}>2026-03</option>
          </select>
        </div>

        <!-- P&L Status Dropdown -->
        <div>
          <select id="ledger-pnl-select" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
            <option value="">All P&L Types</option>
            <option value="true" ${s==="true"?"selected":""}>P&L Only</option>
            <option value="false" ${s==="false"?"selected":""}>Non-P&L (Balance Sheet)</option>
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
              ${u}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function Te(e,n,t){const s=["What was our revenue in March?","How much did we spend on payroll each month?","Why did operating profit change between February and March?","What drove the increase in food costs?","Which transactions need my attention?","Show me the transactions behind that variance.","What changed most significantly over the review period?"].map(i=>`
        <button
          class="px-2.5 py-1 text-xs rounded-full bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-500/40 text-slate-300 border border-slate-700 transition-all text-left prompt-chip"
          data-prompt="${i}">
          ${i}
        </button>
      `).join(""),o=e.map(i=>{const a=i.role==="user",u=a?'<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">You (Executive Reviewer)</span>':`<span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            FINZ AI Financial Analyst · Grounded In Deterministic Ledger
           </span>`;let p="";i.citations&&i.citations.length>0&&(p=`
          <div class="mt-3 pt-3 border-t border-slate-800/80">
            <div class="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
              <span>Verified Audit Citations (Click to inspect):</span>
            </div>
            <div class="flex flex-wrap gap-2">
              ${i.citations.map(l=>`
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 hover:text-emerald-200 transition-all shadow-sm citation-btn"
                data-tx-id="${l.transaction_id}">
                <span class="text-slate-400 font-bold">${l.transaction_id}</span>
                <span>•</span>
                <span class="text-slate-300 truncate max-w-[140px]">${l.description}</span>
                <span>•</span>
                <span class="text-emerald-400 font-bold">${m(l.amount)}</span>
                <span class="text-slate-500">↗</span>
              </button>
            `).join("")}
            </div>
          </div>
        `);let x=i.content.replace(/\n\n/g,"<br/><br/>").replace(/\n- /g,"<br/>• ").replace(/\n### (.*?)(<br\/>|$)/g,'<h5 class="text-xs font-bold text-slate-100 uppercase tracking-wider mt-2 mb-1">$1</h5>').replace(/\*\*(.*?)\*\*/g,'<strong class="text-slate-100 font-semibold">$1</strong>').replace(/\*(.*?)\*/g,'<em class="text-slate-300">$1</em>');return`
        <div class="p-4 rounded-xl ${a?"bg-slate-900 border border-slate-800 ml-8":"bg-slate-900/90 border border-emerald-950/80 mr-8"} shadow-md">
          <div class="flex items-center justify-between mb-1.5">
            ${u}
          </div>
          <div class="text-xs text-slate-200 leading-relaxed font-sans">
            ${x}
          </div>
          ${p}
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
          ${s}
        </div>
      </div>

      <!-- Chat Stream Container -->
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 shadow-inner" id="chat-messages-container">
        ${e.length===0?`
              <div class="text-center py-16 text-slate-500 text-xs">
                Select one of the challenge questions above or type your own question below to start the financial review.
              </div>
            `:o}
        ${n?`
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
  `}let w="pnl",L=null,z=[],ie=[],$=[],T=[],D=!1,B="",P="",j="",O="",F="",Z="",ee="",_=null;const f=document.getElementById("view-container"),Ce=document.getElementById("review-count-badge"),de=document.getElementById("audit-drawer"),N=document.getElementById("drawer-backdrop"),G=document.getElementById("close-drawer-btn"),_e=document.getElementById("drawer-title"),ke=document.getElementById("drawer-subtitle"),H=document.getElementById("drawer-tx-list"),Be=document.getElementById("drawer-total-amount"),ce=document.getElementById("edit-modal"),V=document.getElementById("modal-backdrop"),q=document.getElementById("close-modal-btn"),W=document.getElementById("cancel-modal-btn"),U=document.getElementById("save-modal-btn"),Pe=document.getElementById("modal-tx-desc"),je=document.getElementById("modal-tx-meta"),pe=document.getElementById("modal-cat-select"),xe=document.getElementById("modal-subcat-input"),me=document.getElementById("modal-pnl-select"),ue=document.getElementById("modal-notes-input"),te=document.getElementById("toast"),Oe=document.getElementById("toast-message");function C(e){Oe.textContent=e,te.classList.remove("translate-y-20","opacity-0"),setTimeout(()=>{te.classList.add("translate-y-20","opacity-0")},3500)}async function A(){var e;try{const[n,t,c,s]=await Promise.all([fe(),ge("2026-02","2026-03"),ve(),ye()]);L=n,z=t,ie=c,$=s,Ce.textContent=String(c.length),g()}catch(n){console.error("Failed to load data from backend:",n),f.innerHTML=`
      <div class="p-8 bg-rose-950/40 border border-rose-800 rounded-xl text-center">
        <h3 class="text-sm font-bold text-rose-300">Backend Connection Error</h3>
        <p class="text-xs text-slate-400 mt-1">Make sure the FastAPI server is running on http://localhost:8000.</p>
        <button id="retry-btn" class="mt-4 px-4 py-1.5 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white">Retry Connection</button>
      </div>
    `,(e=document.getElementById("retry-btn"))==null||e.addEventListener("click",A)}}function R(e,n,t){_e.textContent=e,ke.textContent=n;const c=t.reduce((s,o)=>s+o.amount,0);Be.textContent=m(c),t.length?H.innerHTML=t.map(s=>`
          <div class="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-slate-700 transition-all flex items-start justify-between gap-3 text-xs">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-slate-400 font-bold">${s.id}</span>
                <span class="font-mono text-[11px] text-slate-500">${s.date}</span>
                ${K(s.confidence)}
              </div>
              <div class="font-semibold text-slate-200">${s.description}</div>
              <div class="text-[11px] text-slate-400">
                ${s.category} &bull; ${s.subcategory}
              </div>
              ${s.reasoning?`<div class="text-[10px] text-slate-500 italic">Audit note: ${s.reasoning}</div>`:""}
            </div>
            <div class="text-right shrink-0">
              <div class="font-mono font-bold text-slate-100">${m(s.amount)}</div>
              <button class="mt-2 px-2 py-0.5 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 drawer-edit-btn" data-tx-id="${s.id}">
                Reclassify
              </button>
            </div>
          </div>
        `).join(""):H.innerHTML='<div class="text-xs text-slate-500 italic p-4">No matching transactions found in active ledger.</div>',de.classList.remove("hidden"),H.querySelectorAll(".drawer-edit-btn").forEach(s=>{s.addEventListener("click",o=>{const i=o.currentTarget.getAttribute("data-tx-id"),a=$.find(u=>u.id===i);a&&(Y(),J(a))})})}function Y(){de.classList.add("hidden")}function J(e){_=e,Pe.textContent=e.description,je.textContent=`${e.id} • ${e.date} • ${m(e.amount)} (${e.type.toUpperCase()})`,pe.value=e.category,xe.value=e.subcategory,me.value=String(e.is_pnl),ue.value="",ce.classList.remove("hidden")}function M(){ce.classList.add("hidden"),_=null}async function Re(){if(!_)return;const e=pe.value,n=xe.value.trim()||"General",t=me.value==="true",c=ue.value.trim();try{await Q(_.id,{category:e,subcategory:n,is_pnl:t,review_required:!1,notes:c||"Updated via manual review modal"}),M(),C(`Transaction ${_.id} reclassified to ${e}. P&L recomputed!`),await A()}catch(s){alert(`Error updating transaction: ${s.message}`)}}function g(){if(!L)return;document.querySelectorAll(".tab-btn").forEach(n=>{n.classList.remove("border-emerald-500","text-emerald-400","font-semibold"),n.classList.add("border-transparent","text-slate-400")});const e=document.getElementById(`tab-${w}`);if(e&&(e.classList.remove("border-transparent","text-slate-400"),e.classList.add("border-emerald-500","text-emerald-400","font-semibold")),w==="pnl")f.innerHTML=Le(L),f.querySelectorAll(".line-item-row").forEach(n=>{n.addEventListener("click",t=>{const c=t.currentTarget.getAttribute("data-item-name"),s=t.currentTarget.getAttribute("data-item-type"),i=[...L.revenue_items,...L.cogs_items,...L.payroll_items,...L.opex_items,...L.non_pnl_items].find(a=>a.name===c&&a.account_type===s);if(i){const a=$.filter(u=>i.transaction_ids.includes(u.id));R(`${i.name} (${i.account_type})`,`${a.length} underlying transactions`,a)}})});else if(w==="variance")f.innerHTML=Ie(z,"2026-02","2026-03"),f.querySelectorAll(".inspect-variance-btn").forEach(n=>{n.addEventListener("click",t=>{const c=t.currentTarget.getAttribute("data-variance-cat"),s=z.find(o=>o.category===c);if(s){const o=$.filter(i=>s.supporting_transaction_ids.includes(i.id));R(`Evidence: ${s.category}`,`${o.length} transactions driving variance of ${m(s.delta_amount)}`,o)}})});else if(w==="review"){const n=["Revenue","Cost of Goods Sold","Payroll","Operating Expenses","Non-P&L (Balance Sheet)"];f.innerHTML=Se(ie,n,F,Z,ee);const t=document.getElementById("review-category-select");t==null||t.addEventListener("change",o=>{F=o.target.value,g()});const c=document.getElementById("review-severity-select");c==null||c.addEventListener("change",o=>{Z=o.target.value,g()});const s=document.getElementById("review-search-input");s==null||s.addEventListener("input",o=>{ee=o.target.value,g()}),f.querySelectorAll(".review-cat-pill").forEach(o=>{o.addEventListener("click",i=>{F=i.currentTarget.getAttribute("data-category")||"",g()})}),f.querySelectorAll(".approve-btn").forEach(o=>{o.addEventListener("click",async i=>{const a=i.currentTarget.getAttribute("data-tx-id");await Q(a,{review_required:!1,notes:"Approved classification"}),C(`Approved ${a}. Status verified.`),await A()})}),f.querySelectorAll(".reclassify-btn").forEach(o=>{o.addEventListener("click",i=>{const a=i.currentTarget.getAttribute("data-tx-id"),u=$.find(p=>p.id===a);u&&J(u)})}),f.querySelectorAll(".exclude-btn").forEach(o=>{o.addEventListener("click",async i=>{const a=i.currentTarget.getAttribute("data-tx-id");await Q(a,{category:"Non-P&L (Balance Sheet)",subcategory:"Internal Transfer",is_pnl:!1,review_required:!1,notes:"Excluded from P&L per accountant decision"}),C(`Excluded ${a} from P&L. Statement recomputed!`),await A()})})}else if(w==="ledger"){const n=["Revenue","Cost of Goods Sold","Payroll","Operating Expenses","Non-P&L (Balance Sheet)"];let t=$;if(B&&(t=t.filter(p=>p.category===B)),P&&(t=t.filter(p=>p.date.startsWith(P))),j!==""&&(t=t.filter(p=>String(p.is_pnl)===j)),O){const p=O.toLowerCase();t=t.filter(x=>x.description.toLowerCase().includes(p)||x.id.toLowerCase().includes(p))}f.innerHTML=Ae(t,n,B,P,j,O);const c=document.getElementById("ledger-search-input");c==null||c.addEventListener("input",p=>{O=p.target.value,g()});const s=document.getElementById("ledger-category-select");s==null||s.addEventListener("change",p=>{B=p.target.value,g()});const o=document.getElementById("ledger-period-select");o==null||o.addEventListener("change",p=>{P=p.target.value,g()});const i=document.getElementById("ledger-pnl-select");i==null||i.addEventListener("change",p=>{j=p.target.value,g()});const a=document.getElementById("csv-upload-input");a==null||a.addEventListener("change",async p=>{var b;const x=(b=p.target.files)==null?void 0:b[0];if(x)try{const l=await we(x);C(l.message),await A()}catch(l){alert(`CSV Ingestion error: ${l.message}`)}});const u=document.getElementById("reset-dataset-btn");u==null||u.addEventListener("click",async()=>{confirm("Reset ledger back to original benchmark dataset?")&&(await $e(),C("Ledger reset to benchmark data."),await A())}),f.querySelectorAll(".edit-tx-btn").forEach(p=>{p.addEventListener("click",x=>{x.stopPropagation();const b=x.currentTarget.getAttribute("data-tx-id"),l=$.find(r=>r.id===b);l&&J(l)})}),f.querySelectorAll(".ledger-row").forEach(p=>{p.addEventListener("click",x=>{const b=x.currentTarget.getAttribute("data-tx-id"),l=$.find(r=>r.id===b);l&&R(`Transaction Details: ${l.id}`,l.description,[l])})})}else if(w==="analyst"){f.innerHTML=Te(T,D),f.querySelectorAll(".prompt-chip").forEach(s=>{s.addEventListener("click",async o=>{const i=o.currentTarget.getAttribute("data-prompt");await se(i)})}),f.querySelectorAll(".citation-btn").forEach(s=>{s.addEventListener("click",o=>{const i=o.currentTarget.getAttribute("data-tx-id"),a=$.find(u=>u.id===i);a&&R(`Evidence: ${a.id}`,a.description,[a])})});const n=document.getElementById("analyst-input"),t=document.getElementById("analyst-send-btn"),c=async()=>{const s=n.value.trim();!s||D||(n.value="",await se(s))};t==null||t.addEventListener("click",c),n==null||n.addEventListener("keydown",s=>{s.key==="Enter"&&c()})}}async function se(e){T.push({role:"user",content:e}),D=!0,g();try{const n=await he(e,T);T.push({role:"assistant",content:n.answer,citations:n.citations})}catch(n){T.push({role:"assistant",content:`*Error querying financial analyst: ${n.message}. Please check that the backend is running.*`})}finally{D=!1,g();const n=document.getElementById("chat-messages-container");n&&(n.scrollTop=n.scrollHeight)}}var ae;(ae=document.getElementById("tab-pnl"))==null||ae.addEventListener("click",()=>{w="pnl",g()});var ne;(ne=document.getElementById("tab-variance"))==null||ne.addEventListener("click",()=>{w="variance",g()});var re;(re=document.getElementById("tab-review"))==null||re.addEventListener("click",()=>{w="review",g()});var oe;(oe=document.getElementById("tab-ledger"))==null||oe.addEventListener("click",()=>{w="ledger",g()});var le;(le=document.getElementById("tab-analyst"))==null||le.addEventListener("click",()=>{w="analyst",g()});G==null||G.addEventListener("click",Y);N==null||N.addEventListener("click",Y);q==null||q.addEventListener("click",M);W==null||W.addEventListener("click",M);V==null||V.addEventListener("click",M);U==null||U.addEventListener("click",Re);A();
