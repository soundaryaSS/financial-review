/**
 * Formatting and DOM Utility Helpers
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercent(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

export function truncateText(text: string, maxLen = 38): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

export function getConfidenceBadge(confidence: number): string {
  const pct = Math.round(confidence * 100);
  if (confidence >= 0.9) {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${pct}% Confident</span>`;
  } else if (confidence >= 0.7) {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">${pct}% Uncertain</span>`;
  } else {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">${pct}% Review Req.</span>`;
  }
}

export function getSeverityBadge(severity: 'low' | 'medium' | 'high'): string {
  if (severity === 'high') {
    return `<span class="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">HIGH ATTENTION</span>`;
  } else if (severity === 'medium') {
    return `<span class="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">MEDIUM REVIEW</span>`;
  } else {
    return `<span class="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">LOW JUDGMENT</span>`;
  }
}
