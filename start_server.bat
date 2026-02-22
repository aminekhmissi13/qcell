@echo off
echo ==========================================
echo Starting Cell Healthcare App Server...
echo ==========================================
echo.
echo 1. Keep this window open.
echo 2. Open your browser to: http://localhost:8000
echo.
python -m http.server 8000
pause
