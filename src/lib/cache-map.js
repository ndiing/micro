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

// // Usage
// {
//     const cache = new CacheMap();
//     cache.set(1, "a");
//     cache.set(2, "b");
//     cache.set(3, "c");
//     cache.set(4, "d");

//     console.log(cache.get(3));
//     console.log(cache.has(1));

//     cache.set(5, "e");
//     cache.set(6, "f");

//     console.log(cache.entries())

//     cache.clearMem();

//     console.log(cache.entries())
// }
