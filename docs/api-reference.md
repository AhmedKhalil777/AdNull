# API Reference

## 📚 AdNull Extension API Documentation

This document provides detailed documentation for all functions, classes, and interfaces in the AdNull extension.

### 📋 Table of Contents

- [Content Script API](#content-script-api)
- [Injected Script API](#injected-script-api)
- [Popup API](#popup-api)
- [Background Service API](#background-service-api)
- [Emergency Tools API](#emergency-tools-api)
- [Configuration Objects](#configuration-objects)
- [Event System](#event-system)

---

## Content Script API

### Core Functions

#### `init()`
**Purpose**: Initialize the ad blocker extension
**Parameters**: None
**Returns**: `void`
**Description**: Sets up the extension, loads settings, and starts ad blocking

```javascript
function init() {
  log('AdNull initialized');
  loadSettings();
  setupMessageListener();
  // ... initialization logic
}
```

#### `loadSettings()`
**Purpose**: Load extension settings from Chrome storage
**Parameters**: None
**Returns**: `void`
**Description**: Retrieves user settings and updates the global `extensionSettings` object

```javascript
function loadSettings() {
  chrome.storage.sync.get(null, function(settings) {
    extensionSettings = {
      enabled: settings.enabled !== false,
      blockVideoAds: settings.blockVideoAds !== false,
      // ... other settings
    };
  });
}
```

#### `executeAdBlocking()`
**Purpose**: Main orchestration function for ad blocking
**Parameters**: None
**Returns**: `void`
**Description**: Coordinates all ad blocking activities based on current settings

```javascript
function executeAdBlocking() {
  if (!extensionSettings.enabled) return;
  
  if (extensionSettings.blockVideoAds || extensionSettings.blockSidebarAds) {
    removeAds();
  }
  if (extensionSettings.autoSkip) {
    skipVideoAds();
  }
  // ... other blocking activities
}
```

### Ad Detection Functions

#### `isActualAd(element)`
**Purpose**: Determine if a DOM element is actually an advertisement
**Parameters**: 
- `element` (HTMLElement): The DOM element to check
**Returns**: `boolean` - `true` if element is an ad, `false` otherwise
**Description**: Uses multiple detection strategies to safely identify ads

```javascript
function isActualAd(element) {
  // Check against protected elements list
  const className = element.className || '';
  const elementId = element.id || '';
  
  // ABSOLUTE PROTECTION - Never remove these
  const absolutelyProtected = [
    'ytd-app', 'ytd-searchbox', 'ytd-masthead',
    // ... comprehensive protection list
  ];
  
  // Safety checks and ad detection logic
  // Returns false by default (conservative approach)
  return false;
}
```

#### `removeAds()`
**Purpose**: Remove detected advertisements from the page
**Parameters**: None
**Returns**: `number` - Count of ads removed
**Description**: Main ad removal function using safe detection methods

```javascript
function removeAds() {
  if (!extensionSettings.enabled) return 0;
  
  let removedCount = 0;
  
  // Use specific selectors only
  adSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (removeElement(element)) {
        removedCount++;
      }
    });
  });
  
  return removedCount;
}
```

### Utility Functions

#### `removeElement(element)`
**Purpose**: Safely remove a DOM element
**Parameters**:
- `element` (HTMLElement): Element to remove
**Returns**: `boolean` - `true` if successfully removed
**Description**: Removes element with error handling

```javascript
function removeElement(element) {
  if (element && element.parentNode) {
    try {
      element.parentNode.removeChild(element);
      log('Removed ad element:', element);
      return true;
    } catch (e) {
      log('Error removing element:', e);
      return false;
    }
  }
  return false;
}
```

#### `hideElement(element)`
**Purpose**: Hide a DOM element using CSS
**Parameters**:
- `element` (HTMLElement): Element to hide
**Returns**: `boolean` - `true` if successfully hidden
**Description**: Hides element using multiple CSS properties

```javascript
function hideElement(element) {
  if (element) {
    try {
      element.style.display = 'none !important';
      element.style.visibility = 'hidden !important';
      element.style.opacity = '0 !important';
      // ... additional hiding styles
      return true;
    } catch (e) {
      log('Error hiding element:', e);
      return false;
    }
  }
  return false;
}
```

#### `log(message, ...args)`
**Purpose**: Debug logging with extension prefix
**Parameters**:
- `message` (string): Log message
- `...args` (any[]): Additional arguments to log
**Returns**: `void`
**Description**: Conditional logging based on debug configuration

```javascript
function log(message, ...args) {
  if (config.debug) {
    console.log(`[AdNull] ${message}`, ...args);
  }
}
```

### Video Ad Functions

#### `skipVideoAds()`
**Purpose**: Automatically skip video advertisements
**Parameters**: None
**Returns**: `void`
**Description**: Finds and clicks skip buttons, handles countdown timers

```javascript
function skipVideoAds() {
  if (!extensionSettings.enabled || !extensionSettings.autoSkip) return;
  
  skipButtonSelectors.forEach(selector => {
    const skipButton = document.querySelector(selector);
    if (skipButton && skipButton.offsetParent !== null) {
      skipButton.click();
      log('Clicked skip button');
    }
  });
}
```

#### `speedUpAds()`
**Purpose**: Accelerate video advertisements
**Parameters**: None
**Returns**: `void`
**Description**: Increases playback rate and seeks to end of ads

```javascript
function speedUpAds() {
  if (!extensionSettings.enabled || !extensionSettings.speedUpAds) return;
  
  const video = document.querySelector('video');
  if (video && document.querySelector('.ytp-ad-module')) {
    video.playbackRate = 16;
    video.currentTime = video.duration - 0.1;
    log('Sped up video ad');
  }
}
```

#### `removeOverlayAds()`
**Purpose**: Remove video overlay advertisements
**Parameters**: None
**Returns**: `void`
**Description**: Targets and removes video overlay ad elements

```javascript
function removeOverlayAds() {
  if (!extensionSettings.enabled || !extensionSettings.blockVideoAds) return;
  
  const overlays = document.querySelectorAll(
    '.ytp-ad-overlay-container, .ytp-ad-text-overlay'
  );
  overlays.forEach(overlay => {
    removeElement(overlay);
  });
}
```

### Network Blocking Functions

#### `blockAdRequests()`
**Purpose**: Block advertisement network requests
**Parameters**: None
**Returns**: `void`
**Description**: Overrides XMLHttpRequest and fetch to block ad-related requests

```javascript
function blockAdRequests() {
  if (!extensionSettings.enabled || !extensionSettings.blockTracking) return;
  
  // Override XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (isAdRequest(url)) {
      log('Blocked ad request:', url);
      return;
    }
    return originalOpen.apply(this, [method, url, ...args]);
  };
  
  // Override fetch API
  const originalFetch = window.fetch;
  window.fetch = function(url, ...args) {
    if (isAdRequest(url)) {
      log('Blocked fetch ad request:', url);
      return Promise.reject(new Error('Blocked by AdNull'));
    }
    return originalFetch.apply(this, [url, ...args]);
  };
}
```

### Safety Functions

#### `safeAdRemoval()`
**Purpose**: Ultra-conservative ad removal for safety mode
**Parameters**: None
**Returns**: `number` - Count of ads removed
**Description**: Only removes elements with explicit ad data attributes

```javascript
function safeAdRemoval() {
  let removedCount = 0;
  
  // Only target elements with explicit ad data attributes
  const explicitAds = document.querySelectorAll(
    '[data-ad-slot-id], [data-ad-unit-path], [data-google-av-cxn]'
  );
  
  explicitAds.forEach(element => {
    if (removeElement(element)) {
      removedCount++;
    }
  });
  
  return removedCount;
}
```

### Message Handling Functions

#### `setupMessageListener()`
**Purpose**: Set up message listener for settings updates
**Parameters**: None
**Returns**: `void`
**Description**: Listens for messages from popup and background script

```javascript
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'settingsUpdated') {
      extensionSettings = message.settings;
      log('Settings updated:', extensionSettings);
      sendSettingsToInjectedScript();
      if (extensionSettings.enabled) {
        executeAdBlocking();
      }
    }
    return true;
  });
}
```

#### `sendSettingsToInjectedScript()`
**Purpose**: Send settings to injected script via postMessage
**Parameters**: None
**Returns**: `void`
**Description**: Communicates settings changes to page context script

```javascript
function sendSettingsToInjectedScript() {
  window.postMessage({
    type: 'ADNULL_SETTINGS_UPDATE',
    settings: extensionSettings
  }, '*');
}
```

---

## Injected Script API

### Network Interception

#### `interceptRequests()`
**Purpose**: Intercept and block ad-related network requests
**Parameters**: None
**Returns**: `void`
**Description**: Deep network request interception in page context

#### `isAdRequest(url)`
**Purpose**: Determine if a URL is ad-related
**Parameters**:
- `url` (string): URL to check
**Returns**: `boolean` - `true` if URL is ad-related
**Description**: Pattern matching for ad-related URLs

### YouTube Integration

#### `hookYouTubePlayer()`
**Purpose**: Hook into YouTube player events
**Parameters**: None
**Returns**: `void`
**Description**: Integrates with YouTube's player API for ad detection

#### `detectPlayerAds()`
**Purpose**: Detect ads within the YouTube player
**Parameters**: None
**Returns**: `boolean` - `true` if ads detected
**Description**: Player-specific ad detection

---

## Popup API

### UI Functions

#### `updateStatistics()`
**Purpose**: Update statistics display in popup
**Parameters**: None
**Returns**: `void`
**Description**: Refreshes ads blocked count and other metrics

#### `updateToggleStates()`
**Purpose**: Update toggle switch states
**Parameters**: None
**Returns**: `void`
**Description**: Synchronizes UI toggles with stored settings

#### `saveSettings()`
**Purpose**: Save current settings to Chrome storage
**Parameters**: None
**Returns**: `void`
**Description**: Persists user settings changes

### Event Handlers

#### `handleToggleChange(event)`
**Purpose**: Handle toggle switch changes
**Parameters**:
- `event` (Event): Change event from toggle
**Returns**: `void`
**Description**: Processes setting changes and updates storage

#### `handleEmergencyRestore()`
**Purpose**: Handle emergency restore button click
**Parameters**: None
**Returns**: `void`
**Description**: Triggers content restoration in active tab

---

## Background Service API

### Lifecycle Functions

#### `onInstalled(details)`
**Purpose**: Handle extension installation/update
**Parameters**:
- `details` (object): Installation details
**Returns**: `void`
**Description**: Sets up default settings and handles migrations

#### `onStartup()`
**Purpose**: Handle browser startup
**Parameters**: None
**Returns**: `void`
**Description**: Initialize extension on browser start

### Message Routing

#### `handleMessage(message, sender, sendResponse)`
**Purpose**: Route messages between components
**Parameters**:
- `message` (object): Message object
- `sender` (object): Message sender info
- `sendResponse` (function): Response callback
**Returns**: `boolean` - `true` to keep response channel open

---

## Emergency Tools API

### Content Restoration

#### `restoreContent()`
**Purpose**: Restore all hidden content on the page
**Parameters**: None
**Returns**: `number` - Count of elements restored
**Description**: Emergency function to restore accidentally hidden content

```javascript
function restoreContent() {
  let restoredCount = 0;
  const hiddenElements = document.querySelectorAll('*');
  
  hiddenElements.forEach(element => {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      // Restore element visibility
      element.style.display = '';
      element.style.visibility = '';
      element.style.opacity = '';
      restoredCount++;
    }
  });
  
  return restoredCount;
}
```

#### `restoreMasthead()`
**Purpose**: Restore YouTube header/navigation elements
**Parameters**: None
**Returns**: `number` - Count of masthead elements restored
**Description**: Specifically targets and restores YouTube navigation

#### `restoreSearch()`
**Purpose**: Restore search functionality
**Parameters**: None
**Returns**: `number` - Count of search elements restored
**Description**: Restores search box and related elements

---

## Configuration Objects

### Extension Settings

```typescript
interface ExtensionSettings {
  enabled: boolean;           // Master enable/disable
  blockVideoAds: boolean;     // Block video advertisements
  blockSidebarAds: boolean;   // Block sidebar advertisements
  blockShortsAds: boolean;    // Block YouTube Shorts ads
  autoSkip: boolean;          // Auto-skip video ads
  speedUpAds: boolean;        // Speed up unskippable ads
  blockTracking: boolean;     // Block tracking requests
  safeMode: boolean;          // Ultra-conservative blocking
}
```

### Configuration Object

```typescript
interface Config {
  debug: boolean;             // Enable debug logging
  checkInterval: number;      // Ad checking interval (ms)
  maxRetries: number;         // Maximum retry attempts
}
```

### Statistics Object

```typescript
interface Statistics {
  adsBlockedToday: number;    // Ads blocked today
  totalAdsBlocked: number;    // Total ads blocked
  timeSaved: number;          // Estimated time saved (seconds)
  lastReset: string;          // Last statistics reset date
}
```

---

## Event System

### Custom Events

#### `ADNULL_SETTINGS_UPDATE`
**Purpose**: Settings update notification
**Data**: `{ settings: ExtensionSettings }`
**Description**: Fired when settings are updated

#### `ADNULL_AD_BLOCKED`
**Purpose**: Ad blocked notification
**Data**: `{ element: HTMLElement, type: string }`
**Description**: Fired when an ad is successfully blocked

#### `ADNULL_ERROR`
**Purpose**: Error notification
**Data**: `{ error: Error, context: string }`
**Description**: Fired when an error occurs

### Message Types

#### Settings Messages
```typescript
interface SettingsMessage {
  action: 'settingsUpdated';
  settings: ExtensionSettings;
}
```

#### Statistics Messages
```typescript
interface StatisticsMessage {
  action: 'statisticsRequest' | 'statisticsUpdate';
  data?: Statistics;
}
```

#### Emergency Messages
```typescript
interface EmergencyMessage {
  action: 'emergencyRestore' | 'enableSafeMode';
  target?: string;
}
```

---

## Error Handling

### Error Types

```typescript
enum ErrorType {
  DOM_ERROR = 'dom_error',
  PERMISSION_ERROR = 'permission_error',
  NETWORK_ERROR = 'network_error',
  LOGIC_ERROR = 'logic_error'
}
```

### Error Handler

```javascript
function handleError(error, context, type = ErrorType.LOGIC_ERROR) {
  log(`Error in ${context}:`, error);
  
  // Report error for debugging
  if (config.debug) {
    console.error(`[AdNull] ${type}:`, error);
  }
  
  // Graceful degradation
  switch (type) {
    case ErrorType.DOM_ERROR:
      // Continue with reduced functionality
      break;
    case ErrorType.PERMISSION_ERROR:
      // Disable affected features
      break;
    default:
      // Log and continue
      break;
  }
}
```

---

## Performance Monitoring

### Performance Metrics

```typescript
interface PerformanceMetrics {
  executionTime: number;      // Average execution time
  memoryUsage: number;        // Memory usage estimate
  errorRate: number;          // Error rate percentage
  blockedRequests: number;    // Network requests blocked
}
```

### Monitoring Functions

#### `measurePerformance(fn, context)`
**Purpose**: Measure function execution time
**Parameters**:
- `fn` (function): Function to measure
- `context` (string): Context for logging
**Returns**: `any` - Function result
**Description**: Wraps function execution with performance measurement

```javascript
function measurePerformance(fn, context) {
  const start = performance.now();
  try {
    const result = fn();
    const end = performance.now();
    log(`${context} took ${end - start} milliseconds`);
    return result;
  } catch (error) {
    handleError(error, context);
    throw error;
  }
}
```

---

**Next**: See [Troubleshooting Guide](troubleshooting.md) for common issues and solutions. 