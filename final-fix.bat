@echo off
echo 🔧 FINAL FIX - Removing Firebase Completely
echo ==========================================

cd backend

echo 📦 Removing old node_modules...
if exist node_modules rmdir /s /q node_modules

echo 📦 Removing package-lock.json...
if exist package-lock.json del package-lock.json

echo 📦 Installing clean dependencies...
npm install

echo 🚀 Starting server...
npm start

pause