# AdNull - YouTube Ad Blocker Documentation

## 📚 Documentation Index

Welcome to the comprehensive documentation for AdNull, a Chrome extension that removes YouTube ads while preserving legitimate content.

### 🚀 Quick Links

- [**Installation Guide**](installation.md) - How to install and set up the extension
- [**User Guide**](user-guide.md) - How to use the extension features
- [**Architecture Overview**](architecture.md) - Technical architecture and design
- [**API Reference**](api-reference.md) - Detailed code documentation
- [**Troubleshooting**](troubleshooting.md) - Common issues and solutions
- [**Development Guide**](development.md) - Contributing and development setup

### 🎯 Overview

AdNull is a Chrome extension designed to block YouTube ads while maintaining the integrity of the YouTube experience. It uses multiple blocking strategies and includes safety mechanisms to prevent removing legitimate content.

#### Key Features
- **Video Ad Blocking**: Removes pre-roll, mid-roll, and post-roll ads
- **Sidebar Ad Blocking**: Removes promotional content in sidebars
- **Auto Skip**: Automatically skips ads when possible
- **Speed Up Ads**: Accelerates unskippable ads
- **Tracking Protection**: Blocks analytics and tracking scripts
- **Safety Mode**: Conservative blocking to prevent content removal
- **Emergency Restoration**: Tools to restore accidentally hidden content

#### Safety First
The extension prioritizes content preservation over aggressive ad blocking. It includes:
- Comprehensive protection lists for essential YouTube elements
- Emergency restoration scripts
- Conservative detection algorithms
- Extensive logging for debugging

### 📁 File Structure

```
AdNull/
├── docs/                    # Documentation (this folder)
│   ├── README.md           # This file
│   ├── installation.md     # Installation instructions
│   ├── user-guide.md       # User manual
│   ├── architecture.md     # Technical architecture
│   ├── api-reference.md    # Code documentation
│   ├── troubleshooting.md  # Problem solving
│   └── development.md      # Development guide
├── manifest.json           # Extension configuration
├── content.js             # Main content script
├── injected.js            # Page context script
├── background.js          # Service worker
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── styles.css             # Ad-blocking CSS rules
├── icons/                 # Extension icons
├── emergency-restore.js   # Emergency content restoration
├── masthead-restore.js    # Masthead-specific restoration
├── restore-content.js     # General content restoration
├── test-extension.js      # Testing utilities
└── README.md              # Main project README
```

### 🔧 Core Components

1. **Content Script** (`content.js`) - Main ad blocking logic
2. **Injected Script** (`injected.js`) - Deep YouTube integration
3. **Popup Interface** (`popup.html`, `popup.js`) - User controls
4. **Background Service** (`background.js`) - Extension lifecycle
5. **Restoration Tools** - Emergency content recovery

### 🛡️ Safety Mechanisms

- **Protected Elements List**: Comprehensive list of YouTube elements that should never be removed
- **Conservative Detection**: Only removes elements with explicit ad indicators
- **Emergency Restoration**: Multiple scripts to recover hidden content
- **Logging System**: Detailed logging for debugging and monitoring

### 📊 Statistics & Monitoring

The extension tracks:
- Ads blocked per day
- Total ads blocked
- Time saved (estimated)
- Extension performance metrics

### 🤝 Contributing

See the [Development Guide](development.md) for information on:
- Setting up the development environment
- Code style guidelines
- Testing procedures
- Submitting contributions

### 📞 Support

- **Issues**: Report bugs and request features
- **Documentation**: Improve or suggest documentation changes
- **Testing**: Help test new features and bug fixes

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**License**: MIT 