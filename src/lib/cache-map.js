const os = require("os");

class CacheMap extends Map {
    constructor(entries, options = {}) {
        super(entries);
        this.options = {
            maxMem: 0.9,
            ...options,
        };
    }

    has(key) {
        const has = super.has(key);
        if (has) {
            const value = super.get(key);

            super.delete(key);
            super.set(key, value);
        }

        return has;
    }

    get(key) {
        const value = super.get(key);
        if (value !== undefined) {
            super.delete(key);
            super.set(key, value);
        }

        return value;
    }

    set(key, value) {
        if (super.has(key)) {
            super.delete(key);
        }

        super.set(key, value);
    }

    usageMem() {
        return 1 - os.freemem() / os.totalmem();
    }

    clearMem() {
        while (this.usageMem() > this.options.maxMem && this.size > 0) {
            const key = this.keys().next().value;
            super.delete(key);
        }
    }
}

module.exports = CacheMap;
