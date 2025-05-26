# User Guide

## 🎯 Using AdNull YouTube Ad Blocker

This guide covers all features and settings of the AdNull extension to help you get the best ad-free YouTube experience.

### 🚀 Getting Started

#### First Launch
1. **Install the extension** (see [Installation Guide](installation.md))
2. **Navigate to YouTube** in any tab
3. **Click the AdNull icon** in your browser toolbar
4. **Review the popup** showing statistics and settings

#### Understanding the Interface
The extension popup shows:
- **Statistics**: Ads blocked today/total, time saved
- **Toggle switches**: For each blocking feature
- **Status indicator**: Shows if extension is active
- **Quick actions**: Emergency restore, settings reset

### ⚙️ Feature Overview

#### 🎬 Video Ad Blocking
**What it does**: Removes pre-roll, mid-roll, and post-roll video advertisements

**Settings**:
- **Block Video Ads**: Main toggle for video ad removal
- **Auto Skip**: Automatically clicks skip buttons when available
- **Speed Up Ads**: Accelerates unskippable ads to finish faster

**How it works**:
- Detects ad containers in the video player
- Removes overlay advertisements
- Blocks ad-related network requests

#### 📱 Sidebar Ad Blocking
**What it does**: Removes promotional content and ads in YouTube sidebars

**Settings**:
- **Block Sidebar Ads**: Removes ads in right sidebar and homepage

**Protected content**:
- Video recommendations remain intact
- Related videos are preserved
- Channel information stays visible

#### 🎞️ Shorts Ad Blocking
**What it does**: Removes advertisements from YouTube Shorts

**Settings**:
- **Block Shorts Ads**: Toggle for Shorts-specific ad removal

**Note**: This feature is more experimental and may need adjustment

#### 🛡️ Tracking Protection
**What it does**: Blocks analytics and tracking scripts

**Settings**:
- **Block Tracking**: Prevents data collection and analytics

**Benefits**:
- Improved privacy
- Faster page loading
- Reduced data usage

#### 🔒 Safety Mode
**What it does**: Ultra-conservative ad blocking to prevent content removal

**When to use**:
- If legitimate content is being hidden
- When experiencing navigation issues
- For maximum YouTube compatibility

**How it works**:
- Only removes elements with explicit ad data attributes
- Preserves all potentially legitimate content
- Provides safest blocking experience

### 🎛️ Settings Configuration

#### Recommended Settings for New Users
```
✅ Extension Enabled: ON
✅ Block Video Ads: ON
✅ Block Sidebar Ads: ON
⚠️ Block Shorts Ads: Test first
✅ Auto Skip: ON
⚠️ Speed Up Ads: Use carefully
✅ Block Tracking: ON
❌ Safety Mode: Only if issues occur
```

#### Advanced Users
```
✅ All blocking features: ON
✅ Speed Up Ads: ON (if comfortable)
❌ Safety Mode: OFF (for maximum blocking)
```

#### Conservative Users
```
✅ Block Video Ads: ON
❌ Block Sidebar Ads: OFF (keep recommendations)
✅ Auto Skip: ON
❌ Speed Up Ads: OFF (avoid detection)
✅ Block Tracking: ON
✅ Safety Mode: ON
```

### 📊 Statistics & Monitoring

#### Understanding Statistics
- **Ads Blocked Today**: Count resets at midnight
- **Total Ads Blocked**: Lifetime counter since installation
- **Time Saved**: Estimated time saved from skipped ads
- **Extension Status**: Shows if blocking is active

#### Resetting Statistics
1. Open the extension popup
2. Look for "Reset Stats" or similar option
3. Confirm the reset action

### 🚨 Emergency Features

#### When Content Goes Missing
If YouTube content disappears or navigation breaks:

1. **Disable Extension Temporarily**:
   - Click the extension icon
   - Toggle "Extension Enabled" to OFF
   - Refresh the page

2. **Enable Safety Mode**:
   - Click the extension icon
   - Toggle "Safety Mode" to ON
   - Refresh the page

3. **Use Emergency Restoration**:
   - Press `F12` to open Developer Tools
   - Go to Console tab
   - Type: `restoreContent()` and press Enter

#### Emergency Console Commands
Open Developer Tools (`F12`) and run these commands:

```javascript
// Restore all hidden content
restoreContent()

// Restore masthead/header specifically
restoreMasthead()

// Check what's being protected
console.log('Protected elements found')
```

### 🔧 Troubleshooting Common Issues

#### Search Bar Missing
**Symptoms**: YouTube search box is hidden or removed
**Solutions**:
1. Enable Safety Mode
2. Run `restoreMasthead()` in console
3. Disable "Block Sidebar Ads" temporarily

#### Video Links Not Working
**Symptoms**: Can't click on video thumbnails or titles
**Solutions**:
1. Disable extension temporarily
2. Enable Safety Mode
3. Check console for error messages

#### Related Videos Missing
**Symptoms**: No recommended videos in sidebar
**Solutions**:
1. Disable "Block Sidebar Ads"
2. Enable Safety Mode
3. Run `restoreContent()` in console

#### Extension Not Working
**Symptoms**: Ads still showing, no blocking activity
**Solutions**:
1. Check if extension is enabled
2. Refresh the YouTube page
3. Check browser permissions
4. Reinstall the extension

### 🎨 Customization Tips

#### Adjusting Blocking Aggressiveness
- **Maximum blocking**: All features ON, Safety Mode OFF
- **Balanced blocking**: Video ads ON, others selective
- **Minimal blocking**: Only video ads and auto-skip

#### Performance Optimization
- **Faster browsing**: Enable tracking protection
- **Compatibility**: Use Safety Mode
- **Battery saving**: Disable speed-up features

### 📱 Mobile Considerations

#### Chrome Mobile
- Extension works on Chrome for Android
- Some features may be limited
- Touch interactions may differ

#### iOS Limitations
- Chrome extensions not supported on iOS
- Consider alternative solutions

### 🔄 Updates & Maintenance

#### Keeping Updated
1. **Check for updates** regularly
2. **Read update notes** for new features
3. **Test new features** carefully
4. **Report issues** if found

#### Backup Settings
Settings are automatically saved to Chrome sync, but you can:
1. Note your preferred settings
2. Export settings (if feature available)
3. Document custom configurations

### 💡 Pro Tips

#### Maximizing Effectiveness
1. **Keep extension updated** for latest ad patterns
2. **Use Safety Mode** if you encounter issues
3. **Monitor statistics** to see blocking effectiveness
4. **Report false positives** to help improve the extension

#### Avoiding Detection
1. **Don't speed up ads excessively** (use 2-4x max)
2. **Vary your settings** occasionally
3. **Use Safety Mode** for important videos
4. **Keep tracking protection enabled**

#### Best Practices
1. **Test new settings** on less important videos first
2. **Keep emergency commands** bookmarked
3. **Monitor console** for error messages
4. **Refresh pages** after changing settings

### 🆘 Getting Help

#### Self-Help Resources
1. **Check this user guide** for common solutions
2. **Use emergency restoration** commands
3. **Try Safety Mode** for compatibility
4. **Check console logs** for error details

#### Reporting Issues
When reporting problems, include:
- **Browser version** and operating system
- **Extension settings** that were active
- **Specific YouTube page** where issue occurred
- **Console error messages** if any
- **Steps to reproduce** the problem

#### Community Support
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check other guides in this folder
- **Console debugging**: Use `F12` tools for investigation

---

**Next Steps**: For technical details, see the [Architecture Overview](architecture.md) or [API Reference](api-reference.md). 