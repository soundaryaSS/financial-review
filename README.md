# ⚡ FINZ APEX — Autonomous Ledger OS
### *AI-Native Financial Review & Variance Copilot*

[![Python 3.11](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/Frontend-TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **FINZ Software Engineering Internship Challenge Submission**  
> Built for the in-person technical evaluation in Koramangala, Bangalore.  
> Dataset: `NYC Restaurant Co. - Raw Transactions` (181 Real Bank Transactions).

---

## 🌟 Architectural Philosophy: Zero-Hallucination Determinism

A core requirement of financial engineering is that **Large Language Models must NEVER calculate financial totals or write directly to balance sheets**. 

FINZ APEX implements a strict **Dual-Engine Architecture**:
```
┌────────────────────────────────────────────────────────┐
│               RAW BANK TRANSACTIONS (CSV)              │
│       Toast POS, Sysco, ConEd, Gusto, Clover, etc.     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            HYBRID CLASSIFICATION ENGINE                │
│   • Regex & Chart-of-Accounts Pattern Matcher          │
│   • Confidence Scoring (0.00 - 1.00)                   │
│   • Capital Asset & Non-P&L Balance Sheet Detector     │
└──────────────────────────┬─────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌───────────────────────┐   ┌───────────────────────────┐
│ DETERMINISTIC LEDGER  │   │     LLM REVIEW COPILOT    │
│  (FastAPI + Pandas)   │   │     (Gemini 2.5 Flash)    │
│                       │   │                           │
│ • Exact P&L Addition  │   │ • Variance Driver Explain │
│ • GAAP Classification │   │ • Traceable Evidence Chips│
│ • Waterfall Variance  │   │ • Review Queue Reasoning  │
│ • $0.00 Checksum      │   │ • Zero Arithmetic Auths   │
└───────────┬───────────┘   └─────────────┬─────────────┘
            │                             │
            └──────────────┬──────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│             REACTIVE FINANCIAL WORKSTATION             │
│    • Interactive Monthly Trajectory Bar Chart          │
│    • EBITDA Variance Waterfall Bridge Chart            │
│    • Category-Filtered Review Queue with Audit Log     │
│    • Real-time Conversational Evidence Explorer        │
└────────────────────────────────────────────────────────┘
```

1. **Deterministic Core:** All mathematical aggregations, Monthly P&L totals (Revenue, COGS, Gross Profit, Operating Expenses, EBITDA), and variance walks are computed strictly by deterministic Python algorithms.
2. **Explainable AI Layer:** Gemini 2.5 Flash acts strictly as an analytical copilot. Every statement it makes is linked to traceable evidence chips (`[Txn ID, Date, Amount]`) pointing to verified underlying transactions.

---

## 🚀 Key Features

### 1. Ingestion & Automated Classification
- Parses messy bank feed strings (e.g. `TST* TRINITY BAR REST`, `SYSCO BOSTON METRO FOODS`, `CONED 0244 ELEC BILL`).
- Maps entries into a restaurant-specific **GAAP Chart of Accounts**:
  - **Revenue:** Dine-In/Takeout Food Sales, Bar/Beverage Sales, Catering Revenue, Delivery Marketplace Sales, less Refunds & Chargebacks.
  - **COGS:** Food Inventory, Beverage Inventory, Packaging & Takeout Supplies, Delivery Platform Commissions.
  - **Payroll & OpEx:** Hourly Kitchen/FOH Wages, Management Salary ($6,500/mo), Rent ($9,000/mo), Utilities, Toast POS SaaS, Insurance, Repairs.
  - **Non-P&L Balance Sheet Items:** Fixed Asset Capital Expenditures ($7,800 Commercial Oven), Sales Tax Remittances, Owner Draws, Deferred Revenue.

### 2. Deterministic Monthly P&L with Interactive Charts
- Compares **January 2026**, **February 2026**, and **March 2026** performance side-by-side.
- **Visual Trajectory Bar Chart:** Visualizes Revenue, COGS, Labor, and OpEx trends with EBITDA margin badges.
- **Export Capabilities:** One-click CSV and JSON exports for CFO audit packages.

### 3. EBITDA Variance Engine & Waterfall Chart
- Decomposes month-over-month profit variances into structural drivers:
  - Volume/Mix effect, Food Cost inflation, OpEx efficiency, and Labor productivity.
- **Visual Waterfall Bridge Chart:** Step-by-step financial bridge from Feb EBITDA ($9,912) to March EBITDA ($38,427).

### 4. Human-in-the-Loop Review Queue
- Flags high-risk or ambiguous transactions requiring human sign-off:
  - **Capital Asset Threshold:** A $7,800 commercial convection oven is flagged to prevent improper expensing into OpEx repairs (must be capitalized onto the Balance Sheet and depreciated).
  - **Sales Tax Pass-Through:** NY State tax payments flagged to ensure they are excluded from P&L operating expense.
  - **Owner Draws:** Capital distributions correctly isolated from operating payroll.
  - **Deferred Gift Card Revenue:** Cash liability flagged to prevent premature revenue recognition.
- Features **Category Filter Pills** (`All Categories`, `COGS`, `Non-P&L / Balance Sheet`) and **Interactive Review Actions** (`Approve`, `Reclassify`, `Override`).

### 5. Conversational AI Financial Analyst with Evidence Chips
Directly answers the primary questions required by the challenge prompt:
- **"What drove the increase in food costs in March?"**  
  *Traces driver directly to Transaction `T1179` ($6,200.00 from Sysco Boston Metro on 2026-03-06 for a large catering order).*
- **"Why did operating profit surge in March?"**  
  *Explains the high operating leverage: 27.2% revenue growth ($163,940 vs $128,850) against fixed store rent ($9,000) and management salaries ($6,500), expanding EBITDA margin from 7.7% to 23.4%.*
- **"What items require human review and why?"**  
  *Details the $7,800 capital equipment purchase, state sales tax remittance, owner equity draw, and deferred gift cards with accounting rationale.*

---

## ⚡ Quickstart: Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (npm)

### Option 1: One-Click Launch (Windows)
```powershell
.\run.bat
```
This builds the production frontend bundle and launches the unified server at **`http://localhost:8000`**.

### Option 2: Manual Terminal Launch
1. **Install Backend Dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Build Frontend Bundle:**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```
3. **Start Unified FastAPI Server:**
   ```bash
   cd ../backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. **Open in Browser:**
   Visit [http://localhost:8000](http://localhost:8000).

*(Optional)* To enable live Google Gemini calls, copy `backend/.env.example` to `backend/.env` and paste your `GEMINI_API_KEY`. The platform includes robust offline analytical fallbacks so it functions 100% even without an API key!

---

## ☁️ Free 1-Click Cloud Deployment Guide

You can host FINZ APEX for free using **Render.com** in under 3 minutes:

### Method A: Deploy on Render via Docker (Recommended)
1. Fork or push this repository to your GitHub account (`https://github.com/soundaryaSS/financial-review`).
2. Log into [Render.com](https://render.com) (free account).
3. Click **New +** → **Web Service**.
4. Connect your `financial-review` repository.
5. In the service settings:
   - **Name:** `finz-financial-review`
   - **Environment:** `Docker` (Render automatically uses the multi-stage `Dockerfile`)
   - **Region:** Any (e.g., Oregon or Singapore)
   - **Instance Type:** `Free`
6. Click **Deploy Web Service**!
7. Render will build the container and provide your live HTTPS URL (e.g. `https://finz-financial-review.onrender.com`).

### Method B: Deploy on Render via Python Native
If deploying as a native Python Web Service:
- **Build Command:**
  ```bash
  pip install -r backend/requirements.txt
  ```
  *(Note: Since `frontend/dist` is tracked in git, no Node install is required on the server!)*
- **Start Command:**
  ```bash
  python run_server.py
  ```

---

## 🧪 Automated Test Suite

A rigorous verification test suite checks P&L mathematical integrity, classification rules, variance calculations, and REST API routes:

```bash
python -m pytest backend/tests/ -v
```

All 7 test suites pass deterministically with zero mock failures.

---

## 📁 Repository Structure

```
finz-financial-review/
├── backend/
│   ├── app/
│   │   ├── engine/
│   │   │   ├── analyst_agent.py      # Conversational Copilot with evidence chips
│   │   │   ├── chart_of_accounts.py  # Restaurant GAAP taxonomy
│   │   │   ├── classifier.py         # Multi-tier classification & anomaly rules
│   │   │   ├── deterministic_pnl.py  # Exact zero-hallucination P&L engine
│   │   │   └── variance_engine.py    # MoM bridge & waterfall driver calculator
│   │   ├── models/
│   │   │   └── financial.py          # Pydantic data schemas
│   │   └── main.py                   # FastAPI app & static SPA server
│   ├── data/
│   │   ├── finz_transactions.csv     # 181 normalized NYC Restaurant transactions
│   │   └── generate_data.py          # Synthetic benchmark generator
│   ├── tests/
│   │   ├── test_pnl.py               # Deterministic ledger math tests
│   │   └── test_api.py               # API route integration tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── analystView.ts            # Copilot chat UI & evidence modal
│   │   ├── api.ts                    # REST client
│   │   ├── ledgerView.ts             # Raw transaction ledger & search
│   │   ├── main.ts                   # App orchestrator & navigation
│   │   ├── pnlView.ts                # Monthly P&L table + Trajectory Bar Chart
│   │   ├── reviewQueueView.ts        # Category-filtered review queue
│   │   ├── types.ts                  # TypeScript interfaces
│   │   └── varianceView.ts           # Waterfall Bridge Chart + Driver breakdown
│   ├── dist/                         # Production bundle (pre-compiled)
│   ├── index.html                    # Single-page application shell
│   └── package.json
├── Dockerfile                        # Multi-stage production container
├── run_server.py                     # Universal cloud entrypoint ($PORT aware)
├── run.bat                           # 1-click Windows launcher
└── README.md
```

---

## 🎯 Author & Submission Note
Developed for the **FINZ Software Engineering Internship Challenge**.  
Engineered with modular TypeScript and Python FastAPI for 100% auditability and in-person defense.
