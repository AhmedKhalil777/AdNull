#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const BUILD_DIR = 'dist';

console.log(chalk.blue('🧪 Testing AdNull Extension...'));

async function test() {
  try {
    const results = {
      buildExists: await testBuildExists(),
      manifestValid: await testManifestValid(),
      modulesLoaded: await testModulesLoaded(),
      functionsExist: await testFunctionsExist()
    };

    // Summary
    const passed = Object.values(results).every(result => result.passed);
    
    console.log(chalk.blue('\n📊 Test Summary:'));
    Object.entries(results).forEach(([category, result]) => {
      const icon = result.passed ? '✅' : '❌';
      const color = result.passed ? 'green' : 'red';
      console.log(chalk[color](`${icon} ${category}: ${result.message}`));
    });

    if (passed) {
      console.log(chalk.green('\n🎉 All tests passed! Extension is working correctly.'));
    } else {
      console.log(chalk.red('\n❌ Some tests failed. Please check the extension.'));
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red('❌ Testing failed:'), error.message);
    process.exit(1);
  }
}

async function testBuildExists() {
  const buildExists = await fs.pathExists(BUILD_DIR);
  const manifestExists = await fs.pathExists(path.join(BUILD_DIR, 'manifest.json'));
  const contentExists = await fs.pathExists(path.join(BUILD_DIR, 'content.js'));
  
  return {
    passed: buildExists && manifestExists && contentExists,
    message: buildExists && manifestExists && contentExists ? 
      'Build directory and core files exist' : 
      'Missing build files'
  };
}

async function testManifestValid() {
  try {
    const manifestPath = path.join(BUILD_DIR, 'manifest.json');
    if (!await fs.pathExists(manifestPath)) {
      return { passed: false, message: 'Manifest not found' };
    }

    const manifest = await fs.readJson(manifestPath);
    const hasRequiredFields = manifest.name && manifest.version && manifest.description;
    
    return {
      passed: hasRequiredFields,
      message: hasRequiredFields ? 'Manifest has required fields' : 'Manifest missing required fields'
    };
  } catch (error) {
    return { passed: false, message: 'Manifest parsing failed' };
  }
}

async function testModulesLoaded() {
  try {
    const modulePaths = [
      'modules/config.js',
      'modules/logger.js', 
      'modules/storage.js',
      'modules/adSkipper.js'
    ];

    let allExist = true;
    for (const modulePath of modulePaths) {
      const fullPath = path.join(BUILD_DIR, modulePath);
      if (!await fs.pathExists(fullPath)) {
        allExist = false;
        break;
      }
    }

    return {
      passed: allExist,
      message: allExist ? 'All modules present' : 'Some modules missing'
    };
  } catch (error) {
    return { passed: false, message: 'Module check failed' };
  }
}

async function testFunctionsExist() {
  try {
    const contentPath = path.join(BUILD_DIR, 'content.js');
    if (!await fs.pathExists(contentPath)) {
      return { passed: false, message: 'Content script not found' };
    }

    const content = await fs.readFile(contentPath, 'utf8');
    const requiredFunctions = [
      'adnullSkipAds',
      'adnullDebug', 
      'adnullStatus',
      'adnullAggressiveSkip',
      'adnullTestStrategies'
    ];

    const missingFunctions = requiredFunctions.filter(func => !content.includes(func));
    
    return {
      passed: missingFunctions.length === 0,
      message: missingFunctions.length === 0 ? 
        'All required functions present' : 
        `Missing functions: ${missingFunctions.join(', ')}`
    };
  } catch (error) {
    return { passed: false, message: 'Function check failed' };
  }
}

// Run test if called directly
if (require.main === module) {
  test();
}

module.exports = { test }; 