#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const chromeWebstoreUpload = require('chrome-webstore-upload');
require('dotenv').config();

const PACKAGE_DIR = 'packages';

console.log(chalk.blue('🚀 Publishing AdNull Extension to Chrome Web Store...'));

async function publish() {
  try {
    // Check for required environment variables
    validateEnvironment();

    // Find the latest package
    const latestPackage = path.join(PACKAGE_DIR, 'adnull-latest.zip');
    
    if (!await fs.pathExists(latestPackage)) {
      console.log(chalk.yellow('📦 No package found, running build and package first...'));
      const { build } = require('./build.js');
      const { package } = require('./package.js');
      await build();
      await package();
    }

    // Initialize Chrome Web Store API
    const webStore = chromeWebstoreUpload({
      extensionId: process.env.CHROME_EXTENSION_ID,
      clientId: process.env.CHROME_CLIENT_ID,
      clientSecret: process.env.CHROME_CLIENT_SECRET,
      refreshToken: process.env.CHROME_REFRESH_TOKEN
    });

    console.log(chalk.yellow('📤 Uploading extension package...'));

    // Upload the extension
    const packageBuffer = await fs.readFile(latestPackage);
    const uploadResponse = await webStore.uploadExisting(packageBuffer);

    if (uploadResponse.uploadState === 'SUCCESS') {
      console.log(chalk.green('✅ Upload successful!'));
      
      // Publish the extension
      if (process.env.AUTO_PUBLISH === 'true') {
        console.log(chalk.yellow('🌐 Publishing extension...'));
        
        const publishResponse = await webStore.publish();
        
        if (publishResponse.status.includes('OK')) {
          console.log(chalk.green('✅ Extension published successfully!'));
          console.log(chalk.cyan('🌐 Extension is now live on Chrome Web Store'));
        } else {
          console.warn(chalk.yellow('⚠️  Publish response:'), publishResponse);
        }
      } else {
        console.log(chalk.cyan('📝 Extension uploaded but not published (set AUTO_PUBLISH=true to auto-publish)'));
        console.log(chalk.cyan('🌐 Visit Chrome Web Store Developer Dashboard to manually publish'));
      }

      // Log success details
      const packageJson = await fs.readJson('package.json');
      console.log(chalk.green('\n🎉 Publishing completed!'));
      console.log(chalk.cyan(`📦 Version: ${packageJson.version}`));
      console.log(chalk.cyan(`🆔 Extension ID: ${process.env.CHROME_EXTENSION_ID}`));
      console.log(chalk.cyan(`🔗 Store URL: https://chrome.google.com/webstore/detail/${process.env.CHROME_EXTENSION_ID}`));

    } else {
      throw new Error(`Upload failed: ${uploadResponse.uploadState}`);
    }

  } catch (error) {
    console.error(chalk.red('❌ Publishing failed:'), error.message);
    
    if (error.message.includes('Invalid refresh token')) {
      console.log(chalk.yellow('\n💡 Refresh token might be expired. Please regenerate it:'));
      console.log(chalk.cyan('1. Go to Google Cloud Console'));
      console.log(chalk.cyan('2. Navigate to APIs & Services > Credentials'));
      console.log(chalk.cyan('3. Generate new refresh token'));
      console.log(chalk.cyan('4. Update CHROME_REFRESH_TOKEN in .env file'));
    }
    
    process.exit(1);
  }
}

function validateEnvironment() {
  const required = [
    'CHROME_EXTENSION_ID',
    'CHROME_CLIENT_ID', 
    'CHROME_CLIENT_SECRET',
    'CHROME_REFRESH_TOKEN'
  ];

  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error(chalk.red('❌ Missing required environment variables:'));
    missing.forEach(env => {
      console.error(chalk.red(`   - ${env}`));
    });
    console.log(chalk.yellow('\n💡 Create a .env file with the following variables:'));
    console.log(chalk.cyan('CHROME_EXTENSION_ID=your_extension_id'));
    console.log(chalk.cyan('CHROME_CLIENT_ID=your_client_id'));
    console.log(chalk.cyan('CHROME_CLIENT_SECRET=your_client_secret'));
    console.log(chalk.cyan('CHROME_REFRESH_TOKEN=your_refresh_token'));
    console.log(chalk.cyan('AUTO_PUBLISH=false  # Set to true for automatic publishing'));
    
    throw new Error('Missing environment variables');
  }

  console.log(chalk.green('✅ Environment validation passed'));
}

// Run publish if called directly
if (require.main === module) {
  publish();
}

module.exports = { publish }; 