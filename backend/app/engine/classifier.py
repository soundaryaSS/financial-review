"""
Hybrid Classification & Uncertainty Detection Engine
Combines deterministic accounting rules with Google Gemini AI semantic categorization.
Flags uncertain, anomalous, or judgment-dependent transactions for human review.
"""

import os
import json
import re
from typing import Dict, Any, List, Optional
import httpx
from app.models.financial import Transaction, ReviewItem
from app.engine.chart_of_accounts import VENDOR_RULES, ACCOUNT_TYPES

def rule_based_classify(description: str, amount: float, tx_type: str) -> Optional[Dict[str, Any]]:
    """
    Evaluates fast deterministic vendor regex and substring rules.
    """
    desc_upper = description.upper()
    for rule in VENDOR_RULES:
        if rule["pattern"] in desc_upper:
            # Check if this rule requires special review
            review_req = False
            review_reason = ""
            conf = rule["confidence"]

            # Anomaly rule: very large one-off retail or ambiguous expenses
            if ("AMZN" in desc_upper or "RETAIL" in desc_upper) and amount > 500:
                conf = 0.65
                review_req = True
                review_reason = f"High amount (${amount:,.2f}) at retail merchant. Check whether this is fixed equipment or supplies."
            elif ("VENMO" in desc_upper or "PAYPAL" in desc_upper) and amount > 1000:
                conf = 0.60
                review_req = True
                review_reason = f"Large peer-to-peer transfer (${amount:,.2f}). Requires invoice verification."

            return {
                "category": rule["category"],
                "subcategory": rule["subcategory"],
                "is_pnl": rule["is_pnl"],
                "confidence": conf,
                "reasoning": f"Matched vendor rule [{rule['pattern']}]",
                "review_required": review_req,
                "review_reason": review_reason
            }
    return None

async def gemini_classify_transaction(description: str, amount: float, tx_type: str) -> Dict[str, Any]:
    """
    Uses Google Gemini API to semantically classify ambiguous transactions.
    Falls back gracefully to smart heuristic if API key is not present or offline.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    # Rule-first lookup
    rule_match = rule_based_classify(description, amount, tx_type)
    if rule_match and rule_match["confidence"] >= 0.85:
        return rule_match

    # If Gemini API key is available, call Gemini
    if api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            categories_str = ", ".join(ACCOUNT_TYPES.keys())
            prompt = f"""
You are an expert CPA and financial controller. Classify this bank transaction into GAAP accounting categories.
Transaction Description: "{description}"
Amount: ${amount:.2f}
Flow: {tx_type.upper()}

Allowed Categories: {categories_str}
Valid Subcategories include:
- Revenue: Subscription Revenue, Enterprise Contracts, Professional Services
- Cost of Goods Sold: Hosting & Infrastructure, Payment Gateway Fees, Direct Production APIs
- Payroll: Salaries & Wages, Employee Benefits, Contract Labor
- Operating Expenses: Software & SaaS, Office & Facilities, Marketing & Advertising, Food & Entertainment, Travel & Lodging, Professional Services
- Non-P&L (Balance Sheet): Internal Transfer, Equity Financing, Debt Principal Repayment, Owner Drawings / Equity, Tax Withholding Remittance

Respond ONLY with valid JSON in this exact structure:
{{
  "category": "Operating Expenses",
  "subcategory": "Software & SaaS",
  "is_pnl": true,
  "confidence": 0.85,
  "reasoning": "Detailed audit explanation for this classification",
  "review_required": false,
  "review_reason": ""
}}
"""
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = json.loads(text)
                    return parsed
        except Exception:
            # Fall back to heuristic below if API fails
            pass

    # Heuristic fallback if API unavailable or for low-confidence rule match
    if rule_match:
        return rule_match

    # Default heuristic for unseen transaction
    desc_upper = description.upper()
    is_income = tx_type == "credit"
    
    if is_income:
        cat = "Revenue"
        subcat = "Subscription Revenue" if "PAY" in desc_upper or "STRIPE" in desc_upper else "Other Income"
        is_pnl = True
        conf = 0.70
        review = True
        rev_reason = "Unrecognized credit source. Verify client contract."
    else:
        # Default debit
        if "TRANSFER" in desc_upper or "SAVINGS" in desc_upper:
            cat = "Non-P&L (Balance Sheet)"
            subcat = "Internal Transfer"
            is_pnl = False
            conf = 0.90
            review = False
            rev_reason = ""
        else:
            cat = "Operating Expenses"
            subcat = "General & Administrative"
            is_pnl = True
            conf = 0.55
            review = True
            rev_reason = "Unrecognized vendor. Needs human accountant classification."

    return {
        "category": cat,
        "subcategory": subcat,
        "is_pnl": is_pnl,
        "confidence": conf,
        "reasoning": f"Automated semantic inference based on description keywords: {description}",
        "review_required": review,
        "review_reason": rev_reason
    }

def build_review_queue(transactions: List[Transaction]) -> List[ReviewItem]:
    """
    Surfaces transactions where:
    - Classification confidence is uncertain (< 0.85)
    - Accounting treatment requires judgment (large checks, peer-to-peer transfers, capital vs opex)
    - Flagged manually or by rule
    """
    review_items: List[ReviewItem] = []

    for tx in transactions:
        if not tx.review_required and tx.confidence >= 0.85:
            continue

        desc = tx.description.upper()
        amount = tx.amount

        severity = "low"
        flag_type = "low_confidence"
        suggested_action = "Confirm or update assigned category"
        suggested_categories = ["Operating Expenses", "Cost of Goods Sold", "Payroll", "Non-P&L (Balance Sheet)"]

        if tx.confidence < 0.60:
            severity = "high"
            flag_type = "low_confidence"
            suggested_action = "Manual classification required: System has low confidence (<60%)"
        
        if "CHECK" in desc or "UNRECORDED" in desc:
            severity = "high"
            flag_type = "unclear_memo"
            suggested_action = "Check cleared without vendor memo. Match against Accounts Payable invoice."
            suggested_categories = ["Operating Expenses", "Cost of Goods Sold", "Non-P&L (Balance Sheet)"]
        elif "VENMO" in desc or "ZELLE" in desc or "CASH APP" in desc:
            severity = "medium"
            flag_type = "personal_vs_business"
            suggested_action = "Peer-to-peer transfer. Verify if this is legitimate contractor labor or personal owner draw."
            suggested_categories = ["Payroll", "Operating Expenses", "Non-P&L (Balance Sheet)"]
        elif amount > 2000 and ("APPLE" in desc or "DELL" in desc or "EQUIPMENT" in desc or "HARDWARE" in desc):
            severity = "medium"
            flag_type = "capital_vs_opex"
            suggested_action = "Capitalization threshold alert (> $2,000). Determine whether to capitalize as a Fixed Asset or expense."
            suggested_categories = ["Operating Expenses", "Non-P&L (Balance Sheet)"]
        elif amount > 3000 and tx.category == "Operating Expenses":
            severity = "medium"
            flag_type = "anomaly_amount"
            suggested_action = f"Unusual spend spike (${amount:,.2f}). Confirm business purpose and approvals."

        review_items.append(ReviewItem(
            transaction=tx,
            severity=severity,
            flag_type=flag_type,
            suggested_action=suggested_action,
            suggested_categories=suggested_categories
        ))

    # Sort high severity first
    severity_order = {"high": 0, "medium": 1, "low": 2}
    review_items.sort(key=lambda x: severity_order.get(x.severity, 3))
    return review_items
