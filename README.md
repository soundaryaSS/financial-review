# ⚡ FINZ APEX — Autonomous Ledger OS
### *AI-Native Financial Review & Variance Copilot*

[![Python 3.11](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/Frontend-TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)




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

