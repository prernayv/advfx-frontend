@echo off
echo 🚀 Starting ADVFX Backend Server in Background...
echo.

cd /d "%~dp0backend"

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔥 Starting server in background...
start /min cmd /c "npm start"

echo ✅ Backend server started in background!
echo 🌐 Admin Panel: http://localhost:8000
echo 🔧 Backend API: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul