# AdNull Extension - Build & Publishing Pipeline

## 🚀 Overview

This document describes the automated build and publishing pipeline for the AdNull YouTube ad blocker extension. The pipeline handles building, packaging, validation, and publishing to the Chrome Web Store.

## 📁 Pipeline Structure

```
AdNull/
├── scripts/                 # Build pipeline scripts
│   ├── build.js            # Main build script
│   ├── package.js          # ZIP packaging script
│   ├── publish.js          # Chrome Web Store publishing
│   ├── validate.js         # Extension validation
│   └── clean.js            # Clean build artifacts
├── .github/workflows/      # GitHub Actions CI/CD
│   └── build-and-publish.yml
├── package.json            # NPM configuration & scripts
├── env.example             # Environment variables template
└── dist/                   # Build output (generated)
    └── packages/           # ZIP packages (generated)
```

## 🛠️ Available Scripts

### Local Development

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Package into ZIP
npm run package

# Build and package in one command
npm run build-and-package

# Validate extension
npm run validate

# Clean build artifacts
npm run clean

# Run development server
npm run dev
```

### Publishing

```bash
# Publish to Chrome Web Store (requires .env setup)
npm run publish

# Complete release pipeline
npm run release
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Chrome Web Store API

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Chrome Web Store API

2. **Create OAuth2 Credentials:**
   - Go to APIs & Services > Credentials
   - Create OAuth2 Client ID (Desktop application)
   - Note down Client ID and Client Secret

3. **Generate Refresh Token:**
   ```bash
   # Use Google OAuth2 Playground or custom script
   # Scope: https://www.googleapis.com/auth/chromewebstore
   ```

4. **Get Extension ID:**
   - Upload extension manually to Chrome Web Store first
   - Note the extension ID from the URL

5. **Create Environment File:**
   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

### 3. Environment Variables

Create `.env` file with:

```env
CHROME_EXTENSION_ID=your_extension_id_here
CHROME_CLIENT_ID=your_client_id_here
CHROME_CLIENT_SECRET=your_client_secret_here
CHROME_REFRESH_TOKEN=your_refresh_token_here
AUTO_PUBLISH=false
```

## 🏗️ Build Process

### 1. Validation (`npm run validate`)

Checks:
- ✅ File structure completeness
- ✅ Manifest.json validity
- ✅ Content script integrity
- ✅ Permissions configuration
- ✅ Extension size limits

### 2. Build (`npm run build`)

Process:
1. 🧹 Clean previous build
2. 📁 Copy source files to `dist/`
3. 📝 Update manifest version from package.json
4. ✅ Validate manifest
5. 📄 Copy documentation files
6. 📊 Generate build info

### 3. Package (`npm run package`)

Process:
1. 📦 Create ZIP archive with maximum compression
2. 📏 Validate package size (< 128MB Chrome limit)
3. 🔗 Create `adnull-latest.zip` symlink
4. 📊 Display package statistics

### 4. Publish (`npm run publish`)

Process:
1. 🔐 Validate environment credentials
2. 📤 Upload ZIP to Chrome Web Store
3. 🌐 Optionally publish (if AUTO_PUBLISH=true)
4. 📊 Display success information

## 🤖 GitHub Actions CI/CD

### Workflow Triggers

- **Push to main/master:** Validates and builds
- **Tags (v*):** Full release pipeline
- **Pull Requests:** Validation and testing
- **Manual Dispatch:** On-demand publishing

### Pipeline Stages

1. **Validate** - Extension validation
2. **Build** - Build and package extension
3. **Test** - Run automated tests
4. **Publish Staging** - Deploy to staging environment
5. **Publish Production** - Deploy to Chrome Web Store
6. **Notify** - Send success notifications

### Required GitHub Secrets

