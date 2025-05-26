#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const BUILD_DIR = 'dist';
const SRC_DIR = 'src';

console.log(chalk.blue('🔨 Building AdNull Extension...'));

async function build() {
  try {
    // Clean previous build
    console.log(chalk.yellow('🧹 Cleaning previous build...'));
    await fs.remove(BUILD_DIR);
    await fs.ensureDir(BUILD_DIR);

    // Copy source files
    console.log(chalk.yellow('📁 Copying source files...'));
    await fs.copy(SRC_DIR, BUILD_DIR);

    // Update manifest version
    console.log(chalk.yellow('📝 Updating manifest version...'));
    const packageJson = await fs.readJson('package.json');
    const manifestPath = path.join(BUILD_DIR, 'manifest.json');
    const manifest = await fs.readJson(manifestPath);
    
    manifest.version = packageJson.version;
    manifest.name = packageJson.extensionInfo.name;
    manifest.description = packageJson.extensionInfo.description;
    
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });

    // Validate manifest
    console.log(chalk.yellow('✅ Validating manifest...'));
    validateManifest(manifest);

    // Copy additional files
    console.log(chalk.yellow('📄 Copying additional files...'));
    const additionalFiles = [
      'README.md',
      'LICENSE',
      'ARABIC-SUPPORT.md',
      'AD-TROUBLESHOOTING.md'
    ];

    for (const file of additionalFiles) {
      if (await fs.pathExists(file)) {
        await fs.copy(file, path.join(BUILD_DIR, file));
      }
    }

    // Create build info
    const buildInfo = {
      version: packageJson.version,
      buildDate: new Date().toISOString(),
      buildNumber: Date.now(),
      features: [
        'Enhanced skip strategies',
        'Arabic language support',
        'Multilingual support (10+ languages)',
        'Real-time ad monitoring',
        'Aggressive retry logic',
        'Multiple click methods'
      ]
    };

    await fs.writeJson(path.join(BUILD_DIR, 'build-info.json'), buildInfo, { spaces: 2 });

    console.log(chalk.green('✅ Build completed successfully!'));
    console.log(chalk.cyan(`📦 Build output: ${BUILD_DIR}/`));
    console.log(chalk.cyan(`🏷️  Version: ${packageJson.version}`));
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error.message);
    process.exit(1);
  }
}

function validateManifest(manifest) {
  const required = ['name', 'version', 'description', 'manifest_version'];
  const missing = required.filter(field => !manifest[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required manifest fields: ${missing.join(', ')}`);
  }

  if (manifest.manifest_version !== 3) {
    console.warn(chalk.yellow('⚠️  Warning: Using Manifest V2. Consider upgrading to V3.'));
  }

  console.log(chalk.green('✅ Manifest validation passed'));
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build }; 