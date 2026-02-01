const http = require('http');

function checkServer(port = 3000) {
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

async function main() {
    console.log('🔍 Checking ADVFX Backend Server...');
    
    const isRunning = await checkServer();
    
    if (isRunning) {
        console.log('✅ Backend server is running!');
        console.log('🌐 Admin Panel: http://localhost:8000');
        console.log('🔧 Backend API: http://localhost:3000');
    } else {
        console.log('❌ Backend server is NOT running!');
        console.log('');
        console.log('🚀 To start the server:');
        console.log('1. Double-click "start-backend.bat"');
        console.log('2. Or run "npm start" in the backend folder');
        console.log('');
        console.log('💡 For background service: Double-click "start-backend-service.bat"');
    }
}

main().catch(console.error);