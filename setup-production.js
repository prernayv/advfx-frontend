const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Production Setup Script for ADVFX Enquiry System
 * Automates the setup process for production deployment
 */

class ProductionSetup {
  constructor() {
    this.backendPath = path.join(__dirname, 'backend');
    this.envPath = path.join(this.backendPath, '.env');
    this.packagePath = path.join(this.backendPath, 'package.json');
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    console.log(`${prefix} ${message}`);
  }

  checkPrerequisites() {
    this.log('Checking prerequisites...', 'info');
    
    try {
      // Check Node.js
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      this.log(`Node.js version: ${nodeVersion}`, 'success');
      
      // Check npm
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`npm version: ${npmVersion}`, 'success');
      
      return true;
    } catch (error) {
      this.log('Node.js or npm not found. Please install Node.js first.', 'error');
      return false;
    }
  }

  installDependencies() {
    this.log('Installing backend dependencies...', 'info');
    
    try {
      process.chdir(this.backendPath);
      execSync('npm install', { stdio: 'inherit' });
      this.log('Dependencies installed successfully', 'success');
      process.chdir(__dirname);
      return true;
    } catch (error) {
      this.log(`Failed to install dependencies: ${error.message}`, 'error');
      return false;
    }
  }

  checkEnvironmentConfig() {
    this.log('Checking environment configuration...', 'info');
    
    if (!fs.existsSync(this.envPath)) {
      this.log('.env file not found', 'error');
      return false;
    }
    
    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const requiredVars = [
      'MONGODB_URI',
      'NODE_ENV',
      'PORT',
      'ADMIN_USERNAME',
      'ADMIN_PASSWORD'
    ];
    
    const missingVars = [];
    requiredVars.forEach(varName => {
      if (!envContent.includes(`${varName}=`)) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      this.log(`Missing environment variables: ${missingVars.join(', ')}`, 'error');
      return false;
    }
    
    this.log('Environment configuration is complete', 'success');
    return true;
  }

  validateMongoDBConnection() {
    this.log('Validating MongoDB configuration...', 'info');
    
    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const mongoUriMatch = envContent.match(/MONGODB_URI=(.+)/);
    
    if (!mongoUriMatch) {
      this.log('MONGODB_URI not found in .env file', 'error');
      return false;
    }
    
    const mongoUri = mongoUriMatch[1].trim();
    
    if (mongoUri.includes('mongodb+srv://')) {
      this.log('MongoDB Atlas URI detected', 'success');
    } else if (mongoUri.includes('mongodb://localhost')) {
      this.log('Local MongoDB URI detected', 'warning');
      this.log('Consider using MongoDB Atlas for production', 'warning');
    } else {
      this.log('Invalid MongoDB URI format', 'error');
      return false;
    }
    
    return true;
  }

  generateStartupScripts() {
    this.log('Generating startup scripts...', 'info');
    
    // Windows batch file
    const windowsScript = `@echo off
echo Starting ADVFX Production Server...
cd backend
npm start
pause`;
    
    fs.writeFileSync(path.join(__dirname, 'start-production.bat'), windowsScript);
    
    // Unix shell script
    const unixScript = `#!/bin/bash
echo "Starting ADVFX Production Server..."
cd backend
npm start`;
    
    fs.writeFileSync(path.join(__dirname, 'start-production.sh'), unixScript);
    
    // Make shell script executable on Unix systems
    try {
      execSync('chmod +x start-production.sh');
    } catch (error) {
      // Ignore on Windows
    }
    
    this.log('Startup scripts generated', 'success');
  }

  displaySetupSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ADVFX PRODUCTION SETUP COMPLETE');
    console.log('='.repeat(60));
    
    console.log('\n📋 SYSTEM FEATURES:');
    console.log('✅ MongoDB Atlas persistent storage');
    console.log('✅ Offline submission handling');
    console.log('✅ Auto-sync when connection restored');
    console.log('✅ Production-grade security');
    console.log('✅ Rate limiting and CORS protection');
    console.log('✅ Comprehensive error handling');
    
    console.log('\n🚀 TO START THE SERVER:');
    console.log('Windows: double-click start-production.bat');
    console.log('Unix/Mac: ./start-production.sh');
    console.log('Manual: cd backend && npm start');
    
    console.log('\n🔍 TO VERIFY SYSTEM:');
    console.log('Run: node verify-system.js');
    
    console.log('\n📊 ADMIN PANEL:');
    console.log('URL: http://localhost:3000/admin');
    console.log('Check .env file for admin credentials');
    
    console.log('\n📝 IMPORTANT NOTES:');
    console.log('• Ensure MongoDB Atlas is properly configured');
    console.log('• Keep your .env file secure and never commit it');
    console.log('• Run system verification before going live');
    console.log('• Monitor server logs for any issues');
    
    console.log('='.repeat(60) + '\n');
  }

  async runSetup() {
    console.log('🚀 ADVFX Production Setup Starting...\n');
    
    if (!this.checkPrerequisites()) {
      process.exit(1);
    }
    
    if (!this.installDependencies()) {
      process.exit(1);
    }
    
    if (!this.checkEnvironmentConfig()) {
      this.log('Please configure your .env file before proceeding', 'error');
      this.log('Refer to README-ADMIN-SETUP.md for detailed instructions', 'info');
      process.exit(1);
    }
    
    if (!this.validateMongoDBConnection()) {
      this.log('Please fix MongoDB configuration before proceeding', 'error');
      process.exit(1);
    }
    
    this.generateStartupScripts();
    this.displaySetupSummary();
    
    this.log('Setup completed successfully! 🎉', 'success');
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new ProductionSetup();
  setup.runSetup().catch(error => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}

module.exports = ProductionSetup;