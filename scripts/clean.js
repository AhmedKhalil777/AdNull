#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const CLEAN_DIRS = ['dist', 'packages', 'node_modules/.cache'];
const CLEAN_FILES = ['*.log', '*.tmp'];

console.log(chalk.blue('🧹 Cleaning AdNull Extension build artifacts...'));

async function clean() {
  try {
    let cleaned = 0;

    // Clean directories
    for (const dir of CLEAN_DIRS) {
      if (await fs.pathExists(dir)) {
        console.log(chalk.yellow(`🗂️  Removing directory: ${dir}`));
        await fs.remove(dir);
        cleaned++;
      }
    }

    // Clean specific files
    for (const pattern of CLEAN_FILES) {
      const files = await findFiles(pattern);
      for (const file of files) {
        console.log(chalk.yellow(`🗑️  Removing file: ${file}`));
        await fs.remove(file);
        cleaned++;
      }
    }

    if (cleaned === 0) {
      console.log(chalk.green('✨ Already clean! No artifacts to remove.'));
    } else {
      console.log(chalk.green(`✅ Cleaned ${cleaned} items successfully!`));
    }

  } catch (error) {
    console.error(chalk.red('❌ Clean failed:'), error.message);
    process.exit(1);
  }
}

async function findFiles(pattern) {
  const files = [];
  
  try {
    const items = await fs.readdir('.');
    
    for (const item of items) {
      const stats = await fs.stat(item);
      if (stats.isFile() && matchesPattern(item, pattern)) {
        files.push(item);
      }
    }
  } catch (error) {
    // Directory might not exist, ignore
  }
  
  return files;
}

function matchesPattern(filename, pattern) {
  // Simple glob pattern matching
  const regex = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*');
  
  return new RegExp(`^${regex}$`).test(filename);
}

// Run clean if called directly
if (require.main === module) {
  clean();
}

module.exports = { clean }; 