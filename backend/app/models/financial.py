"""
Financial Data Models (Pydantic)
Structured representation of bank transactions, P&L statements, variances, and review items.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class Transaction(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    type: Literal["credit", "debit"]
    account: str = "Chase Business Checking (*4182)"
    category: str
    subcategory: str
    is_pnl: bool
    confidence: float = 1.0
    reasoning: str = ""
    review_required: bool = False
    review_reason: str = ""

class TransactionUpdate(BaseModel):
    category: Optional[str] = None
    subcategory: Optional[str] = None
    is_pnl: Optional[bool] = None
    review_required: Optional[bool] = None
    notes: Optional[str] = None

class PnLLineItem(BaseModel):
    name: str
    account_type: str  # 'Revenue', 'COGS', 'Payroll', 'OpEx'
    monthly_amounts: Dict[str, float]  # e.g. {"2026-01": 50000.0, ...}
    total_amount: float
    transaction_count: int
    transaction_ids: List[str] = Field(default_factory=list)

class MonthlySummary(BaseModel):
    period: str  # "2026-01"
    revenue: float
    cogs: float
    gross_profit: float
    gross_margin_pct: float
    payroll: float
    opex: float
    operating_profit: float  # EBITDA
    operating_margin_pct: float
    non_pnl_total: float
    reconciliation_checksum: float
    is_balanced: bool

class PnLStatement(BaseModel):
    periods: List[str]
    monthly_summaries: Dict[str, MonthlySummary]
    revenue_items: List[PnLLineItem]
    cogs_items: List[PnLLineItem]
    payroll_items: List[PnLLineItem]
    opex_items: List[PnLLineItem]
    non_pnl_items: List[PnLLineItem]
    totals: Dict[str, float]
    generated_at: str
    calculation_engine: str = "Deterministic-Decimal-Ledger (v1.0)"

class VarianceDriver(BaseModel):
    transaction_id: str
    date: str
    description: str
    amount: float
    impact_pct: float
    explanation: str

class VarianceAnalysis(BaseModel):
    category: str
    period_a: str
    period_b: str
    amount_a: float
    amount_b: float
    delta_amount: float
    delta_pct: float
    is_material: bool
    direction: Literal["favorable", "unfavorable", "neutral"]
    narrative_explanation: str
    top_drivers: List[VarianceDriver]
    supporting_transaction_ids: List[str]

class ReviewItem(BaseModel):
    transaction: Transaction
    severity: Literal["low", "medium", "high"]
    flag_type: Literal["low_confidence", "anomaly_amount", "personal_vs_business", "unclear_memo", "capital_vs_opex"]
    suggested_action: str
    suggested_categories: List[str]

class ChatCitation(BaseModel):
    transaction_id: str
    date: str
    description: str
    amount: float
    category: str

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    citations: Optional[List[ChatCitation]] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list)
    active_filters: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[ChatCitation] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)
    queried_tools: List[str] = Field(default_factory=list)
