@echo off
echo 🌐 Starting ADVFX Frontend Server...
echo.

cd /d "%~dp0"

echo 🔍 Checking for Python...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python found!
    echo.
    echo 🚀 Starting server on http://localhost:8000
    echo ⚠️  Keep this window open while using the website
    echo.
    python -m http.server 8000
) else (
    echo ❌ Python not found. Trying Node.js...
    echo.
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ Node.js found!
        echo 🚀 Starting server on http://localhost:8000
        echo ⚠️  Keep this window open while using the website
        echo.
        node serve-frontend.js
    ) else (
        echo ❌ Neither Python nor Node.js found!
        echo.
        echo Please install one of the following:
        echo   1. Python: https://www.python.org/downloads/
        echo   2. Node.js: https://nodejs.org/
        echo.
        pause
        exit /b 1
    )
)

pause
