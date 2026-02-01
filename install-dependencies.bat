@echo off
echo Installing ADVFX Backend Dependencies...
echo =====================================

cd backend
echo Current directory: %CD%

echo.
echo Installing npm dependencies...
npm install

echo.
echo Checking if installation was successful...
if exist node_modules (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Installation failed. Trying alternative method...
    npm install --force
)

echo.
echo Starting the server...
npm start

pause