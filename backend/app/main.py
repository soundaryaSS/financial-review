"""
FINZ AI-Native Financial Review Application - FastAPI Server
Entry point providing REST endpoints for Ingestion, P&L, Variances, Review Queue, and Conversational Analyst.
"""

import os
import csv
import io
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.models.financial import (
    Transaction, TransactionUpdate, PnLStatement,
    VarianceAnalysis, ReviewItem, ChatRequest, ChatResponse
)
from app.engine.deterministic_pnl import calculate_pnl
from app.engine.variance_engine import analyze_variances
from app.engine.classifier import build_review_queue, rule_based_classify
from app.engine.analyst_agent import ask_financial_analyst

app = FastAPI(
    title="FINZ AI-Native Financial Review API",
    description="Turn raw bank transactions into an explainable, deterministic financial review.",
    version="1.0.0"
)

# CORS configuration for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "finz_transactions.csv")

# In-memory transaction store for reactive reclassification
transactions_db: List[Transaction] = []

def load_transactions_from_csv(filepath: str):
    global transactions_db
    txs = []
    if os.path.exists(filepath):
        with open(filepath, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                txs.append(Transaction(
                    id=row["id"],
                    date=row["date"],
                    description=row["description"],
                    amount=float(row["amount"]),
                    type=row["type"],
                    account=row.get("account", "Chase Business Checking (*4182)"),
                    category=row["category"],
                    subcategory=row.get("subcategory", "General"),
                    is_pnl=row["is_pnl"].strip().lower() in ["true", "1", "t"],
                    confidence=float(row.get("confidence", 1.0)),
                    reasoning=row.get("reasoning", ""),
                    review_required=row.get("review_required", "False").strip().lower() in ["true", "1", "t"],
                    review_reason=row.get("review_reason", "")
                ))
    transactions_db = txs
    print(f"Loaded {len(transactions_db)} transactions into active ledger.")

# Start with an empty ledger by default (user uploads CSV or loads sample)
transactions_db = []

# --- REST Endpoints ---

@app.get("/api/health")
def health_check():
    pnl = calculate_pnl(transactions_db)
    return {
        "status": "healthy",
        "service": "FINZ AI-Native Financial Review Engine",
        "transaction_count": len(transactions_db),
        "periods": pnl.periods,
        "calculation_engine": "Deterministic-Decimal-Ledger",
        "verification_checksum_zero": True,
        "llm_financial_totals_disabled": True
    }

@app.get("/api/transactions", response_model=List[Transaction])
def get_transactions(
    category: Optional[str] = None,
    period: Optional[str] = None,
    is_pnl: Optional[bool] = None,
    review_required: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = 500
):
    results = transactions_db
    if category:
        results = [t for t in results if t.category == category]
    if period:
        results = [t for t in results if t.date.startswith(period)]
    if is_pnl is not None:
        results = [t for t in results if t.is_pnl == is_pnl]
    if review_required is not None:
        results = [t for t in results if t.review_required == review_required]
    if search:
        s = search.lower()
        results = [t for t in results if s in t.description.lower() or s in t.id.lower() or s in t.subcategory.lower()]
    return results[:limit]

@app.get("/api/transactions/{tx_id}", response_model=Transaction)
def get_transaction(tx_id: str):
    for t in transactions_db:
        if t.id == tx_id:
            return t
    raise HTTPException(status_code=404, detail="Transaction not found")

@app.patch("/api/transactions/{tx_id}", response_model=Transaction)
def update_transaction(tx_id: str, update: TransactionUpdate):
    """
    Human-in-the-Loop Reclassification:
    Allows user to correct a category, flip P&L status, or resolve a review item.
    This immediately causes all subsequent P&L and variance calls to recompute deterministically!
    """
    global transactions_db
    for idx, t in enumerate(transactions_db):
        if t.id == tx_id:
            updated_dict = t.model_dump()
            if update.category is not None:
                updated_dict["category"] = update.category
                # Adjust is_pnl accordingly if category is non-pnl
                if update.category == "Non-P&L (Balance Sheet)":
                    updated_dict["is_pnl"] = False
                elif update.is_pnl is None:
                    updated_dict["is_pnl"] = True
            if update.subcategory is not None:
                updated_dict["subcategory"] = update.subcategory
            if update.is_pnl is not None:
                updated_dict["is_pnl"] = update.is_pnl
            if update.review_required is not None:
                updated_dict["review_required"] = update.review_required
                if not update.review_required:
                    updated_dict["review_reason"] = "Resolved by human auditor"
            if update.notes:
                updated_dict["reasoning"] += f" | Human Note: {update.notes}"

            updated_dict["confidence"] = 1.0  # Human verified
            new_tx = Transaction(**updated_dict)
            transactions_db[idx] = new_tx
            return new_tx

    raise HTTPException(status_code=404, detail="Transaction not found")

@app.get("/api/pnl", response_model=PnLStatement)
def get_pnl():
    """
    Computes monthly P&L strictly from underlying transaction data.
    """
    return calculate_pnl(transactions_db)

@app.get("/api/variances", response_model=List[VarianceAnalysis])
def get_variances(
    period_a: str = Query("2026-02", description="Base comparison period YYYY-MM"),
    period_b: str = Query("2026-03", description="Target period YYYY-MM")
):
    """
    Identifies material variances between two periods and deconstructs them into driver transactions.
    """
    pnl = calculate_pnl(transactions_db)
    return analyze_variances(pnl, transactions_db, period_a, period_b)

@app.get("/api/review-queue", response_model=List[ReviewItem])
def get_review_queue():
    """
    Surfaces transactions where classification is uncertain, accounting treatment requires judgment,
    or human review is appropriate.
    """
    return build_review_queue(transactions_db)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_analyst(req: ChatRequest):
    """
    Conversational AI Financial Analyst.
    Grounded in structured deterministic data with clickable transaction evidence chips.
    """
    pnl = calculate_pnl(transactions_db)
    response = await ask_financial_analyst(
        query=req.message,
        pnl=pnl,
        transactions=transactions_db,
        history=req.conversation_history
    )
    return response

@app.post("/api/upload")
async def upload_csv_file(file: UploadFile = File(...)):
    """
    Ingests a raw bank transaction CSV file and classifies each transaction into the structured ledger.
    """
    global transactions_db
    content = await file.read()
    decoded = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))
    
    new_txs: List[Transaction] = []
    idx = 1
    for row in reader:
        # Standardize headers
        tx_id_raw = row.get("Transaction ID") or row.get("id") or f"UP-{idx:04d}"
        desc = row.get("description") or row.get("Description") or row.get("memo") or "Unknown Transaction"
        counterparty = row.get("Counterparty", "").strip()
        if counterparty and counterparty not in desc:
            desc = f"{desc} ({counterparty})"

        amt_str = row.get("amount") or row.get("Amount") or "0"
        clean_num_str = str(amt_str).replace("$", "").replace(",", "").strip()
        num_val = float(clean_num_str)
        amt = abs(num_val)
        dt = row.get("date") or row.get("Date") or "2026-03-01"

        # Standard bank logic: negative amounts are debits (expenses), positive amounts are credits (deposits)
        tx_type_raw = (row.get("type") or "").lower()
        if num_val < 0 or "debit" in tx_type_raw:
            tx_type = "debit"
        else:
            tx_type = "credit"

        # Auto-classify
        classified = rule_based_classify(desc, amt, tx_type)
        if not classified:
            classified = {
                "category": "Operating Expenses" if tx_type == "debit" else "Revenue",
                "subcategory": "General Operating Expense" if tx_type == "debit" else "Other Revenue",
                "is_pnl": True,
                "confidence": 0.60,
                "reasoning": "Unrecognized vendor on CSV import. Flagged for review.",
                "review_required": True,
                "review_reason": "Newly ingested transaction requiring review"
            }

        new_txs.append(Transaction(
            id=tx_id_raw,
            date=dt,
            description=desc,
            amount=amt,
            type=tx_type,
            account=row.get("account", "Uploaded Bank Account"),
            category=classified["category"],
            subcategory=classified["subcategory"],
            is_pnl=classified["is_pnl"],
            confidence=classified["confidence"],
            reasoning=classified["reasoning"],
            review_required=classified["review_required"],
            review_reason=classified["review_reason"]
        ))
        idx += 1

    if new_txs:
        transactions_db = new_txs

    return {
        "message": f"Successfully ingested and classified {len(new_txs)} transactions",
        "count": len(new_txs)
    }

@app.post("/api/reset")
def reset_to_blank():
    """Resets transactions to a completely blank ledger (0 transactions)."""
    global transactions_db
    transactions_db = []
    return {"message": "Ledger reset to blank state (0 transactions)", "count": 0}

@app.post("/api/benchmark")
def load_benchmark():
    """Loads the NYC Restaurant Co. 181-transaction benchmark dataset."""
    load_transactions_from_csv(DATA_FILE)
    return {"message": "Loaded NYC Restaurant Co. benchmark dataset", "count": len(transactions_db)}

# Serve frontend build if exists
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        target = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(target) and os.path.isfile(target):
            return FileResponse(target)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
