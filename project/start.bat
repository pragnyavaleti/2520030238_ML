@echo off
echo ========================================================
echo   Starting Crop Yield Prediction Full-Stack System
echo ========================================================
echo.

echo [1/3] Launching Python FastAPI ML Service (Port 8000)...
start "FastAPI ML Service (Port 8000)" cmd /k "cd /d %~dp0ml-service && .venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Node.js Backend Gateway (Port 5000)...
start "Backend Express API (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

timeout /t 2 /nobreak >nul

echo [3/3] Launching React Vite Frontend (Port 3000)...
start "Frontend Vite (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo All services launched!
echo - Frontend UI:        http://localhost:3000/
echo - Backend API:        http://localhost:5000/api/health
echo - FastAPI Swagger:    http://127.0.0.1:8000/docs
echo.
