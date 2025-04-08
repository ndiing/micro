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

module.exports = Util;
