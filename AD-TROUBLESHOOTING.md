# AdNull - Ad Detection Troubleshooting Guide (v1.0.3)

## 🚨 Ads Still Appearing? Here's How to Fix It

### Quick Diagnostic Steps

1. **Open Chrome Developer Console** (F12)
2. **Go to a YouTube video with ads**
3. **Run these commands in console:**

```javascript
// Check if extension is loaded and get comprehensive status
window.adnullDebug()

// Test all skip strategies at once
window.adnullTestStrategies()

// Try aggressive skip methods immediately
window.adnullAggressiveSkip()

// Monitor ads in real-time for 30 seconds
window.adnullMonitor(30000)

// Arabic language specific test
window.adnullTestArabic()

// Manual skip attempt with all methods
window.adnullSkipAds()
```

## 🆕 New in v1.0.3 - Enhanced Skip Strategies

### Multiple Simultaneous Skip Methods
- **Button clicking** with enhanced detection
- **Aggressive search** for any skip-like elements  
- **Video manipulation** with event dispatching
- **Keyboard shortcuts** (Tab+Enter, Space, Escape)
- **Text-based search** in all languages
- **Generic area clicking** for hidden buttons

### Improved Timing
- **250ms detection intervals** (faster than before)
- **15 max skip attempts** (increased from 10)
- **10-second aggressive retry** for stubborn ads
- **Multiple click methods** per attempt

## 🔧 New Debugging Commands

### Real-Time Ad Monitoring
```javascript
// Monitor for 30 seconds (default)
window.adnullMonitor()

// Monitor for 60 seconds
window.adnullMonitor(60000)

// Monitor for 2 minutes
window.adnullMonitor(120000)
```

### Test All Skip Strategies
```javascript
// Test each strategy individually
window.adnullTestStrategies()

// Expected output:
// ✅ Skip button found: [button element]
// ✅ Aggressive search executed
// ✅ Video skip executed
// ✅ Keyboard skip executed
// ✅ Text search executed
```

### Aggressive Skip Test
```javascript
// Force all skip methods immediately
window.adnullAggressiveSkip()

// This will try:
// - All button selectors
// - Text content search
// - Video fast-forward
// - Keyboard events
// - Generic area clicks
```

### Enhanced Debug Information
```javascript
// Get comprehensive debug info
window.adnullDebug()

// New fields in v1.0.3:
// - skipperStatus: detailed skipper state
// - strategies: enabled skip strategies
// - timing: current timing configuration
// - timeSinceAdStart: how long current ad has been playing
```

## 🎯 Troubleshooting by Ad Type

### 1. Skippable Ads (5-second countdown)
**Expected behavior:** Extension should click skip button after countdown

**If failing:**
```javascript
// Check if skip button is detected
window.adnullDebug().skipButton

// Test button clicking specifically
const button = document.querySelector('.ytp-ad-skip-button');
if (button) {
  console.log('Button found:', button);
  console.log('Clickable:', window.AdNullSkipper.isButtonClickable(button));
  button.click(); // Manual test
}

// Try aggressive skip
window.adnullAggressiveSkip()
```

### 2. Unskippable Ads (15-30 seconds)
**Expected behavior:** Extension should fast-forward video to end

**If failing:**
```javascript
// Check video manipulation
const video = document.querySelector('video');
console.log('Video duration:', video.duration);
console.log('Current time:', video.currentTime);

// Manual fast-forward test
video.currentTime = video.duration;

// Test video skip method
window.AdNullSkipper.tryVideoSkip()
```

### 3. Bumper Ads (6 seconds, no skip)
**Expected behavior:** Extension should fast-forward or wait

**If failing:**
```javascript
// Check if detected as ad
window.adnullDebug().adDetected

// Check video source
window.adnullDebug().videoInfo.isAd

// Force video skip
window.AdNullSkipper.tryVideoSkip()
```

### 4. Multiple Ads in Sequence
**Expected behavior:** Extension should handle each ad separately

**If failing:**
```javascript
// Monitor ad sequence
window.adnullMonitor(120000) // Monitor for 2 minutes

// Check skip attempt counter
window.adnullDebug().skipperStatus.skipAttempts

// Reset if stuck
window.adnullToggle() // Turn off and on
```

## 🌍 Language-Specific Issues

### Arabic Language Support
```javascript
// Test Arabic detection
window.adnullTestArabic()

// Check language detection
window.adnullDebug().language // Should be 'ar'

// Manual Arabic button search
document.querySelectorAll('button[aria-label*="تخطي"]')
document.querySelectorAll('button[aria-label*="تخطى"]')
document.querySelectorAll('button[aria-label*="تجاوز"]')
```

