const File = require("./file.js");
const CookieStore = require("./cookie-store.js");
const CacheMap = require("./cache-map.js");

/**
 * Store class provides a proxy-based mechanism for handling data storage,
 * supporting automatic persistence and caching.
 */
class Store {
    /**
     * Creates an instance of the Store class.
     * @param {Object} target - The target object to be proxied and stored.
     * @param {Function} callback - A callback function triggered on property changes.
     * @returns {Proxy} A proxy wrapping the target object.
     */
    constructor(target, callback) {
        this.target = target;
        this.callback = callback;
        return new Proxy(this.target, this);
    }

    /**
     * Retrieves a property from the target object.
     * If the property is an object or array, it returns a proxied version.
     * @param {Object} target - The target object.
     * @param {string} property - The property name to retrieve.
     * @returns {*} The retrieved property value.
     */
    get(target, property) {
        if (["[object Object]", "[object Array]"].includes(toString.call(target[property]))) {
            return new Proxy(target[property], this);
        }
        return target[property];
    }

    /**
     * Sets a property in the target object, triggering the callback.
     * Ensures changes are persisted.
     * @param {Object} target - The target object.
     * @param {string} property - The property name to set.
     * @param {*} value - The new value to assign.
     * @returns {boolean} True if the operation is successful.
     */
    set(target, property, value) {
        const oldValue = target[property];
        if (oldValue === value) {
            return true;
        }
        Reflect.set(target, property, value);
        this.callback(this.target, target, property, value);
        return true;
    }

    /**
     * Deletes a property from the target object, triggering the callback.
     * Ensures changes are persisted.
     * @param {Object} target - The target object.
     * @param {string} property - The property name to delete.
     * @returns {boolean} True if the operation is successful.
     */
    deleteProperty(target, property) {
        const oldValue = target[property];
        if (oldValue === undefined) {
            return true;
        }
        Reflect.deleteProperty(target, property);
        this.callback(this.target, target, property);
        return true;
    }

    /**
     * Cache pool for storing active Store instances.
     * @type {CacheMap}
     */
    static pools = new CacheMap();

    /**
     * Retrieves a stored instance of the target object linked to the specified filename.
     * Automatically reads the file and initializes storage with automatic persistence.
     * @param {string} filename - The filename where the store data is stored.
     * @returns {Store} The proxied Store instance.
     */
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
