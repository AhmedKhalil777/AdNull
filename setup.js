#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AdNull Extension - Build Pipeline Setup');
console.log('==========================================\n');

async function setup() {
  try {
    // Check if Node.js version is compatible
    console.log('📋 Checking Node.js version...');
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 14) {
      console.error('❌ Node.js 14+ required. Current version:', nodeVersion);
      process.exit(1);
    }
    console.log('✅ Node.js version compatible:', nodeVersion);

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Failed to install dependencies');
      throw error;
    }

    // Create .env file if it doesn't exist
    console.log('\n🔧 Setting up environment configuration...');
    const envPath = '.env';
    const envExamplePath = 'env.example';
    
    if (!await fs.pathExists(envPath)) {
      if (await fs.pathExists(envExamplePath)) {
        await fs.copy(envExamplePath, envPath);
        console.log('✅ Created .env file from template');
        console.log('⚠️  Please edit .env file with your Chrome Web Store credentials');
      } else {
        console.log('⚠️  No env.example found, skipping .env creation');
      }
    } else {
      console.log('✅ .env file already exists');
    }

    // Validate extension structure
    console.log('\n🔍 Validating extension structure...');
    try {
      execSync('npm run validate', { stdio: 'inherit' });
      console.log('✅ Extension structure validated');
    } catch (error) {
      console.error('❌ Extension validation failed');
      throw error;
    }

    // Test build process
    console.log('\n🔨 Testing build process...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build process working');
    } catch (error) {
      console.error('❌ Build process failed');
      throw error;
    }

    // Test packaging
    console.log('\n📦 Testing packaging...');
    try {
      execSync('npm run package', { stdio: 'inherit' });
      console.log('✅ Packaging working');
    } catch (error) {
      console.error('❌ Packaging failed');
      throw error;
    }

    // Run tests
    console.log('\n🧪 Running tests...');
    try {
      execSync('npm run test', { stdio: 'inherit' });
      console.log('✅ All tests passed');
    } catch (error) {
      console.error('❌ Tests failed');
      throw error;
    }

    // Success message
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Edit .env file with your Chrome Web Store credentials');
    console.log('2. Run "npm run dev" to test the extension locally');
    console.log('3. Run "npm run release" to build and publish');
    console.log('\n📚 Documentation:');
    console.log('- BUILD-PIPELINE.md - Complete pipeline documentation');
    console.log('- AD-TROUBLESHOOTING.md - Extension troubleshooting');
    console.log('- ARABIC-SUPPORT.md - Arabic language support');
    
    console.log('\n🛠️  Available commands:');
    console.log('npm run build          # Build extension');
    console.log('npm run package        # Create ZIP package');
    console.log('npm run validate       # Validate extension');
    console.log('npm run test           # Run tests');
    console.log('npm run publish        # Publish to Chrome Web Store');
    console.log('npm run dev            # Launch development version');
    console.log('npm run clean          # Clean build artifacts');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure Node.js 14+ is installed');
    console.log('2. Check internet connection for npm install');
    console.log('3. Verify extension source files are present');
    console.log('4. Check BUILD-PIPELINE.md for detailed setup instructions');
    process.exit(1);
  }
}

// Run setup
setup(); 