# Troubleshooting Guide

## 🔧 AdNull Extension Troubleshooting

This guide helps you diagnose and fix common issues with the AdNull YouTube ad blocker extension.

### 🚨 Quick Emergency Fixes

#### If YouTube is Broken
1. **Disable Extension**: Click AdNull icon → Toggle "Extension Enabled" OFF
2. **Refresh Page**: Press `F5` or `Ctrl+R`
3. **Enable Safety Mode**: Click AdNull icon → Toggle "Safety Mode" ON
4. **Emergency Restore**: Press `F12` → Console → Type `restoreContent()`

#### If Search is Missing
1. Press `F12` → Console → Type `restoreMasthead()`
2. Disable "Block Sidebar Ads" temporarily
3. Enable Safety Mode
4. Refresh the page

---

## 📋 Common Issues & Solutions

### 🔍 Search Bar Missing

#### Symptoms
- YouTube search box is hidden or removed
- Can't search for videos
- Navigation bar is missing

#### Causes
- Overly aggressive ad blocking
- Search elements mistakenly identified as ads
- CSS rules hiding navigation

#### Solutions

**Immediate Fix**:
```javascript
// Open Developer Tools (F12) and run:
restoreMasthead()
```

**Settings Fix**:
1. Click AdNull icon
2. Enable "Safety Mode"
3. Disable "Block Sidebar Ads" temporarily
4. Refresh the page

**Manual Fix**:
```javascript
// Restore search specifically
document.querySelectorAll('*[id*="search"], *[class*="search"]').forEach(el => {
  el.style.display = '';
  el.style.visibility = '';
  el.style.opacity = '';
});
```

### 🎥 Video Links Not Clickable

#### Symptoms
- Can't click on video thumbnails
- Video titles are not clickable
- Links appear but don't work

#### Causes
- Event handlers removed by ad blocking
- Link elements hidden or disabled
- JavaScript conflicts

#### Solutions

**Quick Fix**:
1. Disable extension temporarily
2. Refresh the page
3. Re-enable with Safety Mode

**Debug Steps**:
```javascript
// Check for hidden video links
document.querySelectorAll('a[href*="/watch"]').forEach(link => {
  console.log('Video link:', link, 'Visible:', link.offsetParent !== null);
});
```

**Restore Links**:
```javascript
// Restore video links
document.querySelectorAll('a[href*="/watch"]').forEach(link => {
  link.style.display = '';
  link.style.visibility = '';
  link.style.pointerEvents = '';
});
```

### 📱 Related Videos Missing

#### Symptoms
- No recommended videos in sidebar
- "Up next" section is empty
- Related content disappeared

#### Causes
- Sidebar ad blocking too aggressive
- Related content mistaken for ads
- CSS rules hiding recommendations

#### Solutions

**Settings Fix**:
1. Click AdNull icon
2. Disable "Block Sidebar Ads"
3. Refresh the page

**Emergency Restore**:
```javascript
// Restore related videos
document.querySelectorAll('*[class*="related"], *[class*="secondary"]').forEach(el => {
  el.style.display = '';
  el.style.visibility = '';
});
```

### 🚫 Extension Not Working

#### Symptoms
- Ads still showing
- No blocking activity
- Extension appears inactive

#### Causes
- Extension disabled
- Permissions issues
- Script loading failures

#### Diagnostic Steps

**Check Extension Status**:
1. Go to `chrome://extensions/`
2. Find "AdNull - YouTube Ad Blocker"
3. Ensure toggle is ON (blue)
4. Check for error messages

**Check Permissions**:
1. Click "Details" on extension
2. Verify "Site access" includes YouTube
3. Ensure "Allow in incognito" if needed

**Check Console**:
1. Press `F12` on YouTube
2. Go to Console tab
3. Look for `[AdNull]` messages
4. Check for error messages

#### Solutions

