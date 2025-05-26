# Installation Guide

## 🚀 Installing AdNull YouTube Ad Blocker

This guide will walk you through installing the AdNull extension in Chrome and other Chromium-based browsers.

### 📋 Prerequisites

- **Chrome 88+** or Chromium-based browser (Edge, Brave, Opera, etc.)
- **Developer mode** access (for unpacked extension installation)
- **Basic file management** skills

### 📥 Download Options

#### Option 1: Clone from Repository
```bash
git clone https://github.com/yourusername/AdNull.git
cd AdNull
```

#### Option 2: Download ZIP
1. Download the extension files as a ZIP archive
2. Extract to a folder (e.g., `C:\AdNull` or `~/AdNull`)
3. Remember the folder location

### 🔧 Installation Steps

#### Step 1: Enable Developer Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **"Developer mode"** in the top-right corner
3. You should see additional options appear

#### Step 2: Load the Extension
1. Click **"Load unpacked"** button
2. Navigate to the AdNull folder
3. Select the folder containing `manifest.json`
4. Click **"Select Folder"** or **"Open"**

#### Step 3: Verify Installation
1. The extension should appear in your extensions list
2. Look for "AdNull - YouTube Ad Blocker" with a toggle switch
3. Ensure the toggle is **ON** (blue/enabled)

#### Step 4: Pin the Extension (Optional)
1. Click the puzzle piece icon (🧩) in Chrome toolbar
2. Find "AdNull - YouTube Ad Blocker"
3. Click the pin icon (📌) to keep it visible

### ✅ Verification

#### Test the Extension
1. Navigate to [YouTube.com](https://youtube.com)
2. Click the AdNull icon in your toolbar
3. You should see the popup with statistics and settings
4. Try watching a video to test ad blocking

#### Check Console (Advanced)
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Look for `[AdNull]` messages indicating the extension is active

### ⚙️ Initial Configuration

#### Recommended Settings
- ✅ **Block Video Ads**: Enabled (default)
- ✅ **Block Sidebar Ads**: Enabled (default)
- ✅ **Auto Skip**: Enabled (default)
- ⚠️ **Block Shorts Ads**: Test carefully
- ⚠️ **Speed Up Ads**: Use with caution
- ✅ **Block Tracking**: Enabled (default)

#### Safety Mode (If Issues Occur)
If you experience content removal issues:
1. Open the extension popup
2. Enable **"Safety Mode"** if available
3. This uses ultra-conservative ad detection

### 🔄 Updates

#### Manual Updates
1. Download the latest version
2. Replace the old files
3. Go to `chrome://extensions/`
4. Click the refresh icon (🔄) next to AdNull
5. Refresh any open YouTube tabs

#### Automatic Updates (Future)
- Chrome Web Store versions will update automatically
- Developer versions require manual updates

### 🛠️ Troubleshooting Installation

#### Extension Not Loading
- **Check folder structure**: Ensure `manifest.json` is in the root
- **Check permissions**: Ensure you have read access to the folder
- **Check Chrome version**: Requires Chrome 88+

#### Extension Loads but Doesn't Work
- **Refresh YouTube**: Press `F5` on YouTube pages
- **Check permissions**: Extension needs access to YouTube
- **Check console**: Look for error messages in Developer Tools

#### Permission Errors
- **Host permissions**: Extension needs access to `*.youtube.com`
- **Storage permissions**: Required for settings and statistics
- **Active tab**: Needed for popup functionality

### 🔒 Security Considerations

#### What the Extension Can Access
- **YouTube pages only**: Limited to `*.youtube.com`
- **Local storage**: For settings and statistics
- **Network requests**: To block ad-related requests

#### What the Extension Cannot Access
- **Other websites**: No access outside YouTube
- **Personal data**: No data collection or transmission
- **Browser history**: No access to browsing history

### 📱 Browser Compatibility

#### Fully Supported
- ✅ **Google Chrome** 88+
- ✅ **Microsoft Edge** (Chromium-based)
- ✅ **Brave Browser**
- ✅ **Opera** (Chromium-based)

#### Not Supported
- ❌ **Firefox** (different extension format)
- ❌ **Safari** (different extension system)
- ❌ **Internet Explorer** (deprecated)

### 🆘 Getting Help

#### If Installation Fails
1. **Check the troubleshooting section** above
2. **Verify file integrity**: Ensure all files are present
3. **Try a different browser**: Test in another Chromium browser
4. **Check error messages**: Look for specific error details

#### Common Issues
- **"Manifest file is missing"**: Check folder structure
- **"Invalid manifest"**: Ensure `manifest.json` is valid
- **"Extension failed to load"**: Check file permissions

#### Support Resources
- **Documentation**: Check other docs in this folder
- **Console logs**: Use `F12` → Console for debugging
- **GitHub Issues**: Report bugs and get help

---

**Next Steps**: After installation, see the [User Guide](user-guide.md) for usage instructions. 