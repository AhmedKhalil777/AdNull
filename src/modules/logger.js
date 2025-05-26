// AdNull Logger Module
window.AdNullLogger = {
  
  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {*} data - Optional data to log
   */
  error(message, data = null) {
    if (window.AdNullConfig.CURRENT_LOG_LEVEL >= window.AdNullConfig.LOG_LEVELS.ERROR) {
      console.error(`[${window.AdNullConfig.EXTENSION_NAME}] ERROR: ${message}`, data || '');
    }
  },
  
  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {*} data - Optional data to log
   */
  warn(message, data = null) {
    if (window.AdNullConfig.CURRENT_LOG_LEVEL >= window.AdNullConfig.LOG_LEVELS.WARN) {
      console.warn(`[${window.AdNullConfig.EXTENSION_NAME}] WARN: ${message}`, data || '');
    }
  },
  
  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {*} data - Optional data to log
   */
  info(message, data = null) {
    if (window.AdNullConfig.CURRENT_LOG_LEVEL >= window.AdNullConfig.LOG_LEVELS.INFO) {
      console.log(`[${window.AdNullConfig.EXTENSION_NAME}] ${message}`, data || '');
    }
  },
  
  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {*} data - Optional data to log
   */
  debug(message, data = null) {
    if (window.AdNullConfig.CURRENT_LOG_LEVEL >= window.AdNullConfig.LOG_LEVELS.DEBUG) {
      console.log(`[${window.AdNullConfig.EXTENSION_NAME}] DEBUG: ${message}`, data || '');
    }
  }
}; 