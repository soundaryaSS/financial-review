"""
FastAPI Endpoints Verification Suite
Tests all REST API contracts and simulated user flows.
"""

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_benchmark():
    client.post("/api/benchmark")

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["llm_financial_totals_disabled"] is True
    assert data["transaction_count"] > 50

def test_api_pnl():
    res = client.get("/api/pnl")
    assert res.status_code == 200
    data = res.json()
    assert "2026-01" in data["periods"]
    assert "2026-03" in data["periods"]
    mar = data["monthly_summaries"]["2026-03"]
    assert mar["revenue"] > 0
    assert mar["gross_profit"] == round(mar["revenue"] - mar["cogs"], 2)
    assert mar["operating_profit"] == round(mar["gross_profit"] - mar["payroll"] - mar["opex"], 2)
    assert mar["is_balanced"] is True

def test_api_variances():
    res = client.get("/api/variances?period_a=2026-02&period_b=2026-03")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    # Find food & entertainment variance
    food_v = [v for v in data if "Food" in v["category"]]
    assert len(food_v) > 0
    assert food_v[0]["delta_amount"] > 0
    assert len(food_v[0]["top_drivers"]) > 0

def test_api_review_queue():
    res = client.get("/api/review-queue")
    assert res.status_code == 200
    queue = res.json()
    assert len(queue) > 0
    # Each item should have transaction, severity, and suggested action
    assert "transaction" in queue[0]
    assert "severity" in queue[0]
    assert "suggested_action" in queue[0]

def test_api_chat_standard_questions():
    questions = [
        "What was our revenue in March?",
        "How much did we spend on payroll each month?",
        "Why did operating profit change between February and March?",
        "What drove the increase in food costs?",
        "Which transactions need my attention?"
    ]
    for q in questions:
        res = client.post("/api/chat", json={"message": q})
        assert res.status_code == 200
        data = res.json()
        assert len(data["answer"]) > 20
        assert "citations" in data
        assert len(data["citations"]) > 0
