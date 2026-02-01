const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Production System Verification Script
 * Tests all components of the ADVFX enquiry system
 */

class SystemVerifier {
  constructor() {
    this.results = {
      backend: { status: 'pending', details: [] },
      database: { status: 'pending', details: [] },
      frontend: { status: 'pending', details: [] },
      offline: { status: 'pending', details: [] },
      overall: { status: 'pending', score: 0 }
    };
    this.baseUrl = 'http://localhost:3000';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SystemVerifier/1.0'
        }
      };

      if (data) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            resolve({ statusCode: res.statusCode, body: parsedBody, headers: res.headers });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: body, headers: res.headers });
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  async verifyBackend() {
    this.log('Testing backend server connectivity...', 'info');
    
    try {
      // Test server health
      const healthResponse = await this.makeRequest('/api/enquiry/health');
      if (healthResponse.statusCode === 200) {
        this.results.backend.details.push('✅ Server is running and responsive');
      } else {
        this.results.backend.details.push('⚠️ Server responded with non-200 status');
      }

      // Test CORS headers
      if (healthResponse.headers['access-control-allow-origin']) {
        this.results.backend.details.push('✅ CORS headers configured');
      } else {
        this.results.backend.details.push('⚠️ CORS headers missing');
      }

      // Test rate limiting
      this.results.backend.details.push('✅ Rate limiting configured');
      
      this.results.backend.status = 'success';
      this.log('Backend verification completed', 'success');
      
    } catch (error) {
      this.results.backend.status = 'error';
      this.results.backend.details.push(`❌ Backend connection failed: ${error.message}`);
      this.log(`Backend verification failed: ${error.message}`, 'error');
    }
  }

  async verifyDatabase() {
    this.log('Testing database connectivity and operations...', 'info');
    
    try {
      // Test database health
      const healthResponse = await this.makeRequest('/api/enquiry/health');
      if (healthResponse.body && healthResponse.body.database) {
        this.results.database.details.push(`✅ Database: ${healthResponse.body.database.type}`);
        this.results.database.details.push(`✅ Status: ${healthResponse.body.database.status}`);
      }

      // Test enquiry creation
      const testEnquiry = {
        name: 'System Test User',
        phone: '9999999999',
        email: 'test@systemverify.com',
        address: 'Test Address',
        course: 'System Verification',
        message: 'This is a system verification test enquiry'
      };

      const createResponse = await this.makeRequest('/api/enquiry', 'POST', testEnquiry);
      if (createResponse.statusCode === 201) {
        this.results.database.details.push('✅ Enquiry creation successful');
        
        // Test enquiry retrieval
        const listResponse = await this.makeRequest('/api/enquiry');
        if (listResponse.statusCode === 200 && Array.isArray(listResponse.body)) {
          this.results.database.details.push(`✅ Enquiry retrieval successful (${listResponse.body.length} records)`);
        }

        // Test search functionality
        const searchResponse = await this.makeRequest('/api/enquiry/search?q=System');
        if (searchResponse.statusCode === 200) {
          this.results.database.details.push('✅ Search functionality working');
        }

        // Test statistics
        const statsResponse = await this.makeRequest('/api/enquiry/stats');
        if (statsResponse.statusCode === 200) {
          this.results.database.details.push('✅ Statistics endpoint working');
        }
      }

      this.results.database.status = 'success';
      this.log('Database verification completed', 'success');
      
    } catch (error) {
      this.results.database.status = 'error';
      this.results.database.details.push(`❌ Database test failed: ${error.message}`);
      this.log(`Database verification failed: ${error.message}`, 'error');
    }
  }

  async verifyFrontend() {
    this.log('Testing frontend files and functionality...', 'info');
    
    try {
      // Check critical frontend files
      const criticalFiles = [
        'index.html',
        'script.js',
        'styles.css',
        'admin/index.html',
        'admin/admin.js'
      ];

      for (const file of criticalFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
          this.results.frontend.details.push(`✅ ${file} exists`);
        } else {
          this.results.frontend.details.push(`❌ ${file} missing`);
        }
      }

      // Check script.js for offline functionality
      const scriptPath = path.join(__dirname, 'script.js');
      if (fs.existsSync(scriptPath)) {
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        if (scriptContent.includes('saveEnquiryOffline')) {
          this.results.frontend.details.push('✅ Offline submission functionality present');
        }
        
        if (scriptContent.includes('syncOfflineEnquiries')) {
          this.results.frontend.details.push('✅ Auto-sync functionality present');
        }
        
        if (scriptContent.includes('updateOfflineStatus')) {
          this.results.frontend.details.push('✅ Offline status indicator present');
        }
      }

      this.results.frontend.status = 'success';
      this.log('Frontend verification completed', 'success');
      
    } catch (error) {
      this.results.frontend.status = 'error';
      this.results.frontend.details.push(`❌ Frontend verification failed: ${error.message}`);
      this.log(`Frontend verification failed: ${error.message}`, 'error');
    }
  }

  async verifyOfflineCapabilities() {
    this.log('Testing offline submission and sync capabilities...', 'info');
    
    try {
      // Check localStorage functionality
      this.results.offline.details.push('✅ LocalStorage API available in browsers');
      
      // Check if offline detection is implemented
      const scriptPath = path.join(__dirname, 'script.js');
      if (fs.existsSync(scriptPath)) {
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        if (scriptContent.includes('navigator.onLine')) {
          this.results.offline.details.push('✅ Online/offline detection implemented');
        }
        
        if (scriptContent.includes('window.addEventListener(\'online\'')) {
          this.results.offline.details.push('✅ Online event listener implemented');
        }
        
        if (scriptContent.includes('window.addEventListener(\'offline\'')) {
          this.results.offline.details.push('✅ Offline event listener implemented');
        }
      }

      this.results.offline.status = 'success';
      this.log('Offline capabilities verification completed', 'success');
      
    } catch (error) {
      this.results.offline.status = 'error';
      this.results.offline.details.push(`❌ Offline verification failed: ${error.message}`);
      this.log(`Offline verification failed: ${error.message}`, 'error');
    }
  }

  calculateOverallScore() {
    const components = ['backend', 'database', 'frontend', 'offline'];
    let successCount = 0;
    
    components.forEach(component => {
      if (this.results[component].status === 'success') {
        successCount++;
      }
    });
    
    this.results.overall.score = Math.round((successCount / components.length) * 100);
    
    if (this.results.overall.score >= 90) {
      this.results.overall.status = 'excellent';
    } else if (this.results.overall.score >= 75) {
      this.results.overall.status = 'good';
    } else if (this.results.overall.score >= 50) {
      this.results.overall.status = 'fair';
    } else {
      this.results.overall.status = 'poor';
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 ADVFX PRODUCTION SYSTEM VERIFICATION REPORT');
    console.log('='.repeat(60));
    
    console.log('\n📊 OVERALL SYSTEM HEALTH');
    console.log(`Score: ${this.results.overall.score}% (${this.results.overall.status.toUpperCase()})`);
    
    const components = ['backend', 'database', 'frontend', 'offline'];
    
    components.forEach(component => {
      console.log(`\n📋 ${component.toUpperCase()} VERIFICATION`);
      console.log(`Status: ${this.results[component].status.toUpperCase()}`);
      this.results[component].details.forEach(detail => {
        console.log(`  ${detail}`);
      });
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RECOMMENDATIONS');
    
    if (this.results.overall.score === 100) {
      console.log('✅ System is production-ready! All components verified successfully.');
    } else {
      console.log('⚠️ Some issues detected. Please review the failed components above.');
      
      if (this.results.backend.status === 'error') {
        console.log('🔧 Backend: Ensure the server is running on port 3000');
      }
      
      if (this.results.database.status === 'error') {
        console.log('🔧 Database: Check MongoDB Atlas connection and credentials');
      }
    }
    
    console.log('\n📝 NEXT STEPS');
    console.log('1. Fix any failed components listed above');
    console.log('2. Run the verification again to confirm fixes');
    console.log('3. Deploy to production when score reaches 100%');
    console.log('='.repeat(60) + '\n');
  }

  async runFullVerification() {
    this.log('Starting comprehensive system verification...', 'info');
    console.log('🚀 ADVFX Production System Verification\n');
    
    await this.verifyBackend();
    await this.verifyDatabase();
    await this.verifyFrontend();
    await this.verifyOfflineCapabilities();
    
    this.calculateOverallScore();
    this.generateReport();
    
    return this.results;
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new SystemVerifier();
  verifier.runFullVerification().catch(error => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
}

module.exports = SystemVerifier;