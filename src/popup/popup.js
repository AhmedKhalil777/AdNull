// AdNull Popup Script
class AdNullPopup {
  
  constructor() {
    this.elements = {};
    this.currentSettings = null;
    this.init();
  }
  
  /**
   * Initialize the popup
   */
  async init() {
    try {
      this.bindElements();
      this.bindEvents();
      await this.loadCurrentSettings();
      this.updateUI();
    } catch (error) {
      console.error('[AdNull Popup] Initialization failed:', error);
      this.showError('Failed to initialize popup');
    }
  }
  
  /**
   * Bind DOM elements
   */
  bindElements() {
    this.elements = {
      enabledToggle: document.getElementById('enabledToggle'),
      autoSkipToggle: document.getElementById('autoSkipToggle'),
      skipDelaySelect: document.getElementById('skipDelaySelect'),
      statusText: document.getElementById('statusText'),
      testButton: document.getElementById('testButton'),
      resetButton: document.getElementById('resetButton')
    };
    
    // Verify all elements exist
    for (const [name, element] of Object.entries(this.elements)) {
      if (!element) {
        throw new Error(`Element not found: ${name}`);
      }
    }
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Toggle events
    this.elements.enabledToggle.addEventListener('change', () => {
      this.updateSetting('enabled', this.elements.enabledToggle.checked);
    });
    
    this.elements.autoSkipToggle.addEventListener('change', () => {
      this.updateSetting('autoSkip', this.elements.autoSkipToggle.checked);
    });
    
    this.elements.skipDelaySelect.addEventListener('change', () => {
      this.updateSetting('skipDelay', parseInt(this.elements.skipDelaySelect.value));
    });
    
    // Button events
    this.elements.testButton.addEventListener('click', () => {
      this.testSkipFunction();
    });
    
    this.elements.resetButton.addEventListener('click', () => {
      this.resetSettings();
    });
  }
  
  /**
   * Load current settings from content script
   */
  async loadCurrentSettings() {
    try {
      const tabs = await this.getActiveTab();
      if (!tabs || tabs.length === 0) {
        throw new Error('No active tab found');
      }
      
      const response = await this.sendMessageToTab(tabs[0].id, { action: 'getStatus' });
      
      if (response && response.success) {
        this.currentSettings = response.settings;
        console.log('[AdNull Popup] Settings loaded:', this.currentSettings);
      } else {
        throw new Error(response?.error || 'Failed to get status');
      }
    } catch (error) {
      console.error('[AdNull Popup] Failed to load settings:', error);
      // Use default settings as fallback
      this.currentSettings = {
        enabled: true,
        autoSkip: true,
        skipDelay: 1000
      };
    }
  }
  
  /**
   * Update UI with current settings
   */
  updateUI() {
    if (!this.currentSettings) return;
    
    // Update toggles
    this.elements.enabledToggle.checked = this.currentSettings.enabled;
    this.elements.autoSkipToggle.checked = this.currentSettings.autoSkip;
    this.elements.skipDelaySelect.value = this.currentSettings.skipDelay.toString();
    
    // Update status
    this.updateStatus();
    
    // Enable/disable controls based on main toggle
    this.updateControlStates();
  }
  
  /**
   * Update status display
   */
  updateStatus() {
    const isActive = this.currentSettings.enabled && this.currentSettings.autoSkip;
    
    if (isActive) {
      this.elements.statusText.textContent = 'Active';
      this.elements.statusText.className = 'status-value active';
    } else {
      this.elements.statusText.textContent = 'Inactive';
      this.elements.statusText.className = 'status-value inactive';
    }
  }
  
  /**
   * Update control states based on settings
   */
  updateControlStates() {
    const enabled = this.currentSettings.enabled;
    
    this.elements.autoSkipToggle.disabled = !enabled;
    this.elements.skipDelaySelect.disabled = !enabled || !this.currentSettings.autoSkip;
    this.elements.testButton.disabled = !enabled;
  }
  
  /**
   * Update a specific setting
   */
  async updateSetting(key, value) {
    try {
      this.currentSettings[key] = value;
      
      const tabs = await this.getActiveTab();
      if (tabs && tabs.length > 0) {
        const response = await this.sendMessageToTab(tabs[0].id, {
          action: 'updateSettings',
          settings: { [key]: value }
        });
        
        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to update setting');
        }
      }
      
      this.updateUI();
      console.log(`[AdNull Popup] Updated ${key}:`, value);
      
    } catch (error) {
      console.error('[AdNull Popup] Failed to update setting:', error);
      this.showError(`Failed to update ${key}`);
      // Revert UI change
      this.updateUI();
    }
  }
  
  /**
   * Test the skip function
   */
  async testSkipFunction() {
    try {
      this.elements.testButton.disabled = true;
      this.elements.testButton.textContent = 'Testing...';
      
      const tabs = await this.getActiveTab();
      if (tabs && tabs.length > 0) {
        // Execute test function in content script
        await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (typeof window.adnullSkipAds === 'function') {
              window.adnullSkipAds();
              console.log('[AdNull] Test skip function executed');
            } else {
              console.warn('[AdNull] Skip function not available');
            }
          }
        });
      }
      
      setTimeout(() => {
        this.elements.testButton.disabled = false;
        this.elements.testButton.textContent = 'Test Skip';
      }, 1000);
      
    } catch (error) {
      console.error('[AdNull Popup] Test failed:', error);
      this.elements.testButton.disabled = false;
      this.elements.testButton.textContent = 'Test Skip';
      this.showError('Test failed');
    }
  }
  
  /**
   * Reset settings to defaults
   */
  async resetSettings() {
    try {
      const defaultSettings = {
        enabled: true,
        autoSkip: true,
        skipDelay: 1000
      };
      
      const tabs = await this.getActiveTab();
      if (tabs && tabs.length > 0) {
        const response = await this.sendMessageToTab(tabs[0].id, {
          action: 'updateSettings',
          settings: defaultSettings
        });
        
        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to reset settings');
        }
      }
      
      this.currentSettings = defaultSettings;
      this.updateUI();
      console.log('[AdNull Popup] Settings reset to defaults');
      
    } catch (error) {
      console.error('[AdNull Popup] Failed to reset settings:', error);
      this.showError('Failed to reset settings');
    }
  }
  
  /**
   * Get active tab
   */
  async getActiveTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve);
    });
  }
  
  /**
   * Send message to tab
   */
  async sendMessageToTab(tabId, message) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[AdNull Popup] Message error:', chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  /**
   * Show error message
   */
  showError(message) {
    this.elements.statusText.textContent = message;
    this.elements.statusText.className = 'status-value inactive';
    
    setTimeout(() => {
      this.updateStatus();
    }, 3000);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdNullPopup();
}); 