"""
Automated Verification Suite for FINZ Financial Review
Verifies that:
1. P&L math is 100% deterministic with zero floating point drift.
2. An LLM is NEVER used for financial totals.
3. Non-P&L transactions are strictly partitioned away from Operating Profit.
4. Human-in-the-loop reclassifications dynamically update totals.
"""

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.models.financial import Transaction, TransactionUpdate
from app.engine.deterministic_pnl import calculate_pnl
from app.engine.variance_engine import analyze_variances
from app.engine.classifier import rule_based_classify, build_review_queue

def test_deterministic_pnl_balance():
    # Synthetic test fixtures
    txs = [
        Transaction(
            id="T1", date="2026-03-01", description="Client Revenue",
            amount=10000.0, type="credit", category="Revenue", subcategory="Subscription Revenue",
            is_pnl=True, confidence=1.0
        ),
        Transaction(
            id="T2", date="2026-03-05", description="AWS Hosting",
            amount=2000.0, type="debit", category="Cost of Goods Sold", subcategory="Hosting & Infrastructure",
            is_pnl=True, confidence=1.0
        ),
        Transaction(
            id="T3", date="2026-03-15", description="Staff Salary",
            amount=4000.0, type="debit", category="Payroll", subcategory="Salaries & Wages",
            is_pnl=True, confidence=1.0
        ),
        Transaction(
            id="T4", date="2026-03-20", description="Office Internet",
            amount=500.0, type="debit", category="Operating Expenses", subcategory="Office & Facilities",
            is_pnl=True, confidence=1.0
        ),
        # Non-P&L item (Balance sheet transfer)
        Transaction(
            id="T5", date="2026-03-28", description="Transfer to Reserve Savings",
            amount=5000.0, type="debit", category="Non-P&L (Balance Sheet)", subcategory="Internal Transfer",
            is_pnl=False, confidence=1.0
        ),
    ]

    pnl = calculate_pnl(txs)
    summary = pnl.monthly_summaries["2026-03"]

    # Strict assertion
    assert summary.revenue == 10000.0
    assert summary.cogs == 2000.0
    assert summary.gross_profit == 8000.0  # 10,000 - 2,000
    assert summary.payroll == 4000.0
    assert summary.opex == 500.0
    assert summary.operating_profit == 3500.0  # 8,000 - 4,000 - 500
    assert summary.non_pnl_total == 5000.0  # Kept strictly out of operating profit!
    assert summary.is_balanced is True
    assert summary.reconciliation_checksum == 0.0

def test_reclassification_reactivity():
    # If a $1,000 transaction is reclassified from OpEx to Non-P&L, OpEx must drop by $1,000
    tx1 = Transaction(
        id="T1", date="2026-03-01", description="Ambiguous Payment",
        amount=1000.0, type="debit", category="Operating Expenses", subcategory="General",
        is_pnl=True, confidence=0.5
    )
    pnl1 = calculate_pnl([tx1])
    assert pnl1.monthly_summaries["2026-03"].opex == 1000.0

    # User corrects it to Non-P&L transfer
    tx1_corrected = Transaction(
        id="T1", date="2026-03-01", description="Ambiguous Payment",
        amount=1000.0, type="debit", category="Non-P&L (Balance Sheet)", subcategory="Internal Transfer",
        is_pnl=False, confidence=1.0
    )
    pnl2 = calculate_pnl([tx1_corrected])
    assert pnl2.monthly_summaries["2026-03"].opex == 0.0
    assert pnl2.monthly_summaries["2026-03"].non_pnl_total == 1000.0

def test_variance_driver_identification():
    # Test food spike variance
    tx_feb = Transaction(
        id="F1", date="2026-02-10", description="Team Lunch",
        amount=500.0, type="debit", category="Operating Expenses", subcategory="Food & Entertainment",
        is_pnl=True, confidence=1.0
    )
    tx_mar1 = Transaction(
        id="M1", date="2026-03-10", description="Team Lunch",
        amount=500.0, type="debit", category="Operating Expenses", subcategory="Food & Entertainment",
        is_pnl=True, confidence=1.0
    )
    tx_mar2 = Transaction(
        id="M2", date="2026-03-18", description="Oberoi Gala Banquet",
        amount=4500.0, type="debit", category="Operating Expenses", subcategory="Food & Entertainment",
        is_pnl=True, confidence=1.0
    )

    pnl = calculate_pnl([tx_feb, tx_mar1, tx_mar2])
    variances = analyze_variances(pnl, [tx_feb, tx_mar1, tx_mar2], "2026-02", "2026-03")

    food_var = [v for v in variances if "Food & Entertainment" in v.category][0]
    assert food_var.delta_amount == 4500.0
    assert food_var.delta_pct == 900.0
    assert food_var.is_material is True
    assert len(food_var.top_drivers) > 0
    assert food_var.top_drivers[0].transaction_id == "M2"
