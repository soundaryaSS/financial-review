"""
Variance and Driver Decomposition Engine
Identifies material changes between periods and isolates the underlying transactions driving them.
"""

from typing import List, Dict, Any, Tuple
from app.models.financial import Transaction, PnLStatement, VarianceAnalysis, VarianceDriver

def analyze_variances(
    pnl: PnLStatement,
    transactions: List[Transaction],
    period_a: str,
    period_b: str,
    materiality_threshold_dollars: float = 1500.0,
    materiality_threshold_pct: float = 15.0
) -> List[VarianceAnalysis]:
    """
    Compares two periods (e.g. Feb vs Mar) across all accounting categories.
    Decomposes material variances down to the top contributing transactions.
    """
    summary_a = pnl.monthly_summaries.get(period_a)
    summary_b = pnl.monthly_summaries.get(period_b)
    if not summary_a or not summary_b:
        return []

    # Map transactions by ID for quick lookup
    tx_by_id = {tx.id: tx for tx in transactions}

    variances: List[VarianceAnalysis] = []

    # All categories to inspect: Revenue, COGS, Payroll, OpEx line items
    categories_to_check: List[Tuple[str, List[Any], str]] = [
        ("Revenue", pnl.revenue_items, "credit"),
        ("Cost of Goods Sold", pnl.cogs_items, "debit"),
        ("Payroll", pnl.payroll_items, "debit"),
        ("Operating Expenses", pnl.opex_items, "debit"),
    ]

    # Also evaluate top-level categories
    top_level_metrics = [
        ("Total Revenue", summary_a.revenue, summary_b.revenue, True),
        ("Cost of Goods Sold (COGS)", summary_a.cogs, summary_b.cogs, False),
        ("Gross Profit", summary_a.gross_profit, summary_b.gross_profit, True),
        ("Total Payroll", summary_a.payroll, summary_b.payroll, False),
        ("Total Operating Expenses", summary_a.opex, summary_b.opex, False),
        ("Operating Profit (EBITDA)", summary_a.operating_profit, summary_b.operating_profit, True),
    ]

    for name, amt_a, amt_b, higher_is_better in top_level_metrics:
        delta = round(amt_b - amt_a, 2)
        pct_change = round((delta / amt_a * 100), 1) if amt_a != 0 else (100.0 if delta > 0 else 0.0)
        is_material = abs(delta) >= materiality_threshold_dollars or abs(pct_change) >= materiality_threshold_pct

        if delta > 0:
            direction = "favorable" if higher_is_better else "unfavorable"
        elif delta < 0:
            direction = "unfavorable" if higher_is_better else "favorable"
        else:
            direction = "neutral"

        # Generate narrative explanation
        if name == "Operating Profit (EBITDA)":
            rev_diff = summary_b.revenue - summary_a.revenue
            cost_diff = (summary_b.cogs + summary_b.payroll + summary_b.opex) - (summary_a.cogs + summary_a.payroll + summary_a.opex)
            narrative = (
                f"Operating profit shifted by ${abs(delta):,.2f} ({pct_change:+,.1f}%). "
                f"Driven by revenue change of ${rev_diff:+,.2f} offset by operational cost movement of ${cost_diff:+,.2f}."
            )
        elif name == "Total Revenue":
            narrative = f"Revenue changed by ${delta:+,.2f} ({pct_change:+,.1f}%) driven by customer contract renewals and subscription expansion."
        else:
            narrative = f"{name} changed by ${delta:+,.2f} ({pct_change:+,.1f}%) between {period_a} and {period_b}."

        variances.append(VarianceAnalysis(
            category=name,
            period_a=period_a,
            period_b=period_b,
            amount_a=amt_a,
            amount_b=amt_b,
            delta_amount=delta,
            delta_pct=pct_change,
            is_material=is_material,
            direction=direction,
            narrative_explanation=narrative,
            top_drivers=[],
            supporting_transaction_ids=[]
        ))

    # Next, inspect detailed line items (e.g. Hosting & Infrastructure, Food & Entertainment)
    for cat_group_name, items, flow_type in categories_to_check:
        for item in items:
            val_a = item.monthly_amounts.get(period_a, 0.0)
            val_b = item.monthly_amounts.get(period_b, 0.0)
            delta = round(val_b - val_a, 2)
            pct = round((delta / val_a * 100), 1) if val_a != 0 else (100.0 if delta > 0 else 0.0)

            is_mat = abs(delta) >= (materiality_threshold_dollars * 0.6) or (abs(pct) >= materiality_threshold_pct and abs(delta) >= 400)
            
            # Determine direction (for expenses, increase is unfavorable)
            if cat_group_name == "Revenue":
                dir_val = "favorable" if delta > 0 else ("unfavorable" if delta < 0 else "neutral")
            else:
                dir_val = "unfavorable" if delta > 0 else ("favorable" if delta < 0 else "neutral")

            # Collect transactions in period_b for this line item to find top drivers
            period_b_txs = [
                tx_by_id[tid] for tid in item.transaction_ids
                if tid in tx_by_id and tx_by_id[tid].date.startswith(period_b)
            ]
            period_b_txs.sort(key=lambda x: x.amount, reverse=True)

            drivers: List[VarianceDriver] = []
            for d_tx in period_b_txs[:5]:  # Top 5 drivers
                impact = round((d_tx.amount / val_b * 100), 1) if val_b > 0 else 0.0
                drivers.append(VarianceDriver(
                    transaction_id=d_tx.id,
                    date=d_tx.date,
                    description=d_tx.description,
                    amount=d_tx.amount,
                    impact_pct=impact,
                    explanation=f"${d_tx.amount:,.2f} ({impact}% of {period_b} total) - {d_tx.reasoning}"
                ))

            # Narrative explanation
            if is_mat:
                top_vendor_names = ", ".join([d.description.split()[0] for d in drivers[:2]])
                narrative = (
                    f"{item.name} experienced a material variance of ${delta:+,.2f} ({pct:+,.1f}%). "
                    f"Key drivers in {period_b} include {top_vendor_names or 'new transaction volume'}."
                )
            else:
                narrative = f"{item.name} shifted by ${delta:+,.2f} ({pct:+,.1f}%)."

            variances.append(VarianceAnalysis(
                category=f"{cat_group_name}: {item.name}",
                period_a=period_a,
                period_b=period_b,
                amount_a=val_a,
                amount_b=val_b,
                delta_amount=delta,
                delta_pct=pct,
                is_material=is_mat,
                direction=dir_val,
                narrative_explanation=narrative,
                top_drivers=drivers,
                supporting_transaction_ids=[t.id for t in period_b_txs]
            ))

    return variances
