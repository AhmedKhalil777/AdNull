// AdNull Ad Skipper Module
window.AdNullSkipper = {
  
  // Internal state
  _isRunning: false,
  _intervalId: null,
  _aggressiveIntervalId: null,
  _settings: null,
  _skipAttempts: 0,
  _maxSkipAttempts: 15, // Increased from 10
  _lastAdDetected: 0,
  _skipStartTime: 0,
  
  /**
   * Initialize the ad skipper
   * @param {Object} settings - Extension settings
   */
  async init(settings) {
    this._settings = settings;
    
    if (!this._settings.enabled || !this._settings.autoSkip) {
      window.AdNullLogger.info('Ad skipper disabled in settings');
      return;
    }
    
    this.start();
  },
  
  /**
   * Start the ad skipper
   */
  start() {
    if (this._isRunning) {
      window.AdNullLogger.debug('Ad skipper already running');
      return;
    }
    
    window.AdNullLogger.info('Starting ad skipper with enhanced detection');
    this._isRunning = true;
    
    // Primary detection interval
    this._intervalId = setInterval(() => {
      this.checkAndSkipAds();
    }, window.AdNullConfig.TIMING.CHECK_INTERVAL);
    
    // Aggressive retry interval for stubborn ads
    this._aggressiveIntervalId = setInterval(() => {
      this.aggressiveSkipAttempt();
    }, window.AdNullConfig.TIMING.AGGRESSIVE_RETRY_INTERVAL);
  },
  
  /**
   * Stop the ad skipper
   */
  stop() {
    if (!this._isRunning) {
      return;
    }
    
    window.AdNullLogger.info('Stopping ad skipper');
    this._isRunning = false;
    
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    
    if (this._aggressiveIntervalId) {
      clearInterval(this._aggressiveIntervalId);
      this._aggressiveIntervalId = null;
    }
  },
  
  /**
   * Check for ads and skip them if found
   */
  checkAndSkipAds() {
    if (!this._settings?.enabled || !this._settings?.autoSkip) {
      return;
    }
    
    try {
      const adDetected = this.isAdPlaying();
      
      if (adDetected) {
        // Track when ad was first detected
        if (this._lastAdDetected === 0) {
          this._lastAdDetected = Date.now();
          this._skipStartTime = Date.now();
          this._skipAttempts = 0;
          window.AdNullLogger.info('New ad detected, starting skip attempts');
        }
        
        // Try multiple skip strategies simultaneously
        this.executeSkipStrategies();
        
      } else {
        // Reset when no ad is playing
        if (this._lastAdDetected > 0) {
          window.AdNullLogger.info('Ad no longer detected, resetting counters');
          this._lastAdDetected = 0;
          this._skipAttempts = 0;
          this._skipStartTime = 0;
        }
      }
    } catch (error) {
      window.AdNullLogger.error('Error checking for ads', error);
    }
  },
  
  /**
   * Execute multiple skip strategies simultaneously
   */
  executeSkipStrategies() {
    const strategies = window.AdNullConfig.SKIP_STRATEGIES;
    
    // Strategy 1: Button clicking
    if (strategies.BUTTON_CLICK) {
      const skipButton = this.findSkipButton();
      if (skipButton) {
        this.skipAd(skipButton);
        return; // If button found, prioritize it
      }
    }
    
    // Strategy 2: Aggressive search for any skip-like elements
    if (strategies.AGGRESSIVE_SEARCH) {
      this.aggressiveButtonSearch();
    }
    
    // Strategy 3: Video manipulation
    if (strategies.VIDEO_SKIP) {
      setTimeout(() => {
        this.tryVideoSkip();
      }, window.AdNullConfig.TIMING.VIDEO_SKIP_DELAY);
    }
    
    // Strategy 4: Keyboard shortcuts
    if (strategies.KEYBOARD_SKIP) {
      this.tryKeyboardSkip();
    }
  },
  
  /**
   * Aggressive skip attempt for stubborn ads
   */
  aggressiveSkipAttempt() {
    if (!this._isRunning || !this.isAdPlaying()) {
      return;
    }
    
    const timeSinceStart = Date.now() - this._skipStartTime;
    
    // If we've been trying for more than max wait time, try everything
    if (timeSinceStart > window.AdNullConfig.TIMING.MAX_SKIP_WAIT) {
      window.AdNullLogger.warn('Ad taking too long to skip, trying aggressive methods');
      this.tryAllSkipMethods();
    }
  },
  
  /**
   * Try all available skip methods aggressively
   */
  tryAllSkipMethods() {
    try {
      // Method 1: Try all possible button selectors
      this.tryAllButtonSelectors();
      
      // Method 2: Search by text content
      this.searchByTextContent();
      
      // Method 3: Video manipulation
      this.tryVideoSkip();
      
      // Method 4: Keyboard events
      this.tryKeyboardSkip();
      
      // Method 5: Click anywhere that might be a skip button
      this.tryGenericClicks();
      
    } catch (error) {
      window.AdNullLogger.error('Error in aggressive skip methods', error);
    }
  },
  
  /**
   * Try all button selectors one by one
   */
  tryAllButtonSelectors() {
    for (const selector of window.AdNullConfig.SKIP_SELECTORS) {
      try {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
          if (this.isButtonClickable(button)) {
            window.AdNullLogger.debug('Trying selector:', selector);
            this.performClick(button);
          }
        });
      } catch (error) {
        // Continue with next selector
      }
    }
  },
  
  /**
   * Search for skip buttons by text content
   */
  searchByTextContent() {
    const skipTexts = this.getLanguageSpecificSkipTexts();
    
    for (const text of skipTexts) {
      try {
        // Search in all clickable elements
        const elements = document.querySelectorAll('button, div[role="button"], span[role="button"], a, [onclick]');
        
        for (const element of elements) {
          if (element.textContent && element.textContent.toLowerCase().includes(text.toLowerCase())) {
            if (this.isButtonClickable(element)) {
              window.AdNullLogger.debug('Found skip text:', text, element);
              this.performClick(element);
            }
          }
        }
      } catch (error) {
        // Continue with next text
      }
    }
  },
  
  /**
   * Try generic clicks on potential skip areas
   */
  tryGenericClicks() {
    try {
      // Look for elements in typical skip button locations
      const potentialSkipAreas = [
        '.ytp-ad-overlay',
        '.ytp-ad-player-overlay',
        '.ytp-ad-skip-button-container',
        '[class*="skip"]',
        '[class*="Skip"]'
      ];
      
      for (const selector of potentialSkipAreas) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Look for clickable children
          const clickableChildren = element.querySelectorAll('button, div[role="button"], span[role="button"]');
          clickableChildren.forEach(child => {
            if (this.isButtonClickable(child)) {
              this.performClick(child);
            }
          });
        });
      }
    } catch (error) {
      window.AdNullLogger.error('Error in generic clicks', error);
    }
  },
  
  /**
   * Enhanced video skip method
   */
  tryVideoSkip() {
    try {
      const video = document.querySelector('video');
      if (!video) return;
      
      // Method 1: Fast forward to end
      if (video.duration && isFinite(video.duration) && video.duration > 0) {
        window.AdNullLogger.debug('Fast-forwarding video to end');
        video.currentTime = video.duration - 0.1; // Leave small buffer
      }
      
      // Method 2: Try to trigger ended event
      setTimeout(() => {
        if (video.duration && isFinite(video.duration)) {
          video.currentTime = video.duration;
          
          // Dispatch ended event
          const endedEvent = new Event('ended');
          video.dispatchEvent(endedEvent);
          
          // Dispatch timeupdate event
          const timeupdateEvent = new Event('timeupdate');
          video.dispatchEvent(timeupdateEvent);
        }
      }, 100);
      
    } catch (error) {
      window.AdNullLogger.error('Error in video skip', error);
    }
  },
  
  /**
   * Aggressive button search using multiple methods
   */
  aggressiveButtonSearch() {
    try {
      // Method 1: Search by partial class names
      const partialClasses = ['skip', 'Skip', 'SKIP', 'ad-skip', 'ytp-ad'];
      for (const partial of partialClasses) {
        const elements = document.querySelectorAll(`[class*="${partial}"]`);
        elements.forEach(element => {
          if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
            if (this.isButtonClickable(element)) {
              this.performClick(element);
            }
          }
        });
      }
      
      // Method 2: Search by aria-label patterns
      const ariaPatterns = ['skip', 'Skip', 'تخطي', 'تخطى', 'تجاوز'];
      for (const pattern of ariaPatterns) {
        const elements = document.querySelectorAll(`[aria-label*="${pattern}"]`);
        elements.forEach(element => {
          if (this.isButtonClickable(element)) {
            this.performClick(element);
          }
        });
      }
      
    } catch (error) {
      window.AdNullLogger.error('Error in aggressive button search', error);
    }
  },
  
  /**
   * Check if an ad is currently playing (enhanced detection)
   */
  isAdPlaying() {
    // Check for ad indicators
    for (const selector of window.AdNullConfig.AD_INDICATORS) {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) {
        window.AdNullLogger.debug('Ad detected via indicator', selector);
        return true;
      }
    }
    
    // Check video element for ad attributes
    const video = document.querySelector('video');
    if (video) {
      // Check if video src contains ad indicators
      const src = video.src || video.currentSrc || '';
      if (src.includes('googleads') || src.includes('doubleclick') || src.includes('googlevideo.com/videoplayback') && src.includes('&adurl=')) {
        window.AdNullLogger.debug('Ad detected via video src');
        return true;
      }
      
      // Check for ad-related classes on video container
      const container = video.closest('.html5-video-container, .ytp-player-content');
      if (container && container.querySelector('.ytp-ad-module, .ytp-ad-overlay-container')) {
        window.AdNullLogger.debug('Ad detected via container');
        return true;
      }
      
      // Check video duration for typical ad lengths
      if (video.duration && (video.duration === 6 || video.duration === 15 || video.duration === 30)) {
        const adOverlay = document.querySelector('.ytp-ad-overlay, .ytp-ad-text');
        if (adOverlay) {
          window.AdNullLogger.debug('Ad detected via duration and overlay');
          return true;
        }
      }
    }
    
    return false;
  },
  
  /**
   * Find a skip button on the page (enhanced)
   */
  findSkipButton() {
    // Try selectors in order of priority
    for (const selector of window.AdNullConfig.SKIP_SELECTORS) {
      try {
        const button = document.querySelector(selector);
        if (button && this.isButtonClickable(button)) {
          window.AdNullLogger.debug('Found skip button', selector);
          return button;
        }
      } catch (error) {
        // Continue with next selector
      }
    }
    return null;
  },
  
  /**
   * Check if a button is clickable (enhanced)
   */
  isButtonClickable(button) {
    if (!button) return false;
    
    try {
      const style = getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      
      return button.offsetParent !== null && 
             !button.disabled && 
             style.visibility !== 'hidden' &&
             style.display !== 'none' &&
             style.opacity !== '0' &&
             style.pointerEvents !== 'none' &&
             rect.width > 0 &&
             rect.height > 0 &&
             rect.top >= 0 && // Not above viewport
             rect.left >= 0;  // Not to the left of viewport
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Skip an ad by clicking the skip button (enhanced)
   */
  skipAd(button) {
    try {
      this._skipAttempts++;
      
      // Immediate click attempt
      this.performClick(button);
      window.AdNullLogger.info(`Ad skip attempted (attempt ${this._skipAttempts})`);
      
      // Verify success after delay
      setTimeout(() => {
        if (this.isAdPlaying() && this._skipAttempts < this._maxSkipAttempts) {
          window.AdNullLogger.warn('Skip attempt failed, trying alternative methods');
          this.tryAlternativeSkipMethods();
        } else if (!this.isAdPlaying()) {
          window.AdNullLogger.info('Ad skipped successfully');
          this._skipAttempts = 0;
          this._lastAdDetected = 0;
        }
      }, window.AdNullConfig.TIMING.SKIP_RETRY_DELAY);
      
    } catch (error) {
      window.AdNullLogger.error('Failed to skip ad', error);
    }
  },
  
  /**
   * Perform click with multiple methods (enhanced)
   */
  performClick(button) {
    try {
      // Method 1: Standard click
      button.click();
      
      // Method 2: Mouse events
      const mouseEvents = ['mousedown', 'mouseup', 'click'];
      mouseEvents.forEach(eventType => {
        const event = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0
        });
        button.dispatchEvent(event);
      });
      
      // Method 3: Focus and trigger
      if (button.focus) {
        button.focus();
        button.click();
      }
      
      // Method 4: Touch events for mobile
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true
      });
      button.dispatchEvent(touchEvent);
      
    } catch (error) {
      window.AdNullLogger.error('Error performing click', error);
    }
  },
  
  /**
   * Try alternative methods to skip ads (enhanced)
   */
  tryAlternativeSkipMethods() {
    if (this._skipAttempts >= this._maxSkipAttempts) {
      window.AdNullLogger.warn('Max skip attempts reached, trying final methods');
      this.tryAllSkipMethods();
      return;
    }
    
    try {
      // Method 1: Enhanced video skip
      this.tryVideoSkip();
      
      // Method 2: Text-based search
      this.searchByTextContent();
      
      // Method 3: Keyboard shortcuts
      this.tryKeyboardSkip();
      
      // Method 4: Generic area clicks
      this.tryGenericClicks();
      
    } catch (error) {
      window.AdNullLogger.error('Error in alternative skip methods', error);
    }
  },
  
  /**
   * Detect the current page language
   * @returns {string} Language code (e.g., 'ar', 'en', 'es')
   */
  detectPageLanguage() {
    // Check HTML lang attribute
    const htmlLang = document.documentElement.lang || document.documentElement.getAttribute('lang');
    if (htmlLang) {
      return htmlLang.toLowerCase().substring(0, 2);
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('hl') || urlParams.get('lang');
    if (urlLang) {
      return urlLang.toLowerCase().substring(0, 2);
    }
    
    // Check for Arabic text in the page
    const pageText = document.body.textContent || '';
    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(pageText)) {
      return 'ar';
    }
    
    // Default to English
    return 'en';
  },
  
  /**
   * Get language-specific skip text patterns
   * @returns {Array} Array of skip text patterns for current language
   */
  getLanguageSpecificSkipTexts() {
    const language = this.detectPageLanguage();
    const allPatterns = window.AdNullConfig.SKIP_TEXT_PATTERNS;
    
    // Return all patterns, but prioritize current language
    if (language === 'ar') {
      // Arabic patterns first
      return [
        'تخطي', 'تخطى', 'تجاوز', 'تخطي الإعلان', 'تخطى الإعلان',
        ...allPatterns
      ];
    }
    
    return allPatterns;
  },
  
  /**
   * Try keyboard shortcuts to skip (enhanced)
   */
  tryKeyboardSkip() {
    try {
      // Method 1: Tab + Enter
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', keyCode: 9, bubbles: true });
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true });
      
      document.dispatchEvent(tabEvent);
      setTimeout(() => {
        document.dispatchEvent(enterEvent);
      }, 50);
      
      // Method 2: Space key (common skip shortcut)
      setTimeout(() => {
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ', keyCode: 32, bubbles: true });
        document.dispatchEvent(spaceEvent);
      }, 100);
      
      // Method 3: Escape key
      setTimeout(() => {
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true });
        document.dispatchEvent(escapeEvent);
      }, 150);
      
    } catch (error) {
      window.AdNullLogger.error('Error with keyboard skip', error);
    }
  },
  
  /**
   * Update settings and restart if needed
   * @param {Object} newSettings - New settings
   */
  updateSettings(newSettings) {
    const wasRunning = this._isRunning;
    this._settings = newSettings;
    
    if (wasRunning) {
      this.stop();
    }
    
    if (newSettings.enabled && newSettings.autoSkip) {
      this.start();
    }
  },
  
  /**
   * Get current status (enhanced)
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isRunning: this._isRunning,
      enabled: this._settings?.enabled || false,
      autoSkip: this._settings?.autoSkip || false,
      skipAttempts: this._skipAttempts,
      maxSkipAttempts: this._maxSkipAttempts,
      adDetected: this.isAdPlaying(),
      lastAdDetected: this._lastAdDetected,
      timeSinceAdStart: this._lastAdDetected > 0 ? Date.now() - this._lastAdDetected : 0,
      language: this.detectPageLanguage(),
      strategies: window.AdNullConfig.SKIP_STRATEGIES
    };
  }
}; 