# AdNull - Modular YouTube Ad Blocker

## 🎯 Overview

**AdNull** is now a clean, modular YouTube ad blocker with organized code structure, proper error handling, and a modern UI. The extension has been completely refactored to be maintainable, testable, and extensible.

## 🏗️ Architecture

### Modular Structure
```
src/
├── manifest.json           # Extension configuration
├── content.js             # Main orchestrator
├── modules/               # Core modules
│   ├── config.js         # Configuration & constants
│   ├── logger.js         # Logging system
│   ├── storage.js        # Chrome storage wrapper
│   └── adSkipper.js      # Ad detection & skipping
├── popup/                # Popup interface
│   ├── popup.html        # Modern UI layout
│   ├── popup.css         # Clean styling
│   └── popup.js          # Popup logic
└── icons/                # Extension icons
```

### Module Responsibilities

| Module | Purpose |
|--------|---------|
| **config.js** | Centralized configuration, constants, and settings |
| **logger.js** | Configurable logging with different levels |
| **storage.js** | Chrome storage operations with error handling |
| **adSkipper.js** | Ad detection, validation, and skipping logic |
| **content.js** | Main controller that orchestrates all modules |
| **popup/** | Modern UI for settings and controls |

## ✨ Features

### Core Functionality
- ✅ **Auto-skip ads** with configurable delay
- ✅ **Smart ad detection** using multiple selectors
- ✅ **Configurable logging** (ERROR, WARN, INFO, DEBUG)
- ✅ **Persistent settings** with Chrome storage
- ✅ **Error handling** throughout all modules

### User Interface
- ✅ **Modern popup design** with gradient header
- ✅ **Toggle controls** for all settings
- ✅ **Skip delay selector** (instant to 2 seconds)
- ✅ **Real-time status** display
- ✅ **Test button** to manually trigger skip
- ✅ **Reset button** to restore defaults

### Developer Features
- ✅ **Modular architecture** for easy maintenance
- ✅ **Comprehensive logging** for debugging
- ✅ **Global test functions** accessible via console
- ✅ **Proper error boundaries** and fallbacks
- ✅ **Clean separation of concerns**

## 🚀 Quick Start

### 1. Launch the Extension
```powershell
powershell -ExecutionPolicy Bypass -File "launch-modular.ps1"
```

### 2. Verify Installation
- ✅ Chrome opens with extension loaded
- ✅ Extension icon appears in toolbar
- ✅ Console shows: `[AdNull] Initializing extension`
- ✅ YouTube videos play normally

### 3. Test the Popup
- Click the extension icon
- Modern popup opens with gradient header
- Toggle settings and see real-time status updates
- Test the "Test Skip" button

## 🧪 Testing & Debugging

### Console Commands
```javascript
// Test skip function
window.adnullSkipAds()

// Check extension status
window.adnullStatus()

// Get current settings
window.adnullSettings()

// Toggle extension on/off
window.adnullToggle()

// Access all modules for debugging
window.AdNull.Config     // Configuration
window.AdNull.Logger     // Logging system
window.AdNull.Storage    // Storage operations
window.AdNull.Skipper    // Ad skipper
```

### Logging Levels
Change `CURRENT_LOG_LEVEL` in `config.js`:
- `0` - ERROR only
- `1` - ERROR + WARN
- `2` - ERROR + WARN + INFO (default)
- `3` - ERROR + WARN + INFO + DEBUG

### Module Testing
```javascript
// Test individual modules
window.AdNull.Storage.loadSettings()
window.AdNull.Skipper.getStatus()
window.AdNull.Logger.info('Test message')
```

## ⚙️ Configuration

### Default Settings
```javascript
{
  enabled: true,        // Extension enabled
  autoSkip: true,       // Auto-skip ads
  skipDelay: 1000      // 1 second delay
}
```

### Skip Button Selectors
```javascript
[
  '.ytp-ad-skip-button',
  '.ytp-skip-ad-button', 
  '.videoAdUiSkipButton',
  '.ytp-ad-skip-button-modern',
  '[aria-label*="Skip"]'
]
```

### Timing Configuration
```javascript
{
  CHECK_INTERVAL: 1000,    // Check for ads every 1 second
  INIT_DELAY: 500,         // Wait 500ms before initializing
  RETRY_DELAY: 100         // Retry delay for failed operations
}
```

## 🔧 Development

### Adding New Features
1. Create new module in `src/modules/`
2. Export functionality via `window.ModuleName`
3. Import in `manifest.json` content_scripts
4. Use in `content.js` orchestrator

### Error Handling Pattern
```javascript
try {
  // Operation
  window.AdNullLogger.info('Operation successful');
} catch (error) {
  window.AdNullLogger.error('Operation failed', error);
  // Fallback behavior
}
```

### Storage Pattern
```javascript
// Load settings
const settings = await window.AdNullStorage.loadSettings();

// Update setting
await window.AdNullStorage.updateSetting('enabled', true);

// Save multiple settings
await window.AdNullStorage.saveSettings({ enabled: true, autoSkip: false });
```

## 📁 File Organization

### Clean Structure
- **No unused files** - Removed all test scripts and old versions
- **Logical grouping** - Related files in same directories
- **Clear naming** - Descriptive file and function names
- **Consistent style** - Same coding patterns throughout

### Removed Files
All these unused files have been cleaned up:
- Multiple test scripts (`test-*.js`)
- Emergency fix scripts (`emergency-*.js`)
- Old documentation files
- Duplicate PowerShell scripts
- Legacy code files

## 🎨 UI Improvements

### Modern Design
- **Gradient header** with logo and version
- **Clean typography** using system fonts
- **Smooth animations** and transitions
- **Responsive layout** that works on different screen sizes
- **Accessible controls** with proper focus states

### Better UX
- **Real-time feedback** when changing settings
- **Disabled states** for dependent controls
- **Error messages** with auto-recovery
- **Test functionality** built into the popup
- **Status indicators** with color coding

## 🛡️ Safety & Compatibility

### Conservative Approach
- **Minimal permissions** (only activeTab and storage)
- **No background script** to reduce resource usage
- **Safe selectors** that won't break YouTube
- **Graceful fallbacks** when Chrome APIs unavailable
- **Error boundaries** to prevent crashes

### YouTube Compatibility
- **Non-intrusive** - Only clicks skip buttons
- **No CSS injection** that could hide content
- **No DOM manipulation** beyond button clicking
- **Respects YouTube's structure** and updates

## 📊 Benefits of Modular Architecture

### Maintainability
- ✅ **Single responsibility** - Each module has one job
- ✅ **Easy debugging** - Issues isolated to specific modules
- ✅ **Simple testing** - Test modules independently
- ✅ **Clear dependencies** - Explicit module relationships

### Extensibility
- ✅ **Add features easily** - Create new modules
- ✅ **Modify behavior** - Change individual modules
- ✅ **Reuse code** - Modules can be used elsewhere
- ✅ **Version control** - Track changes per module

### Performance
- ✅ **Lazy loading** - Modules load only when needed
- ✅ **Memory efficient** - Clean module boundaries
- ✅ **Fast initialization** - Optimized startup sequence
- ✅ **Resource management** - Proper cleanup and disposal

---

**The modular AdNull extension is now clean, organized, and ready for production use!** 🎉 