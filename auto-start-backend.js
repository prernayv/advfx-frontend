const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');

function checkServerRunning(port = 3000) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/api/admin/stats`, (res) => {
            resolve(true);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function startBackendServer() {
    console.log('🔍 Checking if backend server is running...');
    
    const isRunning = await checkServerRunning();
    
    if (isRunning) {
        console.log('✅ Backend server is already running!');
        console.log('🌐 Admin Panel: http://localhost:8000');
        return;
    }
    
    console.log('🚀 Starting backend server...');
    
    const backendPath = path.join(__dirname, 'backend');
    
    // Install dependencies first
    console.log('📦 Installing dependencies...');
    exec('npm install', { cwd: backendPath }, (error) => {
        if (error) {
            console.error('❌ Failed to install dependencies:', error.message);
            return;
        }
        
        console.log('✅ Dependencies installed');
        
        // Start the server
        const serverProcess = spawn('npm', ['start'], {
            cwd: backendPath,
            stdio: 'inherit',
            shell: true
        });
        
        serverProcess.on('error', (error) => {
            console.error('❌ Failed to start server:', error.message);
        });
        
        // Check if server started successfully after a delay
        setTimeout(async () => {
            const isNowRunning = await checkServerRunning();
            if (isNowRunning) {
                console.log('\n✅ Backend server started successfully!');
                console.log('🌐 Admin Panel: http://localhost:8000');
                console.log('🔧 Backend API: http://localhost:3000');
            }
        }, 5000);
    });
}

// Run the auto-start function
startBackendServer().catch(console.error);