```
CHROME_EXTENSION_ID          # Production extension ID
CHROME_EXTENSION_ID_STAGING  # Staging extension ID
CHROME_CLIENT_ID             # OAuth2 client ID
CHROME_CLIENT_SECRET         # OAuth2 client secret
CHROME_REFRESH_TOKEN         # OAuth2 refresh token
SLACK_WEBHOOK_URL           # Optional: Slack notifications
DISCORD_WEBHOOK_URL         # Optional: Discord notifications
```

## 📋 Release Process

### Automated Release (Recommended)

1. **Update version in package.json:**
   ```bash
   npm version patch  # 1.0.3 -> 1.0.4
   npm version minor  # 1.0.3 -> 1.1.0
   npm version major  # 1.0.3 -> 2.0.0
   ```

2. **Push tag to trigger release:**
   ```bash
   git push origin --tags
   ```

3. **GitHub Actions will:**
   - ✅ Validate extension
   - 🏗️ Build and package
   - 🧪 Run tests
   - 🚀 Publish to Chrome Web Store
   - 📦 Create GitHub release
   - 📢 Send notifications

### Manual Release

1. **Build locally:**
   ```bash
   npm run build-and-package
   ```

2. **Validate:**
   ```bash
   npm run validate
   ```

3. **Publish:**
   ```bash
   npm run publish
   ```

## 🔍 Validation Checks

### Structure Validation
- ✅ Required files present
- ✅ Module dependencies
- ✅ Icon files (optional)

### Manifest Validation
- ✅ Required fields (name, version, description)
- ✅ Version format (x.y.z)
- ✅ Manifest version compatibility
- ✅ Permissions configuration

### Content Validation
- ✅ Module references
- ✅ Initialization functions
- ✅ Global debugging functions

### Size Validation
- ✅ Under Chrome Web Store limit (128MB)
- ⚠️ Warning if over 50MB

## 🐛 Troubleshooting

### Build Issues

**Error: Missing required files**
```bash
# Check file structure
ls -la src/
# Ensure all required files exist
```

**Error: Manifest validation failed**
```bash
# Check manifest.json syntax
cat src/manifest.json | jq .
# Validate against Chrome extension schema
```

### Publishing Issues

**Error: Invalid refresh token**
```bash
# Regenerate refresh token using OAuth2 playground
# Update CHROME_REFRESH_TOKEN in .env
```

**Error: Extension ID not found**
```bash
# Verify CHROME_EXTENSION_ID in .env
# Check Chrome Web Store Developer Dashboard
```

**Error: Package too large**
```bash
# Check package size
npm run validate
# Remove unnecessary files from src/
```

### GitHub Actions Issues

**Error: Secrets not configured**
- Go to GitHub repository settings
- Add required secrets in Secrets and variables > Actions

**Error: Workflow permissions**
- Ensure repository has Actions enabled
- Check workflow permissions in repository settings

## 📊 Pipeline Metrics

### Build Performance
- **Validation:** ~10-30 seconds
- **Build:** ~5-15 seconds  
- **Package:** ~2-5 seconds
- **Publish:** ~30-60 seconds

### Package Size
- **Source:** ~50-100KB
- **Built:** ~60-120KB
- **Compressed:** ~20-40KB

## 🔄 Version Management

### Semantic Versioning
- **MAJOR:** Breaking changes
- **MINOR:** New features, backward compatible
- **PATCH:** Bug fixes, backward compatible

### Current Version: 1.0.3
- Enhanced skip strategies
- Arabic language support
- Improved debugging tools

### Upcoming Features
- Manifest V3 migration
- Additional language support
- Performance optimizations

## 📞 Support

For pipeline issues:
1. Check this documentation
2. Review GitHub Actions logs
3. Validate environment configuration
4. Test locally before pushing

## 🎯 Best Practices

1. **Always validate before publishing**
2. **Test locally first**
3. **Use semantic versioning**
4. **Keep environment secrets secure**
5. **Monitor build logs**
6. **Update documentation with changes**

---

**Pipeline Status:** ✅ Active and Maintained
**Last Updated:** 2024-12-26
**Version:** 1.0.3 