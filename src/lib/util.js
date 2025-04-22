class Util {
    static pathToRegexp(path) {
        const pattern =
            "^" +
            path
                .replace(/:(\w+)/g, "(?<$1>[^/]+)")
                .replace(/\*/, "(?:.*)")
                .replace(/\/?$/, "(?:/?$)");
        const regexp = new RegExp(pattern, "i");
        return regexp;
    }
}

/**
 * Mutex class provides an asynchronous locking mechanism to control access to shared resources.
 */
class Mutex {
    /**
     * Creates an instance of the Mutex class.
     */
    constructor() {
        this.queue = [];
        this.locked = false;
    }

    /**
     * Acquires the lock and returns a promise that resolves when the lock is released.
     * If the lock is already held, the promise waits until the lock is available.
     * @returns {Promise<Function>} A promise resolving to an unlock function.
     */
    lock() {
        const unlock = new Promise((resolve) => {
            this.queue.push(resolve);
        });

        if (this.locked) {
            return unlock;
        }

        this.locked = true;
        return Promise.resolve(this.unlock.bind(this));
    }

    /**
     * Releases the lock and allows the next waiting process to acquire it.
     */
    unlock() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next(this.unlock.bind(this));
        } else {
            this.locked = false;
        }
    }
}

/**
 * RequestLimiter class controls the execution rate of asynchronous requests.
 */
class RequestLimiter {
    /**
     * Creates an instance of RequestLimiter.
     * @param {Object} options - Configuration options for rate limiting.
     * @param {number} options.maxRequests - Maximum number of requests allowed per batch.
     * @param {number} options.timeWindow - Time window in milliseconds before processing the next batch.
     */
    constructor({ maxRequests, timeWindow }) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.queue = [];
        this.processing = false;
    }

    /**
     * Adds a request function to the queue for execution.
     * @param {Function} requestFn - The asynchronous function representing the request.
     * @returns {Promise<*>} A promise that resolves with the request's result.
     */
    add(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFn, resolve, reject });
            this._processQueue();
        });
    }

    /**
     * Processes the queued requests in batches, enforcing rate limits.
     * This method ensures that requests are executed in batches and maintains intervals.
     * @private
     */
    async _processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;

        const batch = this.queue.splice(0, this.maxRequests);

        const promises = batch.map((item) => item.requestFn().then(item.resolve).catch(item.reject));

        await Promise.allSettled(promises);

        setTimeout(() => {
            this.processing = false;
            this._processQueue();
        }, this.timeWindow);
    }
}

Util.Mutex = Mutex;
Util.RequestLimiter = RequestLimiter;

module.exports = Util;
