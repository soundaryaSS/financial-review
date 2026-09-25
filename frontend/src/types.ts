/**
 * TypeScript Data Models matching the FastAPI Backend
 */

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  account: string;
  category: string;
  subcategory: string;
  is_pnl: boolean;
  confidence: number;
  reasoning: string;
  review_required: boolean;
  review_reason: string;
}

export interface TransactionUpdate {
  category?: string;
  subcategory?: string;
  is_pnl?: boolean;
  review_required?: boolean;
  notes?: string;
}

export interface PnLLineItem {
  name: string;
  account_type: string;
  monthly_amounts: Record<string, number>;
  total_amount: number;
  transaction_count: number;
  transaction_ids: string[];
}

export interface MonthlySummary {
  period: string;
  revenue: number;
  cogs: number;
  gross_profit: number;
  gross_margin_pct: number;
  payroll: number;
  opex: number;
  operating_profit: number;
  operating_margin_pct: number;
  non_pnl_total: number;
  reconciliation_checksum: number;
  is_balanced: boolean;
}

export interface PnLStatement {
  periods: string[];
  monthly_summaries: Record<string, MonthlySummary>;
  revenue_items: PnLLineItem[];
  cogs_items: PnLLineItem[];
  payroll_items: PnLLineItem[];
  opex_items: PnLLineItem[];
  non_pnl_items: PnLLineItem[];
  totals: {
    revenue: number;
    cogs: number;
    gross_profit: number;
    payroll: number;
    opex: number;
    operating_profit: number;
  };
  generated_at: string;
  calculation_engine: string;
}

export interface VarianceDriver {
  transaction_id: string;
  date: string;
  description: string;
  amount: number;
  impact_pct: number;
  explanation: string;
}

export interface VarianceAnalysis {
  category: string;
  period_a: string;
  period_b: string;
  amount_a: number;
  amount_b: number;
  delta_amount: number;
  delta_pct: number;
  is_material: boolean;
  direction: 'favorable' | 'unfavorable' | 'neutral';
  narrative_explanation: string;
  top_drivers: VarianceDriver[];
  supporting_transaction_ids: string[];
}

export interface ReviewItem {
  transaction: Transaction;
  severity: 'low' | 'medium' | 'high';
  flag_type: 'low_confidence' | 'anomaly_amount' | 'personal_vs_business' | 'unclear_memo' | 'capital_vs_opex';
  suggested_action: string;
  suggested_categories: string[];
}

export interface ChatCitation {
  transaction_id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: ChatCitation[];
}

export interface ChatResponse {
  answer: string;
  citations: ChatCitation[];
  suggested_followups: string[];
  queried_tools: string[];
}
