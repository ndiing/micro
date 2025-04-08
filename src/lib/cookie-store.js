/**
 * CookieStore class responsible for managing cookies in an object-like format.
 */
class CookieStore {
    /**
     * Retrieves the cookie string representing all stored cookies.
     * @returns {string} A string representation of cookies in the format "key=value; key2=value2".
     */
    get cookie() {
        const array = [];
        for (const name of Object.getOwnPropertyNames(this)) {
            array.push([name, this[name].value].join("="));
        }
        return array.join("; ");
    }

    /**
     * Parses and sets cookies from a cookie string or an array of cookie strings.
     * @param {string|string[]} value - The cookie string or array of cookie strings to parse.
     */
    set cookie(value) {
        const REGEXP = /(Domain|Expires|HttpOnly|Max-Age|Partitioned|Path|Secure|SameSite)/i;
        if (!Array.isArray(value)) {
            value = [value];
        }
        for (const string of value) {
            for (const [, name, , value] of string.matchAll(/([^= ]+)(=([^;]+))?/g)) {
                if (REGEXP.test(name)) {
                    continue;
                }
                if (value) {
                    this.set(name, value);
                } else {
                    this.delete(name);
                }
            }
        }
    }

    /**
     * Creates an instance of CookieStore.
     * @param {Object} [init] - An optional object containing initial cookie values.
     */
    constructor(init) {
        if (typeof init === "object") {
            for (const name in init) {
                this.set(init[name]);
            }
        }
    }

    /**
     * Deletes a cookie by its name.
     * @param {string} name - The name of the cookie to delete.
     */
    delete(name) {
        delete this[name];
    }

    /**
     * Retrieves a cookie value by its name.
     * @param {string} name - The name of the cookie to retrieve.
     * @returns {*} The value of the cookie, or undefined if not found.
     */
    get(name) {
        return this[name];
    }

    /**
     * Retrieves all cookies stored under a specific name.
     * @param {string} name - The name of the cookies to retrieve.
     * @returns {Array} An array of cookie values matching the specified name.
     */
    getAll(name) {
        return [].concat(this[name]).filter(Boolean);
    }

    /**
     * Sets a cookie with the given name and value.
     * @param {string|Object} name - The name of the cookie, or an object with { name, value }.
     * @param {*} [value] - The value of the cookie (if `name` is a string).
     */
    set(name, value) {
        if (typeof name === "string") {
            name = { name, value };
        }
        this[name.name] = name;
    }
}

module.exports = CookieStore;
