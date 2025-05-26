#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');

const BUILD_DIR = 'dist';
const PACKAGE_DIR = 'packages';

console.log(chalk.blue('📦 Packaging AdNull Extension...'));

async function package() {
  try {
    // Ensure build exists
    if (!await fs.pathExists(BUILD_DIR)) {
      console.log(chalk.yellow('🔨 Build not found, running build first...'));
      const { build } = require('./build.js');
      await build();
    }

    // Ensure package directory exists
    await fs.ensureDir(PACKAGE_DIR);

    // Get version from package.json
    const packageJson = await fs.readJson('package.json');
    const version = packageJson.version;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    
    const zipFileName = `adnull-v${version}-${timestamp}.zip`;
    const zipPath = path.join(PACKAGE_DIR, zipFileName);

    console.log(chalk.yellow(`📁 Creating package: ${zipFileName}`));

    // Create ZIP archive
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archive events
    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(chalk.green('✅ Package created successfully!'));
      console.log(chalk.cyan(`📦 File: ${zipPath}`));
      console.log(chalk.cyan(`📏 Size: ${sizeInMB} MB`));
      console.log(chalk.cyan(`🗂️  Files: ${archive.pointer()} bytes`));
      
      // Create latest symlink/copy
      const latestPath = path.join(PACKAGE_DIR, 'adnull-latest.zip');
      fs.copy(zipPath, latestPath).then(() => {
        console.log(chalk.cyan(`🔗 Latest: ${latestPath}`));
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(chalk.yellow('⚠️  Warning:'), err.message);
      } else {
        throw err;
      }
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add files to archive
    console.log(chalk.yellow('📁 Adding files to archive...'));
    
    // Add all files from build directory
    archive.directory(BUILD_DIR, false);

    // Finalize the archive
    await archive.finalize();

    // Validate the package
    await validatePackage(zipPath);

  } catch (error) {
    console.error(chalk.red('❌ Packaging failed:'), error.message);
    process.exit(1);
  }
}

async function validatePackage(zipPath) {
  console.log(chalk.yellow('✅ Validating package...'));
  
  const stats = await fs.stat(zipPath);
  const sizeInMB = stats.size / 1024 / 1024;
  
  // Chrome Web Store has a 128MB limit
  if (sizeInMB > 128) {
    throw new Error(`Package too large: ${sizeInMB.toFixed(2)}MB (max 128MB)`);
  }
  
  // Check if package is too small (might indicate missing files)
  if (sizeInMB < 0.01) {
    throw new Error(`Package too small: ${sizeInMB.toFixed(2)}MB (might be missing files)`);
  }
  
  console.log(chalk.green('✅ Package validation passed'));
}

// Run package if called directly
if (require.main === module) {
  package();
}

module.exports = { package }; 