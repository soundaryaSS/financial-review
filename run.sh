#!/bin/bash
set -e

echo "========================================================"
echo "  FINZ - AI-Native Financial Review Platform"
echo "========================================================"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/frontend"

echo "[1/2] Building frontend bundle..."
npm run build

cd "$DIR/backend"
echo "[2/2] Starting server at http://localhost:8000..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