**Reload Extension**:
1. Go to `chrome://extensions/`
2. Click refresh icon (🔄) next to AdNull
3. Refresh YouTube tabs

**Reinstall Extension**:
1. Remove extension
2. Download fresh copy
3. Install again
4. Configure settings

### ⚡ Performance Issues

#### Symptoms
- YouTube loading slowly
- Browser freezing
- High CPU usage

#### Causes
- Excessive DOM queries
- Memory leaks
- Infinite loops in ad detection

#### Solutions

**Reduce Aggressiveness**:
1. Enable "Safety Mode"
2. Disable "Speed Up Ads"
3. Disable "Block Shorts Ads"

**Monitor Performance**:
```javascript
// Check extension performance
console.time('AdNull Performance');
// ... extension operations
console.timeEnd('AdNull Performance');
```

**Memory Check**:
```javascript
// Check memory usage
console.log('Memory:', performance.memory);
```

### 🎬 Video Player Issues

#### Symptoms
- Video won't play
- Player controls missing
- Black screen instead of video

#### Causes
- Player elements removed by mistake
- Video ads blocking legitimate content
- JavaScript conflicts

#### Solutions

**Disable Video Ad Blocking**:
1. Click AdNull icon
2. Disable "Block Video Ads"
3. Refresh the page

**Restore Player**:
```javascript
// Restore video player
document.querySelectorAll('video, *[class*="player"]').forEach(el => {
  el.style.display = '';
  el.style.visibility = '';
});
```

### 🔄 Settings Not Saving

#### Symptoms
- Settings reset after browser restart
- Changes don't take effect
- Extension forgets preferences

#### Causes
- Chrome storage issues
- Permission problems
- Sync conflicts

#### Solutions

**Check Storage Permissions**:
1. Go to `chrome://extensions/`
2. Click "Details" on AdNull
3. Verify storage permissions

**Clear Extension Data**:
```javascript
// Clear and reset settings
chrome.storage.sync.clear(() => {
  console.log('Settings cleared');
  location.reload();
});
```

**Manual Settings Reset**:
1. Click AdNull icon
2. Look for "Reset Settings" option
3. Reconfigure preferences

---

## 🛠️ Advanced Troubleshooting

### 🔍 Debug Mode

#### Enable Debug Logging
```javascript
// Enable debug mode in console
window.postMessage({
  type: 'ADNULL_DEBUG_ENABLE',
  debug: true
}, '*');
```

#### View Debug Information
```javascript
// Check extension state
console.log('Extension Settings:', extensionSettings);
console.log('Protected Elements:', absolutelyProtected);
```

### 📊 Performance Analysis

#### Measure Blocking Performance
```javascript
// Time ad blocking operations
console.time('Ad Blocking');
executeAdBlocking();
console.timeEnd('Ad Blocking');
```

#### Memory Usage Tracking
```javascript
// Monitor memory usage
setInterval(() => {
  if (performance.memory) {
    console.log('Memory:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
    });
  }
}, 5000);
```

### 🔧 Manual Fixes

#### Restore All Content
```javascript
function emergencyRestore() {
  let restored = 0;
  
  // Restore all hidden elements
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {
      el.style.display = '';
      el.style.visibility = '';
      el.style.opacity = '';
      restored++;
    }
  });
  
  console.log(`Restored ${restored} elements`);
  return restored;
}
```

#### Fix Navigation
```javascript
function fixNavigation() {
  const navSelectors = [
    '*[id*="masthead"]',
    '*[class*="masthead"]',
    '*[id*="header"]',
    '*[class*="header"]',
    '*[id*="topbar"]',
    '*[class*="topbar"]'
  ];
  
  navSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = '';
      el.style.visibility = '';
      el.style.position = '';
    });
  });
}
```

