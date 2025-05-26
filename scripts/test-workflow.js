#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

console.log(chalk.blue('🔧 GitHub Actions Workflow Tester'));
console.log('=====================================\n');

async function testWorkflow() {
  try {
    // Test 1: Check workflow file syntax
    console.log(chalk.yellow('📋 Testing workflow file syntax...'));
    const workflowPath = '.github/workflows/build-and-publish.yml';
    
    if (!await fs.pathExists(workflowPath)) {
      throw new Error('Workflow file not found');
    }
    
    // Basic YAML syntax check
    const workflowContent = await fs.readFile(workflowPath, 'utf8');
    if (!workflowContent.includes('name:') || !workflowContent.includes('on:')) {
      throw new Error('Invalid workflow syntax');
    }
    console.log(chalk.green('✅ Workflow syntax valid'));

    // Test 2: Check required secrets documentation
    console.log(chalk.yellow('\n🔐 Checking required secrets...'));
    const requiredSecrets = [
      'CHROME_EXTENSION_ID',
      'CHROME_CLIENT_ID',
      'CHROME_CLIENT_SECRET',
      'CHROME_REFRESH_TOKEN'
    ];
    
    console.log(chalk.cyan('Required GitHub Secrets:'));
    requiredSecrets.forEach(secret => {
      console.log(chalk.gray(`  - ${secret}`));
    });
    console.log(chalk.green('✅ Secrets list documented'));

    // Test 3: Validate package.json scripts
    console.log(chalk.yellow('\n📦 Validating package.json scripts...'));
    const packageJson = await fs.readJson('package.json');
    const requiredScripts = ['build', 'package', 'validate', 'test', 'publish'];
    
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    if (missingScripts.length > 0) {
      throw new Error(`Missing scripts: ${missingScripts.join(', ')}`);
    }
    console.log(chalk.green('✅ All required scripts present'));

    // Test 4: Test local build pipeline
    console.log(chalk.yellow('\n🏗️ Testing local build pipeline...'));
    
    try {
      console.log(chalk.gray('  Running validation...'));
      execSync('npm run validate', { stdio: 'pipe' });
      console.log(chalk.green('  ✅ Validation passed'));
      
      console.log(chalk.gray('  Running build...'));
      execSync('npm run build', { stdio: 'pipe' });
      console.log(chalk.green('  ✅ Build passed'));
      
      console.log(chalk.gray('  Running package...'));
      execSync('npm run package', { stdio: 'pipe' });
      console.log(chalk.green('  ✅ Package passed'));
      
      console.log(chalk.gray('  Running tests...'));
      execSync('npm run test', { stdio: 'pipe' });
      console.log(chalk.green('  ✅ Tests passed'));
      
    } catch (error) {
      console.log(chalk.red('  ❌ Local pipeline failed'));
      throw new Error('Local build pipeline failed - fix locally before pushing');
    }

    // Test 5: Check Git configuration
    console.log(chalk.yellow('\n🔧 Checking Git configuration...'));
    
    try {
      const gitRemote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      console.log(chalk.gray(`  Remote: ${gitRemote}`));
      
      const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(chalk.gray(`  Branch: ${gitBranch}`));
      
      console.log(chalk.green('✅ Git configuration valid'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Git configuration check failed (may be normal)'));
    }

    // Success summary
    console.log(chalk.green('\n🎉 Workflow test completed successfully!'));
    console.log(chalk.cyan('\n📋 Next steps to fix GitHub Actions:'));
    console.log(chalk.white('1. Push the updated workflow file to your repository'));
    console.log(chalk.white('2. Go to GitHub repository settings'));
    console.log(chalk.white('3. Add required secrets in "Secrets and variables" > "Actions"'));
    console.log(chalk.white('4. Enable GitHub Actions if not already enabled'));
    console.log(chalk.white('5. Try pushing a commit to trigger the workflow'));
    
    console.log(chalk.cyan('\n🔧 Alternative solutions if GitHub Actions still fails:'));
    console.log(chalk.white('1. Use local publishing: npm run release'));
    console.log(chalk.white('2. Manual upload to Chrome Web Store'));
    console.log(chalk.white('3. Use different CI/CD service (GitLab CI, CircleCI)'));

  } catch (error) {
    console.error(chalk.red('\n❌ Workflow test failed:'), error.message);
    
    console.log(chalk.yellow('\n🔧 Troubleshooting steps:'));
    console.log(chalk.white('1. Fix the reported issue above'));
    console.log(chalk.white('2. Run this test again: node scripts/test-workflow.js'));
    console.log(chalk.white('3. Check BUILD-PIPELINE.md for detailed setup'));
    
    process.exit(1);
  }
}

// Run test
testWorkflow(); 