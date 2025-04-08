const File = require("./file.js");
const CookieStore = require("./cookie-store.js");
const CacheMap = require("./cache-map.js");

class Store {
    constructor(target, callback) {
        this.target = target;
        this.callback = callback;
        return new Proxy(this.target, this);
    }
    get(target, property) {
        if (["[object Object]", "[object Array]"].includes(toString.call(target[property]))) {
            return new Proxy(target[property], this);
        }
        return target[property];
    }
    set(target, property, value) {
        const oldValue = target[property];
        if (oldValue === value) {
            return true;
        }
        Reflect.set(target, property, value);
        this.callback(this.target, target, property, value);
        return true;
    }
    deleteProperty(target, property) {
        const oldValue = target[property];
        if (oldValue === undefined) {
            return true;
        }
        Reflect.deleteProperty(target, property);
        this.callback(this.target, target, property);
        return true;
    }

    static pools = new CacheMap();

    static get(filename) {
        if (!Store.pools.has(filename)) {
            const target = File.read(filename) || {};
            target.cookieStore = new CookieStore(target.cookieStore);
            const store = new Store(target, (target) => {
                File.write(filename, target);
            });
            Store.pools.set(filename, store);
        }
        return Store.pools.get(filename);
    }
}

module.exports = Store;
