# Development Guide

## 🛠️ Contributing to AdNull

This guide covers everything you need to know to contribute to the AdNull YouTube ad blocker extension.

### 🚀 Getting Started

#### Prerequisites
- **Node.js 16+** (for development tools)
- **Chrome 88+** (for testing)
- **Git** (for version control)
- **Code editor** (VS Code recommended)

#### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/AdNull.git
cd AdNull

# Install development dependencies (if any)
npm install

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the AdNull folder
```

### 🏗️ Architecture Overview

#### Component Responsibilities

**Content Script (`content.js`)**
- Primary ad blocking logic
- DOM manipulation and element removal
- Settings management and synchronization

**Injected Script (`injected.js`)**
- Deep YouTube integration
- Network request interception
- Player API hooks

**Popup (`popup.html`, `popup.js`)**
- User interface and controls
- Settings management
- Statistics display

**Background Service (`background.js`)**
- Extension lifecycle management
- Message routing between components
- Storage management

### 🔧 Development Workflow

#### Code Style Guidelines
- Use ES6+ features where supported
- Prefer const/let over var
- Add JSDoc comments for functions
- Follow consistent naming conventions
- Always include error handling

#### Safety First Approach
```javascript
// Always check element existence
function safeElementOperation(element) {
  if (!element || !element.parentNode) {
    return false;
  }
  
  try {
    // Perform operation
    return true;
  } catch (error) {
    log('Error in operation:', error);
    return false;
  }
}
```

### 🧪 Testing

#### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] All settings save and persist
- [ ] Ad blocking works without breaking content
- [ ] Search functionality remains intact
- [ ] Emergency restore functions work
- [ ] Performance is acceptable

#### Performance Testing
```javascript
// Monitor memory usage
function monitorMemory() {
  if (performance.memory) {
    const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    console.log(`Memory usage: ${used}MB`);
  }
}
```

### 🚀 Feature Development

#### Adding New Features
1. Plan the feature and its impact
2. Implement core logic with safety checks
3. Add settings support
4. Update documentation
5. Test thoroughly

#### Example: New Blocking Strategy
```javascript
function blockNewAdType() {
  if (!extensionSettings.enabled || !extensionSettings.blockNewAdType) {
    return;
  }
  
  try {
    const newAds = document.querySelectorAll('.new-ad-selector');
    newAds.forEach(ad => {
      if (isActualAd(ad)) {
        removeElement(ad);
      }
    });
  } catch (error) {
    log('Error in new blocking strategy:', error);
  }
}
```

### 🤝 Contributing Guidelines

#### Pull Request Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes with proper testing
4. Update documentation if needed
5. Submit pull request with clear description

#### Code Review Checklist
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No breaking changes
- [ ] Performance impact is acceptable
- [ ] Security considerations addressed

### 🔒 Security Considerations

#### Extension Security
- Use minimal permissions
- Limit host permissions to YouTube only
- Avoid eval() and innerHTML
- Validate all inputs

#### Privacy
- No personal data collection
- Local storage only for settings
- Transparent about data usage
- Easy to disable features

### 📈 Performance Optimization

#### Best Practices
- Cache DOM queries when possible
- Use event delegation
- Debounce frequent operations
- Clean up observers and listeners

#### Performance Budget
- < 50ms for ad blocking execution
- < 10MB memory usage increase
- < 1% CPU usage on average
- 99%+ uptime without errors

---

**Ready to contribute?** Start by checking out existing issues and pick a good first issue to work on! 