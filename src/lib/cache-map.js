const os = require("os");

/**
 * CacheMap class extends the native Map with additional memory management capabilities.
 * Automatically clears least recently used entries when memory usage exceeds the defined threshold.
 * @extends Map
 */
class CacheMap extends Map {
    /**
     * Creates an instance of the CacheMap class.
     * @param {Iterable} [entries] - Initial key-value pairs for the map.
     * @param {Object} [options={}] - Configuration options for cache behavior.
     * @param {number} [options.maxMem=0.9] - The maximum memory usage threshold before clearing cache.
     */
    constructor(entries, options = {}) {
        super(entries);
        this.options = {
            maxMem: 0.9,
            ...options,
        };
    }

    /**
     * Checks if a key exists in the map, moving it to the most recently accessed position if found.
     * @param {*} key - The key to check.
     * @returns {boolean} True if the key exists, otherwise false.
     */
    has(key) {
        const has = super.has(key);
        if (has) {
            const value = super.get(key);

            super.delete(key);
            super.set(key, value);
        }

        return has;
    }

    /**
     * Retrieves a value from the map, moving it to the most recently accessed position.
     * @param {*} key - The key to retrieve.
     * @returns {*} The value associated with the key, or undefined if not found.
     */
    get(key) {
        const value = super.get(key);
        if (value !== undefined) {
            super.delete(key);
            super.set(key, value);
        }

        return value;
    }

    /**
     * Sets a key-value pair in the map, ensuring that existing keys are repositioned.
     * @param {*} key - The key to store.
     * @param {*} value - The value associated with the key.
     */
    set(key, value) {
        if (super.has(key)) {
            super.delete(key);
        }

        super.set(key, value);
    }

     /**
     * Calculates the current memory usage.
     * @returns {number} The percentage of used memory (0 to 1).
     */
    usageMem() {
        return 1 - os.freemem() / os.totalmem();
    }

     /**
     * Clears the least recently used entries when memory usage exceeds the defined threshold.
     */
    clearMem() {
        while (this.usageMem() > this.options.maxMem && this.size > 0) {
            const key = this.keys().next().value;
            super.delete(key);
        }
    }
}

module.exports = CacheMap;
