// Simple Cache Service for Web App
// Stores data in memory with expiry times

const CacheService = {
    cache: {},
    
    /**
     * Set data in cache with expiry
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} expiryMinutes - How long to keep (default 5 minutes)
     */
    set(key, data, expiryMinutes = 5) {
      this.cache[key] = {
        data: data,
        timestamp: Date.now(),
        expiry: expiryMinutes * 60 * 1000
      };
      console.log(`💾 Cached "${key}" for ${expiryMinutes} minutes`);
    },
    
    /**
     * Get data from cache if not expired
     * @param {string} key - Cache key
     * @returns {*} Cached data or null if expired/missing
     */
    get(key) {
      const cached = this.cache[key];
      
      if (!cached) {
        console.log(`❌ Cache miss: "${key}"`);
        return null;
      }
      
      const age = Date.now() - cached.timestamp;
      
      if (age > cached.expiry) {
        // Expired, delete it
        console.log(`⏰ Cache expired: "${key}" (${Math.floor(age / 1000)}s old)`);
        delete this.cache[key];
        return null;
      }
      
      console.log(`✅ Cache hit: "${key}" (${Math.floor(age / 1000)}s old)`);
      return cached.data;
    },
    
    /**
     * Check if cache key exists and is valid
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
      return this.get(key) !== null;
    },
    
    /**
     * Clear specific cache key
     * @param {string} key - Cache key to clear
     */
    clear(key) {
      if (this.cache[key]) {
        delete this.cache[key];
        console.log(`🗑️ Cleared cache: "${key}"`);
      }
    },
    
    /**
     * Clear all cache
     */
    clearAll() {
      const keys = Object.keys(this.cache);
      this.cache = {};
      console.log(`🗑️ Cleared all cache (${keys.length} items)`);
    },
    
    /**
     * Get cache age in seconds
     * @param {string} key - Cache key
     * @returns {number|null} Age in seconds or null if not found
     */
    getAge(key) {
      const cached = this.cache[key];
      if (!cached) return null;
      return Math.floor((Date.now() - cached.timestamp) / 1000);
    },
    
    /**
     * Get time remaining until expiry in seconds
     * @param {string} key - Cache key
     * @returns {number|null} Seconds until expiry or null if not found
     */
    getTimeRemaining(key) {
      const cached = this.cache[key];
      if (!cached) return null;
      
      const age = Date.now() - cached.timestamp;
      const remaining = cached.expiry - age;
      
      return Math.max(0, Math.floor(remaining / 1000));
    },
    
    /**
     * Get all cache keys
     * @returns {string[]}
     */
    getKeys() {
      return Object.keys(this.cache);
    },
    
    /**
     * Get cache statistics
     * @returns {object}
     */
    getStats() {
      const keys = this.getKeys();
      const stats = {
        totalItems: keys.length,
        items: []
      };
      
      keys.forEach(key => {
        const cached = this.cache[key];
        stats.items.push({
          key: key,
          ageSeconds: this.getAge(key),
          remainingSeconds: this.getTimeRemaining(key),
          sizeBytes: JSON.stringify(cached.data).length
        });
      });
      
      return stats;
    },
    
    /**
     * Clean up expired entries
     */
    cleanup() {
      const keys = this.getKeys();
      let cleaned = 0;
      
      keys.forEach(key => {
        if (!this.has(key)) {
          cleaned++;
        }
      });
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
      }
      
      return cleaned;
    }
  };
  
  // Auto-cleanup every 5 minutes
  setInterval(() => {
    CacheService.cleanup();
  }, 5 * 60 * 1000);
  
  // Log cache stats when enabled
  if (typeof window !== 'undefined') {
    window.CacheService = CacheService;
    console.log('💾 CacheService ready. Use window.CacheService.getStats() to view cache.');
  }
  