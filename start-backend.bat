@echo off
echo 🚀 Starting ADVFX Backend Server...
echo.

cd /d "%~dp0backend"

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔥 Starting server...
echo ⚠️  Keep this window open while using the admin panel
echo 🌐 Admin Panel: http://localhost:8000
echo 🔧 Backend API: http://localhost:3000
echo.

call npm start

pause