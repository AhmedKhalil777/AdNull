// AdNull Configuration Module
window.AdNullConfig = {
  // Extension settings
  DEFAULT_SETTINGS: {
    enabled: true,
    autoSkip: true,
    skipDelay: 250 // Reduced to 250ms for even faster skipping
  },
  
  // Ad skip button selectors (updated with latest YouTube selectors + Arabic support)
  SKIP_SELECTORS: [
    '.ytp-ad-skip-button',
    '.ytp-skip-ad-button', 
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-container button',
    '.ytp-ad-skip-button-container .ytp-ad-skip-button',
    '.videoAdUiSkipButton',
    'button[class*="skip"]',
    'button[class*="Skip"]',
    'button[aria-label*="Skip"]',
    'button[aria-label*="skip"]',
    'button[aria-label*="تخطي"]',  // Arabic "Skip"
    'button[aria-label*="تخطى"]',  // Arabic "Skip" alternative
    'button[aria-label*="تجاوز"]', // Arabic "Skip/Bypass"
    '.ytp-ad-skip-button-slot button',
    '.ytp-ad-overlay .ytp-ad-skip-button',
    '.ytp-ad-overlay button',
    '[data-testid="ad-skip-button"]',
    '[data-testid="skip-button"]',
    'button.ytp-ad-skip-button-modern',
    'button.ytp-ad-skip-button-text',
    '.ad-container button[aria-label*="Skip"]',
    '.ad-container button[aria-label*="تخطي"]',
    // Additional YouTube ad button patterns
    '.ytp-ad-button',
    '.ytp-ad-visit-advertiser-button + button',
    'button[class*="ytp-ad"]',
    // Generic skip patterns
    'button:contains("Skip")',
    'div[role="button"]:contains("Skip")',
    'span[role="button"]:contains("Skip")'
  ],
  
  // Skip button text patterns (multilingual)
  SKIP_TEXT_PATTERNS: [
    // English
    'skip', 'Skip', 'SKIP', 'Skip Ad', 'Skip ad', 'skip ad', 'Skip this ad',
    // Arabic
    'تخطي', 'تخطى', 'تجاوز', 'تخطي الإعلان', 'تخطى الإعلان',
    // Spanish
    'Omitir', 'Saltar', 'omitir', 'Saltar anuncio',
    // French  
    'Ignorer', 'Passer', 'ignorer', 'Passer l\'annonce',
    // German
    'Überspringen', 'überspringen', 'Werbung überspringen',
    // Portuguese
    'Pular', 'Ignorar', 'pular', 'Pular anúncio',
    // Russian
    'Пропустить', 'пропустить', 'Пропустить рекламу',
    // Chinese
    '跳过', '跳過', '跳过广告',
    // Japanese
    'スキップ', 'スキップする', '広告をスキップ',
    // Korean
    '건너뛰기', '건너뛰다', '광고 건너뛰기'
  ],
  
  // Ad detection selectors (enhanced)
  AD_INDICATORS: [
    '.ytp-ad-module',
    '.ytp-ad-overlay-container',
    '.ytp-ad-player-overlay',
    '.ytp-ad-player-overlay-instream-info',
    '.video-ads',
    '.ytp-ad-text',
    '.ytp-ad-preview-container',
    '.ytp-ad-image-overlay',
    '[class*="ad-showing"]',
    '[class*="ad-interrupting"]',
    '.ad-container',
    '.ytp-ad-overlay',
    '.ytp-ad-display-container',
    // Video element indicators
    'video[src*="googleads"]',
    'video[src*="doubleclick"]',
    // Player state indicators
    '.ytp-ad-player-overlay-layout',
    '.ytp-ad-player-overlay-skip-or-preview'
  ],
  
  // Timing constants (more aggressive)
  TIMING: {
    CHECK_INTERVAL: 250,     // Check for ads every 250ms (very fast detection)
    INIT_DELAY: 300,         // Wait 300ms before initializing
    RETRY_DELAY: 50,         // Retry delay for failed operations
    SKIP_RETRY_DELAY: 100,   // Retry skip attempts every 100ms
    MAX_SKIP_WAIT: 10000,    // Maximum time to wait for skip button (10 seconds)
    AGGRESSIVE_RETRY_INTERVAL: 500, // Aggressive retry every 500ms
    VIDEO_SKIP_DELAY: 100    // Delay before video fast-forward
  },
  
  // Skip strategies
  SKIP_STRATEGIES: {
    BUTTON_CLICK: true,      // Try clicking skip buttons
    VIDEO_SKIP: true,        // Try fast-forwarding video
    KEYBOARD_SKIP: true,     // Try keyboard shortcuts
    AGGRESSIVE_SEARCH: true, // Search for any skip-like elements
    MULTIPLE_ATTEMPTS: true  // Try multiple methods simultaneously
  },
  
  // Logging levels
  LOG_LEVELS: {
    ERROR: 0,
    WARN: 1, 
    INFO: 2,
    DEBUG: 3
  },
  
  // Current log level (change to control verbosity)
  CURRENT_LOG_LEVEL: 2, // INFO level
  
  // Extension metadata
  EXTENSION_NAME: 'AdNull',
  VERSION: '1.0.3'
}; 