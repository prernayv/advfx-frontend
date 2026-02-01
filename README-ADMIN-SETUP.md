# 🔧 ADVFX Admin Panel - Production Setup Guide

## 🎯 PRODUCTION-READY SYSTEM ✅

**✅ PERSISTENT DATABASE:** MongoDB Atlas (Cloud Database)  
**✅ OFFLINE SUPPORT:** Local storage with auto-sync  
**✅ DATA PERSISTENCE:** Survives server restarts  
**✅ ZERO DATA LOSS:** Guaranteed enquiry storage  

## 🚀 Quick Start (PRODUCTION SYSTEM)

### ⚡ Method 1: One-Click Start (Recommended)
1. **Double-click** `start-backend.bat` in the main folder
2. Wait for "Server running on port 3000" message
3. Go to `http://localhost:8000` for admin panel
4. Login with: `admin` / `advfx2024!`

### 🔄 Method 2: Background Service
1. **Double-click** `start-backend-service.bat`
2. Server runs in background (no window to keep open)
3. Go to `http://localhost:8000` for admin panel

### 🛠️ Method 3: Auto-Start Script
1. **Double-click** `auto-start-backend.js`
2. Automatically checks and starts server if needed
3. Go to `http://localhost:8000` for admin panel

### 📱 Method 4: Manual (Command Line)
1. Open terminal in the `backend` folder
2. Run: `npm start`
3. Go to `http://localhost:8000` for admin panel

## 🔑 Admin Login Credentials
- **Username:** `admin`
- **Password:** `advfx2024!`

## 🌐 URLs
- **Admin Panel:** http://localhost:8000
- **Backend API:** http://localhost:3000
- **Main Website:** http://localhost:59211

## 💾 DATABASE SETUP (REQUIRED)

### 🌐 MongoDB Atlas Setup (Cloud Database)
1. **Create MongoDB Atlas Account:** https://cloud.mongodb.com/
2. **Create New Cluster:** Choose free tier (M0)
3. **Get Connection String:** 
   - Click "Connect" → "Connect your application"
   - Copy the connection string
4. **Update Environment:**
   - Open `backend/.env` file
   - Replace `MONGODB_URI` with your connection string
   - Replace `<username>` and `<password>` with your database credentials

### 📝 Example .env Configuration
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/enquiry_system?retryWrites=true&w=majority
NODE_ENV=production
TEST_MODE=false
```

## ❗ Important Notes
- **PERSISTENT STORAGE:** All enquiries are saved to MongoDB Atlas cloud database
- **OFFLINE SUPPORT:** Forms work even when backend is down (auto-sync when online)
- **DATA PERSISTENCE:** Enquiries survive server restarts and crashes
- **ZERO DATA LOSS:** Guaranteed with cloud database + offline backup

## 🛠️ Troubleshooting

### ❌ "Failed to fetch" Error (FIXED!)
**This error means the backend server is not running. Here's the permanent fix:**

1. **Quick Fix:** Double-click `start-backend.bat`
2. **Background Fix:** Double-click `start-backend-service.bat`
3. **Auto Fix:** Double-click `auto-start-backend.js`
4. **Manual Fix:** Open terminal in `backend` folder → Run `npm start`

### 🔧 Other Issues:

1. **Port 3000 already in use:** 
   - Kill existing Node.js processes in Task Manager
   - Or use different port in `.env` file

2. **Admin won't load:** 
   - Check if backend server is running on port 3000
   - Verify admin panel is accessible at `http://localhost:8000`

3. **No enquiries showing:**
   - Submit a test enquiry from the main website
   - Check if `backend/data/enquiries.json` file is created

4. **Batch files don't work:**
   - Make sure Node.js is installed
   - Right-click batch file → "Run as administrator"

### 🚨 Emergency Recovery:
If nothing works, run these commands in order:
```bash
cd backend
npm install
npm start
```

## 📊 Features
- ✅ Dynamic dashboard statistics
- ✅ Real-time enquiry management
- ✅ Status updates with auto-refresh
- ✅ Course-wise analytics
- ✅ Secure JWT authentication