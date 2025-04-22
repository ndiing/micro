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

class Mutex {
    constructor() {
        this.queue = [];
        this.locked = false;
    }

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

    unlock() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next(this.unlock.bind(this));
        } else {
            this.locked = false;
        }
    }
}

class RequestLimiter {
    constructor({ maxRequests, timeWindow }) {
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.queue = [];
      this.processing = false;
    }
  
    add(requestFn) {
      return new Promise((resolve, reject) => {
        this.queue.push({ requestFn, resolve, reject });
        this._processQueue();
      });
    }
  
    async _processQueue() {
      if (this.processing || this.queue.length === 0) return;
  
      this.processing = true;
  
      const batch = this.queue.splice(0, this.maxRequests);
  
      const promises = batch.map(item =>
        item.requestFn()
          .then(item.resolve)
          .catch(item.reject)
      );
  
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
