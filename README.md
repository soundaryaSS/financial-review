
## ⚡ Quickstart: Run in 60 Seconds

### Prerequisites
* Python 3.10+
* Node.js 18+ (npm)

### Option 1: One-Click Launch (Windows)
Double-click `run.bat` or run in terminal:
```powershell
.\run.bat
```
This builds the production frontend bundle and launches the unified server at **`http://localhost:8000`**.

### Option 2: Step-by-Step Manual Launch
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
4. **Open Application:**
   Navigate to [http://localhost:8000](http://localhost:8000) in your browser.

*(Optional)* If you wish to enable live Gemini API calls for novel classifications, set `GEMINI_API_KEY` in `backend/.env`. The application runs with 100% functionality and offline deterministic fallbacks even without an API key!

---

## 🧪 Verification & Automated Testing

A dedicated test suite is included to mathematically verify the deterministic engine and API contracts.

Run the test suite:
```bash
python -m pytest backend/tests/ -v
```

