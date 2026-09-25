"""
Deterministic P&L Calculation Engine
Calculates monthly P&L statements strictly using deterministic math.
GUARANTEES: An LLM never calculates financial totals. Every sum is verifiable against underlying transactions.
"""

from typing import List, Dict, Any
from datetime import datetime
from collections import defaultdict
from app.models.financial import Transaction, PnLStatement, PnLLineItem, MonthlySummary

def calculate_pnl(transactions: List[Transaction]) -> PnLStatement:
    """
    Computes a multi-period P&L statement from a list of transactions.
    """
    if not transactions:
        return PnLStatement(
            periods=[],
            revenue_items=[],
            cogs_items=[],
            payroll_items=[],
            opex_items=[],
            non_pnl_items=[],
            monthly_summaries={},
            totals={
                "revenue": 0.0,
                "cogs": 0.0,
                "gross_profit": 0.0,
                "payroll": 0.0,
                "opex": 0.0,
                "operating_profit": 0.0
            },
            generated_at=datetime.now().isoformat(),
            calculation_engine="Deterministic-Decimal-Ledger (v1.0)"
        )

    # 1. Identify distinct periods (sorted YYYY-MM)
    periods_set = set()
    for tx in transactions:
        period = tx.date[:7]
        periods_set.add(period)
    periods = sorted(list(periods_set))
    if not periods:
        periods = []

    # 2. Aggregation accumulators
    # category -> subcategory -> period -> sum
    line_item_amounts = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
    line_item_tx_ids = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))

    # Monthly high-level buckets
    monthly_revenue = defaultdict(float)
    monthly_cogs = defaultdict(float)
    monthly_payroll = defaultdict(float)
    monthly_opex = defaultdict(float)
    monthly_non_pnl = defaultdict(float)

    for tx in transactions:
        period = tx.date[:7]
        cat = tx.category
        subcat = tx.subcategory or "General"
        amt = round(float(tx.amount), 2)

        line_item_amounts[cat][subcat][period] += amt
        line_item_tx_ids[cat][subcat][period].append(tx.id)

        if not tx.is_pnl or cat == "Non-P&L (Balance Sheet)":
            monthly_non_pnl[period] += amt
        elif cat == "Revenue":
            monthly_revenue[period] += amt
        elif cat == "Cost of Goods Sold":
            monthly_cogs[period] += amt
        elif cat == "Payroll":
            monthly_payroll[period] += amt
        elif cat == "Operating Expenses":
            monthly_opex[period] += amt

    # 3. Build Line Items per Category
    def build_line_items_for_cat(cat_name: str) -> List[PnLLineItem]:
        items: List[PnLLineItem] = []
        subcats = sorted(line_item_amounts[cat_name].keys())
        for subcat in subcats:
            m_amounts = {}
            total = 0.0
            all_ids = []
            for p in periods:
                p_amt = round(line_item_amounts[cat_name][subcat].get(p, 0.0), 2)
                m_amounts[p] = p_amt
                total += p_amt
                all_ids.extend(line_item_tx_ids[cat_name][subcat].get(p, []))
            
            items.append(PnLLineItem(
                name=subcat,
                account_type=cat_name,
                monthly_amounts=m_amounts,
                total_amount=round(total, 2),
                transaction_count=len(all_ids),
                transaction_ids=all_ids
            ))
        return items

    rev_items = build_line_items_for_cat("Revenue")
    cogs_items = build_line_items_for_cat("Cost of Goods Sold")
    payroll_items = build_line_items_for_cat("Payroll")
    opex_items = build_line_items_for_cat("Operating Expenses")
    non_pnl_items = build_line_items_for_cat("Non-P&L (Balance Sheet)")

    # 4. Compute Monthly Summaries
    monthly_summaries: Dict[str, MonthlySummary] = {}
    tot_rev = 0.0
    tot_cogs = 0.0
    tot_gp = 0.0
    tot_payroll = 0.0
    tot_opex = 0.0
    tot_op = 0.0

    for p in periods:
        rev = round(monthly_revenue[p], 2)
        cogs = round(monthly_cogs[p], 2)
        gp = round(rev - cogs, 2)
        gp_margin = round((gp / rev * 100), 1) if rev > 0 else 0.0
        
        pay = round(monthly_payroll[p], 2)
        opx = round(monthly_opex[p], 2)
        op = round(gp - pay - opx, 2)
        op_margin = round((op / rev * 100), 1) if rev > 0 else 0.0
        non_pnl = round(monthly_non_pnl[p], 2)

        # Audit checksum: verify that line items sum exactly to monthly aggregates
        calc_rev = sum(item.monthly_amounts.get(p, 0.0) for item in rev_items)
        calc_cogs = sum(item.monthly_amounts.get(p, 0.0) for item in cogs_items)
        calc_pay = sum(item.monthly_amounts.get(p, 0.0) for item in payroll_items)
        calc_opx = sum(item.monthly_amounts.get(p, 0.0) for item in opex_items)

        checksum_error = abs(rev - calc_rev) + abs(cogs - calc_cogs) + abs(pay - calc_pay) + abs(opx - calc_opx)
        is_balanced = checksum_error < 0.01

        monthly_summaries[p] = MonthlySummary(
            period=p,
            revenue=rev,
            cogs=cogs,
            gross_profit=gp,
            gross_margin_pct=gp_margin,
            payroll=pay,
            opex=opx,
            operating_profit=op,
            operating_margin_pct=op_margin,
            non_pnl_total=non_pnl,
            reconciliation_checksum=round(checksum_error, 4),
            is_balanced=is_balanced
        )

        tot_rev += rev
        tot_cogs += cogs
        tot_gp += gp
        tot_payroll += pay
        tot_opex += opx
        tot_op += op

    totals = {
        "revenue": round(tot_rev, 2),
        "cogs": round(tot_cogs, 2),
        "gross_profit": round(tot_gp, 2),
        "payroll": round(tot_payroll, 2),
        "opex": round(tot_opex, 2),
        "operating_profit": round(tot_op, 2),
    }

    return PnLStatement(
        periods=periods,
        monthly_summaries=monthly_summaries,
        revenue_items=rev_items,
        cogs_items=cogs_items,
        payroll_items=payroll_items,
        opex_items=opex_items,
        non_pnl_items=non_pnl_items,
        totals=totals,
        generated_at=datetime.now().isoformat(),
        calculation_engine="Deterministic-Decimal-Ledger (v1.0)"
    )
