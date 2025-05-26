#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

console.log(chalk.blue('🔍 Validating AdNull Extension...'));

async function validate() {
  try {
    const results = {
      structure: await validateStructure(),
      manifest: await validateManifest(),
      content: await validateContent(),
      permissions: await validatePermissions(),
      size: await validateSize()
    };

    // Summary
    const passed = Object.values(results).every(result => result.passed);
    
    console.log(chalk.blue('\n📊 Validation Summary:'));
    Object.entries(results).forEach(([category, result]) => {
      const icon = result.passed ? '✅' : '❌';
      const color = result.passed ? 'green' : 'red';
      console.log(chalk[color](`${icon} ${category}: ${result.message}`));
      
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          console.log(chalk.yellow(`   ⚠️  ${warning}`));
        });
      }
    });

    if (passed) {
      console.log(chalk.green('\n🎉 All validations passed! Extension is ready for publishing.'));
    } else {
      console.log(chalk.red('\n❌ Some validations failed. Please fix the issues before publishing.'));
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red('❌ Validation failed:'), error.message);
    process.exit(1);
  }
}

async function validateStructure() {
  const requiredFiles = [
    'manifest.json',
    'content.js',
    'modules/config.js',
    'modules/logger.js',
    'modules/storage.js',
    'modules/adSkipper.js',
    'popup/popup.html',
    'popup/popup.js',
    'popup/popup.css'
  ];

  const missingFiles = [];
  const warnings = [];

  for (const file of requiredFiles) {
    const filePath = path.join(SRC_DIR, file);
    if (!await fs.pathExists(filePath)) {
      missingFiles.push(file);
    }
  }

  // Check for optional but recommended files
  const optionalFiles = [
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png'
  ];

  for (const file of optionalFiles) {
    const filePath = path.join(SRC_DIR, file);
    if (!await fs.pathExists(filePath)) {
      warnings.push(`Optional file missing: ${file}`);
    }
  }

  return {
    passed: missingFiles.length === 0,
    message: missingFiles.length === 0 ? 'All required files present' : `Missing files: ${missingFiles.join(', ')}`,
    warnings
  };
}

async function validateManifest() {
  const manifestPath = path.join(SRC_DIR, 'manifest.json');
  
  if (!await fs.pathExists(manifestPath)) {
    return {
      passed: false,
      message: 'manifest.json not found'
    };
  }

  const manifest = await fs.readJson(manifestPath);
  const warnings = [];
  const errors = [];

  // Required fields
  const requiredFields = ['name', 'version', 'description', 'manifest_version'];
  requiredFields.forEach(field => {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Version format
  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    errors.push('Version must be in format x.y.z');
  }

  // Manifest version
  if (manifest.manifest_version === 2) {
    warnings.push('Using Manifest V2 (consider upgrading to V3)');
  } else if (manifest.manifest_version !== 3) {
    errors.push('Invalid manifest_version (should be 2 or 3)');
  }

  // Permissions
  if (!manifest.permissions || manifest.permissions.length === 0) {
    warnings.push('No permissions specified');
  }

  // Content scripts
  if (!manifest.content_scripts || manifest.content_scripts.length === 0) {
    errors.push('No content scripts specified');
  }

  return {
    passed: errors.length === 0,
    message: errors.length === 0 ? 'Manifest validation passed' : `Manifest errors: ${errors.join(', ')}`,
    warnings
  };
}

async function validateContent() {
  const contentPath = path.join(SRC_DIR, 'content.js');
  
  if (!await fs.pathExists(contentPath)) {
    return {
      passed: false,
      message: 'content.js not found'
    };
  }

  const content = await fs.readFile(contentPath, 'utf8');
  const warnings = [];
  const errors = [];

  // Check for required modules
  const requiredModules = ['AdNullConfig', 'AdNullLogger', 'AdNullStorage', 'AdNullSkipper'];
  requiredModules.forEach(module => {
    if (!content.includes(module)) {
      warnings.push(`Module ${module} not referenced in content script`);
    }
  });

  // Check for initialization
  if (!content.includes('initializeExtension')) {
    errors.push('No initialization function found');
  }

  // Check for global functions
  const globalFunctions = ['adnullSkipAds', 'adnullDebug', 'adnullStatus'];
  globalFunctions.forEach(func => {
    if (!content.includes(func)) {
      warnings.push(`Global function ${func} not found`);
    }
  });

  return {
    passed: errors.length === 0,
    message: errors.length === 0 ? 'Content script validation passed' : `Content errors: ${errors.join(', ')}`,
    warnings
  };
}

async function validatePermissions() {
  const manifestPath = path.join(SRC_DIR, 'manifest.json');
  const manifest = await fs.readJson(manifestPath);
  
  const warnings = [];
  const errors = [];

  // Check for required permissions
  const requiredPermissions = ['activeTab', 'storage'];
  const permissions = manifest.permissions || [];
  
  requiredPermissions.forEach(perm => {
    if (!permissions.includes(perm)) {
      errors.push(`Missing required permission: ${perm}`);
    }
  });

  // Check host permissions for Manifest V3
  if (manifest.manifest_version === 3) {
    const hostPermissions = manifest.host_permissions || [];
    if (!hostPermissions.some(host => host.includes('youtube.com'))) {
      errors.push('Missing YouTube host permission');
    }
  } else {
    // Check content script matches for Manifest V2
    const contentScripts = manifest.content_scripts || [];
    if (!contentScripts.some(script => 
      script.matches && script.matches.some(match => match.includes('youtube.com'))
    )) {
      errors.push('Missing YouTube match pattern in content scripts');
    }
  }

  return {
    passed: errors.length === 0,
    message: errors.length === 0 ? 'Permissions validation passed' : `Permission errors: ${errors.join(', ')}`,
    warnings
  };
}

async function validateSize() {
  const warnings = [];
  let totalSize = 0;

  // Calculate total size
  async function calculateDirSize(dir) {
    if (!await fs.pathExists(dir)) return 0;
    
    const items = await fs.readdir(dir);
    let size = 0;
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        size += await calculateDirSize(itemPath);
      } else {
        size += stats.size;
      }
    }
    
    return size;
  }

  totalSize = await calculateDirSize(SRC_DIR);
  const sizeInMB = totalSize / 1024 / 1024;

  // Chrome Web Store limits
  if (sizeInMB > 128) {
    return {
      passed: false,
      message: `Extension too large: ${sizeInMB.toFixed(2)}MB (max 128MB)`
    };
  }

  if (sizeInMB > 50) {
    warnings.push(`Extension is quite large: ${sizeInMB.toFixed(2)}MB`);
  }

  return {
    passed: true,
    message: `Size validation passed: ${sizeInMB.toFixed(2)}MB`,
    warnings
  };
}

// Run validation if called directly
if (require.main === module) {
  validate();
}

module.exports = { validate }; 