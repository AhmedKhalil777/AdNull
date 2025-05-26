// AdNull Content Script - Main Orchestrator
(async function() {
  'use strict';
  
  // Wait for page to be ready
  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }
  
  // Initialize extension after a short delay
  setTimeout(async () => {
    try {
      await initializeExtension();
    } catch (error) {
      console.error('[AdNull] Failed to initialize:', error);
    }
  }, window.AdNullConfig?.TIMING?.INIT_DELAY || 300);
  
  /**
   * Initialize the extension
   */
  async function initializeExtension() {
    window.AdNullLogger.info('Initializing AdNull extension v1.0.3');
    
    // Load settings
    const settings = await window.AdNullStorage.getSettings();
    window.AdNullLogger.info('Loaded settings:', settings);
    
    // Initialize ad skipper
    await window.AdNullSkipper.init(settings);
    
    // Set up message listeners
    setupMessageListeners();
    
    // Expose global functions for testing
    setupGlobalFunctions();
    
    // Expose modules for debugging
    window.AdNull = {
      Config: window.AdNullConfig,
      Logger: window.AdNullLogger,
      Storage: window.AdNullStorage,
      Skipper: window.AdNullSkipper
    };
    
    window.AdNullLogger.info('AdNull extension initialized successfully with enhanced skip strategies');
  }
  
  /**
   * Set up Chrome extension message listeners
   */
  function setupMessageListeners() {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        handleMessage(message, sender, sendResponse);
        return true; // Keep message channel open for async response
      });
    }
  }
  
  /**
   * Handle messages from popup or other extension parts
   */
  async function handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'getStatus':
          const status = {
            extension: {
              enabled: true,
              version: window.AdNullConfig.VERSION
            },
            skipper: window.AdNullSkipper.getStatus(),
            settings: await window.AdNullStorage.getSettings()
          };
          sendResponse({ success: true, data: status });
          break;
          
        case 'updateSettings':
          await window.AdNullStorage.saveSettings(message.settings);
          window.AdNullSkipper.updateSettings(message.settings);
          sendResponse({ success: true });
          break;
          
        case 'skipAd':
          const result = await manualSkipAd();
          sendResponse({ success: true, data: result });
          break;
          
        case 'testDetection':
          const detection = testAdDetection();
          sendResponse({ success: true, data: detection });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      window.AdNullLogger.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  /**
   * Set up global functions for console testing
   */
  function setupGlobalFunctions() {
    // Global skip function
    window.adnullSkipAds = async function() {
      const result = await manualSkipAd();
      console.log('[AdNull] Manual skip result:', result);
      return result;
    };
    
    // Aggressive skip test
    window.adnullAggressiveSkip = function() {
      console.log('[AdNull] Running aggressive skip test...');
      window.AdNullSkipper.tryAllSkipMethods();
      return 'Aggressive skip methods executed';
    };
    
    // Global status function
    window.adnullStatus = function() {
      const status = {
        skipper: window.AdNullSkipper.getStatus(),
        detection: testAdDetection(),
        settings: window.AdNullStorage.getSettings()
      };
      console.log('[AdNull] Current status:', status);
      return status;
    };
    
    // Global settings function
    window.adnullSettings = async function() {
      const settings = await window.AdNullStorage.getSettings();
      console.log('[AdNull] Current settings:', settings);
      return settings;
    };
    
    // Global toggle function
    window.adnullToggle = async function() {
      const settings = await window.AdNullStorage.getSettings();
      settings.enabled = !settings.enabled;
      await window.AdNullStorage.saveSettings(settings);
      window.AdNullSkipper.updateSettings(settings);
      console.log('[AdNull] Extension toggled:', settings.enabled ? 'ON' : 'OFF');
      return settings;
    };
    
    // Enhanced debugging function
    window.adnullDebug = function() {
      const debug = {
        adDetected: window.AdNullSkipper.isAdPlaying(),
        skipButton: window.AdNullSkipper.findSkipButton(),
        adIndicators: testAdIndicators(),
        videoInfo: getVideoInfo(),
        pageInfo: getPageInfo(),
        language: window.AdNullSkipper.detectPageLanguage(),
        skipTexts: window.AdNullSkipper.getLanguageSpecificSkipTexts().slice(0, 10), // First 10 patterns
        skipperStatus: window.AdNullSkipper.getStatus(),
        strategies: window.AdNullConfig.SKIP_STRATEGIES,
        timing: window.AdNullConfig.TIMING
      };
      console.log('[AdNull] Debug info:', debug);
      return debug;
    };
    
    // Test ad detection
    window.adnullTestDetection = function() {
      const result = testAdDetection();
      console.log('[AdNull] Ad detection test:', result);
      return result;
    };
    
    // Arabic language specific test
    window.adnullTestArabic = function() {
      const arabicTest = {
        language: window.AdNullSkipper.detectPageLanguage(),
        isArabic: window.AdNullSkipper.detectPageLanguage() === 'ar',
        arabicSkipTexts: ['تخطي', 'تخطى', 'تجاوز'],
        foundArabicButtons: [],
        foundArabicText: []
      };
      
      // Look for Arabic skip buttons
      arabicTest.arabicSkipTexts.forEach(text => {
        const buttons = document.querySelectorAll(`button[aria-label*="${text}"], [aria-label*="${text}"]`);
        if (buttons.length > 0) {
          arabicTest.foundArabicButtons.push({
            text: text,
            count: buttons.length,
            elements: Array.from(buttons).map(btn => btn.outerHTML.substring(0, 100))
          });
        }
        
        // Look for text content
        const textElements = document.querySelectorAll('button, div, span');
        textElements.forEach(el => {
          if (el.textContent && el.textContent.includes(text)) {
            arabicTest.foundArabicText.push({
              text: text,
              element: el.outerHTML.substring(0, 100)
            });
          }
        });
      });
      
      console.log('[AdNull] Arabic test:', arabicTest);
      return arabicTest;
    };
    
    // Test all skip strategies
    window.adnullTestStrategies = function() {
      const strategies = {
        buttonClick: false,
        aggressiveSearch: false,
        videoSkip: false,
        keyboardSkip: false,
        textSearch: false
      };
      
      console.log('[AdNull] Testing all skip strategies...');
      
      // Test button click
      const skipButton = window.AdNullSkipper.findSkipButton();
      if (skipButton) {
        strategies.buttonClick = true;
        console.log('✅ Skip button found:', skipButton);
      } else {
        console.log('❌ No skip button found');
      }
      
      // Test aggressive search
      try {
        window.AdNullSkipper.aggressiveButtonSearch();
        strategies.aggressiveSearch = true;
        console.log('✅ Aggressive search executed');
      } catch (error) {
        console.log('❌ Aggressive search failed:', error);
      }
      
      // Test video skip
      try {
        window.AdNullSkipper.tryVideoSkip();
        strategies.videoSkip = true;
        console.log('✅ Video skip executed');
      } catch (error) {
        console.log('❌ Video skip failed:', error);
      }
      
      // Test keyboard skip
      try {
        window.AdNullSkipper.tryKeyboardSkip();
        strategies.keyboardSkip = true;
        console.log('✅ Keyboard skip executed');
      } catch (error) {
        console.log('❌ Keyboard skip failed:', error);
      }
      
      // Test text search
      try {
        window.AdNullSkipper.searchByTextContent();
        strategies.textSearch = true;
        console.log('✅ Text search executed');
      } catch (error) {
        console.log('❌ Text search failed:', error);
      }
      
      console.log('[AdNull] Strategy test results:', strategies);
      return strategies;
    };
    
    // Monitor ads in real-time
    window.adnullMonitor = function(duration = 30000) {
      console.log(`[AdNull] Starting ad monitor for ${duration/1000} seconds...`);
      
      const startTime = Date.now();
      const monitorInterval = setInterval(() => {
        const status = window.AdNullSkipper.getStatus();
        if (status.adDetected) {
          console.log('🔴 AD DETECTED:', {
            attempts: status.skipAttempts,
            timeSinceStart: status.timeSinceAdStart,
            language: status.language
          });
        }
        
        if (Date.now() - startTime > duration) {
          clearInterval(monitorInterval);
          console.log('[AdNull] Ad monitoring stopped');
        }
      }, 1000);
      
      return 'Ad monitoring started';
    };
  }
  
  /**
   * Manual ad skip function (enhanced)
   */
  async function manualSkipAd() {
    try {
      console.log('[AdNull] Attempting manual skip...');
      
      // Try primary skip button first
      const skipButton = window.AdNullSkipper.findSkipButton();
      
      if (skipButton) {
        window.AdNullSkipper.skipAd(skipButton);
        return {
          success: true,
          method: 'button_click',
          button: skipButton.outerHTML.substring(0, 100)
        };
      } else {
        // Try all available methods
        console.log('[AdNull] No skip button found, trying all methods...');
        window.AdNullSkipper.tryAllSkipMethods();
        return {
          success: true,
          method: 'all_methods',
          message: 'Tried all available skip methods'
        };
      }
    } catch (error) {
      window.AdNullLogger.error('Manual skip failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Test ad detection (enhanced)
   */
  function testAdDetection() {
    const results = {
      adDetected: false,
      indicators: [],
      skipButtons: [],
      videoSrc: null,
      adModule: null,
      strategies: window.AdNullConfig.SKIP_STRATEGIES,
      timing: window.AdNullConfig.TIMING
    };
    
    // Check ad indicators
    for (const selector of window.AdNullConfig.AD_INDICATORS) {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) {
        results.indicators.push({
          selector,
          found: true,
          visible: true,
          element: element.outerHTML.substring(0, 100)
        });
        results.adDetected = true;
      }
    }
    
    // Check skip buttons
    for (const selector of window.AdNullConfig.SKIP_SELECTORS) {
      const button = document.querySelector(selector);
      if (button) {
        results.skipButtons.push({
          selector,
          found: true,
          clickable: window.AdNullSkipper.isButtonClickable(button),
          element: button.outerHTML.substring(0, 100)
        });
      }
    }
    
    // Check video source
    const video = document.querySelector('video');
    if (video) {
      results.videoSrc = video.src || video.currentSrc || 'no src';
    }
    
    // Check ad module specifically
    const adModule = document.querySelector('.ytp-ad-module');
    if (adModule) {
      results.adModule = {
        found: true,
        hasContent: adModule.innerHTML.trim() !== '',
        content: adModule.innerHTML.substring(0, 200)
      };
    }
    
    return results;
  }
  
  /**
   * Test individual ad indicators
   */
  function testAdIndicators() {
    const indicators = {};
    for (const selector of window.AdNullConfig.AD_INDICATORS) {
      const element = document.querySelector(selector);
      indicators[selector] = {
        found: !!element,
        visible: element ? element.offsetParent !== null : false
      };
    }
    return indicators;
  }
  
  /**
   * Get video information
   */
  function getVideoInfo() {
    const video = document.querySelector('video');
    if (!video) return null;
    
    return {
      src: video.src || video.currentSrc || 'no src',
      duration: video.duration,
      currentTime: video.currentTime,
      paused: video.paused,
      muted: video.muted,
      volume: video.volume,
      isAd: (video.src || video.currentSrc || '').includes('googleads') || 
            (video.src || video.currentSrc || '').includes('doubleclick')
    };
  }
  
  /**
   * Get page information
   */
  function getPageInfo() {
    return {
      url: window.location.href,
      title: document.title,
      isYouTube: window.location.hostname.includes('youtube.com'),
      readyState: document.readyState,
      language: document.documentElement.lang || 'unknown'
    };
  }
  
})(); 