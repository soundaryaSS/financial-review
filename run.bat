@echo off
echo ========================================================
echo   FINZ - AI-Native Financial Review Platform
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Building frontend production bundle...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed.
    pause
    exit /b %errorlevel%
)

cd ..\backend
echo.
echo [2/2] Launching FastAPI Backend on http://localhost:8000...
echo Both UI and API are served together at http://localhost:8000
echo.
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