#### Restore Video Functionality
```javascript
function fixVideos() {
  // Restore video elements
  document.querySelectorAll('video').forEach(video => {
    video.style.display = '';
    video.style.visibility = '';
  });
  
  // Restore video containers
  document.querySelectorAll('*[class*="player"], *[id*="player"]').forEach(el => {
    el.style.display = '';
    el.style.visibility = '';
  });
}
```

---

## 🔍 Diagnostic Tools

### Browser Console Commands

#### Check Extension Status
```javascript
// Verify extension is loaded
console.log('AdNull loaded:', typeof executeAdBlocking === 'function');

// Check settings
console.log('Settings:', extensionSettings);

// Test ad detection
console.log('Protected elements:', absolutelyProtected.length);
```

#### Test Ad Blocking
```javascript
// Manually trigger ad blocking
executeAdBlocking();

// Check for ads
console.log('Ads found:', document.querySelectorAll('[data-ad-slot-id]').length);

// Test safety mode
safeAdRemoval();
```

#### Monitor Network Requests
```javascript
// Log blocked requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args[0]);
  return originalFetch.apply(this, args);
};
```

### Extension Popup Diagnostics

#### Statistics Check
- Open extension popup
- Verify "Ads Blocked" counter
- Check "Extension Status" indicator
- Note any error messages

#### Settings Verification
- Toggle each setting on/off
- Verify changes take effect immediately
- Check if settings persist after refresh

---

## 🚨 Emergency Procedures

### Complete Extension Reset

#### Method 1: Settings Reset
1. Click AdNull icon
2. Look for "Reset" or "Restore Defaults"
3. Confirm reset
4. Refresh YouTube

#### Method 2: Manual Reset
```javascript
// Clear all extension data
chrome.storage.sync.clear(() => {
  chrome.storage.local.clear(() => {
    console.log('Extension data cleared');
    location.reload();
  });
});
```

#### Method 3: Reinstall
1. Go to `chrome://extensions/`
2. Remove AdNull extension
3. Download fresh copy
4. Install and reconfigure

### YouTube Recovery

#### If YouTube is Completely Broken
1. **Disable extension immediately**
2. **Clear browser cache**: `Ctrl+Shift+Delete`
3. **Restart browser**
4. **Test YouTube without extension**
5. **Reinstall extension with Safety Mode**

#### Nuclear Option - Complete Reset
```javascript
// WARNING: This will reset everything
(function() {
  // Disable all extension functionality
  window.extensionSettings = { enabled: false };
  
  // Restore all elements
  document.querySelectorAll('*').forEach(el => {
    el.style.cssText = '';
  });
  
  // Reload page
  location.reload();
})();
```

---

## 📞 Getting Help

### Before Reporting Issues

#### Gather Information
1. **Browser version**: `chrome://version/`
2. **Extension version**: Check in `chrome://extensions/`
3. **Operating system**: Windows/Mac/Linux version
4. **YouTube URL**: Where the issue occurs
5. **Console errors**: Copy any error messages

#### Test in Incognito
1. Open incognito window
2. Enable extension in incognito
3. Test if issue persists
4. Note any differences

#### Try Safe Mode
1. Enable "Safety Mode" in extension
2. Test functionality
3. Note if issues are resolved

### Reporting Bugs

#### Include This Information
- **Exact steps to reproduce**
- **Expected vs actual behavior**
- **Browser and extension versions**
- **Console error messages**
- **Screenshots if applicable**

#### Console Log Export
```javascript
// Export console logs for debugging
console.save = function(data, filename) {
  const blob = new Blob([data], {type: 'text/plain'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

// Save current console output
console.save(JSON.stringify(console.history || []), 'adnull-debug.txt');
```

### Community Resources

#### Self-Help
- Check this troubleshooting guide
- Search existing GitHub issues
- Try emergency restoration commands
- Test with different settings

#### Support Channels
- **GitHub Issues**: For bug reports
- **Documentation**: For usage questions
- **Community Forums**: For general help

---

**Next**: See [Development Guide](development.md) for contributing to the project. 