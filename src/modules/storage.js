// AdNull Storage Module
window.AdNullStorage = {
  
  /**
   * Load settings from Chrome storage
   * @returns {Promise<Object>} Settings object
   */
  async loadSettings() {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage) {
        window.AdNullLogger.warn('Chrome storage not available, using defaults');
        return window.AdNullConfig.DEFAULT_SETTINGS;
      }
      
      return new Promise((resolve) => {
        chrome.storage.sync.get(window.AdNullConfig.DEFAULT_SETTINGS, (result) => {
          if (chrome.runtime.lastError) {
            window.AdNullLogger.error('Failed to load settings', chrome.runtime.lastError);
            resolve(window.AdNullConfig.DEFAULT_SETTINGS);
          } else {
            window.AdNullLogger.debug('Settings loaded', result);
            resolve(result);
          }
        });
      });
    } catch (error) {
      window.AdNullLogger.error('Error loading settings', error);
      return window.AdNullConfig.DEFAULT_SETTINGS;
    }
  },
  
  /**
   * Get settings (alias for loadSettings)
   * @returns {Promise<Object>} Settings object
   */
  async getSettings() {
    return await this.loadSettings();
  },
  
  /**
   * Save settings to Chrome storage
   * @param {Object} settings - Settings to save
   * @returns {Promise<boolean>} Success status
   */
  async saveSettings(settings) {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage) {
        window.AdNullLogger.warn('Chrome storage not available, cannot save settings');
        return false;
      }
      
      return new Promise((resolve) => {
        chrome.storage.sync.set(settings, () => {
          if (chrome.runtime.lastError) {
            window.AdNullLogger.error('Failed to save settings', chrome.runtime.lastError);
            resolve(false);
          } else {
            window.AdNullLogger.debug('Settings saved', settings);
            resolve(true);
          }
        });
      });
    } catch (error) {
      window.AdNullLogger.error('Error saving settings', error);
      return false;
    }
  },
  
  /**
   * Update a specific setting
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   * @returns {Promise<boolean>} Success status
   */
  async updateSetting(key, value) {
    const settings = {};
    settings[key] = value;
    return await this.saveSettings(settings);
  }
}; 