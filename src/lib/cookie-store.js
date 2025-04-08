class CookieStore {
    get cookie() {
        const array = [];
        for (const name of Object.getOwnPropertyNames(this)) {
            array.push([name, this[name].value].join("="));
        }
        return array.join("; ");
    }
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
    constructor(init) {
        if (typeof init === "object") {
            for (const name in init) {
                this.set(init[name]);
            }
        }
    }
    delete(name) {
        delete this[name];
    }
    get(name) {
        return this[name];
    }
    getAll(name) {
        return [].concat(this[name]).filter(Boolean);
    }
    set(name, value) {
        if (typeof name === "string") {
            name = { name, value };
        }
        this[name.name] = name;
    }
}

module.exports = CookieStore;