### Other Languages
```javascript
// Check detected language
window.adnullDebug().language

// Check skip text patterns for current language
window.adnullDebug().skipTexts

// Test text-based search
window.AdNullSkipper.searchByTextContent()
```

## 🚨 Emergency Fixes

### If Extension Seems Stuck
```javascript
// Reset extension state
window.adnullToggle() // Turn off
window.adnullToggle() // Turn on

// Check if running
window.adnullStatus().skipper.isRunning

// Force restart
window.AdNullSkipper.stop()
window.AdNullSkipper.start()
```

### If Ads Keep Playing
```javascript
// Try all methods immediately
window.adnullAggressiveSkip()

// Manual video skip
const video = document.querySelector('video');
if (video && video.duration) {
  video.currentTime = video.duration;
  video.dispatchEvent(new Event('ended'));
}

// Manual button search and click
const buttons = document.querySelectorAll('button, div[role="button"]');
buttons.forEach(btn => {
  if (btn.textContent && btn.textContent.toLowerCase().includes('skip')) {
    btn.click();
  }
});
```

### If Nothing Works
```javascript
// Nuclear option - try everything
window.AdNullSkipper.tryAllSkipMethods()

// Check what's actually happening
window.adnullDebug()

// Look for any skip-related elements
document.querySelectorAll('[class*="skip"], [aria-label*="skip"], [onclick*="skip"]')
```

## 📊 Performance Monitoring

### Check Extension Performance
```javascript
// Get detailed status
const status = window.adnullStatus();
console.log('Extension enabled:', status.skipper.enabled);
console.log('Auto-skip enabled:', status.skipper.autoSkip);
console.log('Currently running:', status.skipper.isRunning);
console.log('Skip attempts:', status.skipper.skipAttempts);
console.log('Max attempts:', status.skipper.maxSkipAttempts);
```

### Monitor Detection Speed
```javascript
// Time how fast ads are detected
let adDetectionStart = null;
const monitor = setInterval(() => {
  const adDetected = window.AdNullSkipper.isAdPlaying();
  if (adDetected && !adDetectionStart) {
    adDetectionStart = Date.now();
    console.log('🔴 Ad detected at:', new Date().toLocaleTimeString());
  } else if (!adDetected && adDetectionStart) {
    const detectionTime = Date.now() - adDetectionStart;
    console.log('✅ Ad skipped in:', detectionTime + 'ms');
    adDetectionStart = null;
  }
}, 100);

// Stop monitoring after 2 minutes
setTimeout(() => clearInterval(monitor), 120000);
```

## 🔧 Configuration Tweaks

### Make Extension More Aggressive
```javascript
// Reduce detection interval (faster checking)
window.AdNullConfig.TIMING.CHECK_INTERVAL = 100; // 100ms

// Reduce skip delay
window.AdNullConfig.TIMING.SKIP_RETRY_DELAY = 50; // 50ms

// Increase max attempts
window.AdNullSkipper._maxSkipAttempts = 20;

// Restart extension to apply changes
window.adnullToggle();
window.adnullToggle();
```

### Enable All Strategies
```javascript
// Ensure all strategies are enabled
window.AdNullConfig.SKIP_STRATEGIES = {
  BUTTON_CLICK: true,
  VIDEO_SKIP: true,
  KEYBOARD_SKIP: true,
  AGGRESSIVE_SEARCH: true,
  MULTIPLE_ATTEMPTS: true
};
```

## 📞 Getting Help

If the extension still fails to skip videos:

1. **Run comprehensive diagnostic:**
   ```javascript
   window.adnullDebug()
   ```

2. **Test all strategies:**
   ```javascript
   window.adnullTestStrategies()
   ```

3. **Monitor in real-time:**
   ```javascript
   window.adnullMonitor(60000)
   ```

4. **Share the output** along with:
   - YouTube URL where ads fail
   - Browser version
   - Ad type (skippable/unskippable/bumper)
   - Language settings
   - Console error messages

## 🔄 Version 1.0.3 Improvements

- ✅ **Multiple simultaneous skip strategies**
- ✅ **Aggressive retry logic for stubborn ads**  
- ✅ **Enhanced button detection with visibility checks**
- ✅ **Video fast-forward with event dispatching**
- ✅ **Text-based search in all languages**
- ✅ **Generic area clicking for hidden buttons**
- ✅ **Real-time monitoring and debugging tools**
- ✅ **Faster detection (250ms intervals)**
- ✅ **Increased max attempts (15 instead of 10)**

The extension should now successfully skip significantly more ads than previous versions! 