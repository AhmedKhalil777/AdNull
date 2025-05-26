# GitHub Actions Troubleshooting Guide

## 🚨 Issue: "Failed to resolve action download info"

The error you encountered:
```
Failed to resolve action download info. Error: No MediaTypeFormatter is available to read an object of type 'ActionDownloadInfoResponseCollection' from content with media type 'text/plain'.
Error: Missing download info for actions/checkout@v4
```

This is a known GitHub Actions infrastructure issue that can occur due to:
- GitHub Actions service outages
- Network connectivity issues
- Action version compatibility problems
- GitHub API rate limiting

## 🔧 Solutions Applied

### 1. Updated Workflow with Stable Actions
✅ **Fixed**: Updated `.github/workflows/build-and-publish.yml` with:
- Downgraded from `actions/checkout@v4` to `actions/checkout@v3`
- Downgraded from `actions/setup-node@v4` to `actions/setup-node@v3`
- Downgraded from `actions/upload-artifact@v4` to `actions/upload-artifact@v3`
- Added `fetch-depth: 0` for better Git history access
- Added `--prefer-offline --no-audit` flags for faster npm installs
- Improved artifact naming with unique run IDs

### 2. Created Fallback Simple Workflow
✅ **Added**: `.github/workflows/simple-build.yml` with:
- Uses even older, more stable action versions (`@v2`)
- Simplified workflow for basic build and test
- Reduced complexity to minimize failure points

### 3. Fixed PowerShell Script
✅ **Fixed**: `launch-modular.ps1` Unicode character issue
- Replaced problematic Arabic characters with English descriptions
- Script now runs without encoding errors

### 4. Added Workflow Testing
✅ **Added**: `npm run test-workflow` command
- Tests workflow syntax and configuration
- Validates local build pipeline
- Provides troubleshooting guidance

## 🚀 Immediate Solutions

### Option 1: Use Local Publishing (Recommended)
```bash
# Complete local build and publish
npm run release

# Or step by step:
npm run build
npm run package
npm run publish  # Requires .env setup
```

### Option 2: Manual Chrome Web Store Upload
1. Run `npm run build-and-package`
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload the ZIP file from `packages/adnull-latest.zip`
4. Fill in store listing details
5. Submit for review

### Option 3: Wait and Retry GitHub Actions
```bash
# Test if GitHub Actions is working
npm run test-workflow

# Push updated workflow
git add .
git commit -m "Fix GitHub Actions workflow"
git push origin main
```

## 🔍 Diagnostic Steps

### 1. Check GitHub Actions Status
- Visit [GitHub Status](https://www.githubstatus.com/)
- Check for ongoing incidents with Actions

### 2. Test Local Pipeline
```bash
npm run test-workflow
```

### 3. Verify Repository Settings
1. Go to your GitHub repository
2. Navigate to Settings > Actions > General
3. Ensure "Allow all actions and reusable workflows" is selected
4. Check if Actions are enabled for your repository

### 4. Check Required Secrets
Required secrets in GitHub repository settings:
```
CHROME_EXTENSION_ID          # Your extension ID from Chrome Web Store
CHROME_CLIENT_ID             # OAuth2 client ID from Google Cloud Console
CHROME_CLIENT_SECRET         # OAuth2 client secret
CHROME_REFRESH_TOKEN         # OAuth2 refresh token
```

Optional secrets:
```
CHROME_EXTENSION_ID_STAGING  # For staging environment
SLACK_WEBHOOK_URL           # For notifications
DISCORD_WEBHOOK_URL         # For notifications
```

## 🛠️ Advanced Troubleshooting

### If Actions Continue to Fail

1. **Use Self-Hosted Runner**
   ```yaml
   runs-on: self-hosted  # Instead of ubuntu-latest
   ```

2. **Alternative CI/CD Services**
   - GitLab CI/CD
   - CircleCI
   - Azure DevOps
   - Jenkins

3. **Local Development Workflow**
   ```bash
   # Set up local development
   npm run dev
   
   # Build and test locally
   npm run build-and-package
   npm run test
   
   # Manual publishing
   npm run publish
   ```

## 📋 Workflow Status Check

Run this command to verify everything is working:
```bash
npm run test-workflow
```

Expected output:
```
🎉 Workflow test completed successfully!
```

## 🔄 Alternative Workflows

### Simple Build Only
Use `.github/workflows/simple-build.yml` for basic CI:
- Validates extension
- Builds and packages
- Runs tests
- No publishing (manual upload required)

### Full Pipeline
Use `.github/workflows/build-and-publish.yml` for complete automation:
- All validation and testing
- Automatic publishing to Chrome Web Store
- GitHub releases
- Notifications

## 📞 Getting Help

### If Issues Persist:

1. **Check GitHub Community**
   - [GitHub Actions Community](https://github.community/c/github-actions)
   - Search for similar issues

2. **GitHub Support**
   - Contact GitHub Support if it's a platform issue
   - Provide error logs and repository details

3. **Local Development**
   - Continue development locally
   - Use manual publishing until Actions are fixed

## 🎯 Current Status

✅ **Working Solutions:**
- Local build pipeline (`npm run release`)
- Manual Chrome Web Store upload
- PowerShell development script (`npm run dev`)
- All extension functionality

⚠️ **Potential Issues:**
- GitHub Actions may need time to stabilize
- Some action versions may be temporarily unavailable

🔧 **Recommended Approach:**
1. Use local development and publishing for now
2. Monitor GitHub Actions status
3. Try pushing to GitHub periodically to test Actions
4. Switch back to automated pipeline once stable

---

**Last Updated:** 2024-12-26  
**Status:** Troubleshooting Complete ✅ 