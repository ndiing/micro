const http = require("http");
const { Readable } = require("stream");
const zlib = require("zlib");
const CacheMap = require("./cache-map.js");
const fs = require("fs");
const path = require("path");
const { pathToRegexp } = require("./util.js");

const MIME_TYPES = {
    // Audio
    ".aac": "audio/aac",
    ".mid": "audio/midi",
    ".midi": "audio/midi",
    ".mp3": "audio/mpeg",
    ".oga": "audio/ogg",
    ".opus": "audio/ogg",
    ".wav": "audio/wav",
    ".weba": "audio/webm",

    // Video
    ".avi": "video/x-msvideo",
    ".mp4": "video/mp4",
    ".mpeg": "video/mpeg",
    ".ogv": "video/ogg",
    ".ts": "video/mp2t",
    ".webm": "video/webm",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",

    // Image
    ".apng": "image/apng",
    ".avif": "image/avif",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".ico": "image/vnd.microsoft.icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".webp": "image/webp",

    // Font
    ".otf": "font/otf",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",

    // Text
    ".css": "text/css",
    ".csv": "text/csv",
    ".htm": "text/html",
    ".html": "text/html",
    ".ics": "text/calendar",
    ".txt": "text/plain",

    // Application
    ".abw": "application/x-abiword",
    ".arc": "application/x-freearc",
    ".azw": "application/vnd.amazon.ebook",
    ".bin": "application/octet-stream",
    ".bz": "application/x-bzip",
    ".bz2": "application/x-bzip2",
    ".cda": "application/x-cdf",
    ".csh": "application/x-csh",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".eot": "application/vnd.ms-fontobject",
    ".epub": "application/epub+zip",
    ".gz": "application/gzip",
    ".jar": "application/java-archive",
    ".js": "application/javascript",
    ".json": "application/json",
    ".jsonld": "application/ld+json",
    ".mjs": "application/javascript",
    ".mpkg": "application/vnd.apple.installer+xml",
    ".odp": "application/vnd.oasis.opendocument.presentation",
    ".ods": "application/vnd.oasis.opendocument.spreadsheet",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".ogx": "application/ogg",
    ".pdf": "application/pdf",
    ".php": "application/x-httpd-php",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".rar": "application/vnd.rar",
    ".rtf": "application/rtf",
    ".sh": "application/x-sh",
    ".tar": "application/x-tar",
    ".xhtml": "application/xhtml+xml",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xml": "application/xml",
    ".xul": "application/vnd.mozilla.xul+xml",
    ".zip": "application/zip",
    ".7z": "application/x-7z-compressed",

    // Visio
    ".vsd": "application/vnd.visio",
};

/**
 * Router class provides an Express-like routing system for handling HTTP requests.
 */
class Router {
    /**
     * Stores registered routes.
     * @type {Array<Object>}
     */
    routes = [];

    /**
     * Creates an instance of Router.
     * @param {Object} [config={}] - Configuration options.
     * @param {number} [config.requestTimeout=60000] - Request timeout in milliseconds.
     */
    constructor(config = {}) {
        this.config = {
            requestTimeout: 60 * 1000,
            ...config,
        };
        this.request = this.request.bind(this);
    }

    /**
     * Adds a new route to the router.
     * @param {string} method - HTTP method (e.g., "GET", "POST").
     * @param {string|Function} path - The route path or middleware function.
     * @param {...Function} middlewares - Middleware functions for handling the request.
     */
    add(method, path, ...middlewares) {
        if (typeof path === "function") {
            middlewares = [path, ...middlewares];
            path = "*";
        }

        if (middlewares[0] instanceof Router) {
            for (const route of middlewares[0].routes) {
                this.add(route.method, path + route.path, ...route.middlewares);
            }
            middlewares = [];
            return;
        }

        const regexp = pathToRegexp(path);

        this.routes.push({ method, path, middlewares, regexp });
    }

    /**
     * Registers middleware for all HTTP methods.
     * @param {...Function} args - Middleware functions.
     * @returns {Router} The router instance.
     */
    use(...args) {
        this.add("*", ...args);
        return this;
    }

    /**
     * Registers a GET route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    get(...args) {
        this.add("GET", ...args);
        return this;
    }

    /**
     * Registers a HEAD route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    head(...args) {
        this.add("HEAD", ...args);
        return this;
    }

    /**
     * Registers a OPTIONS route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    options(...args) {
        this.add("OPTIONS", ...args);
        return this;
    }

    /**
     * Registers a TRACE route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    trace(...args) {
        this.add("TRACE", ...args);
        return this;
    }

    /**
     * Registers a PUT route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    put(...args) {
        this.add("PUT", ...args);
        return this;
    }

    /**
     * Registers a DELETE route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    delete(...args) {
        this.add("DELETE", ...args);
        return this;
    }

    /**
     * Registers a POST route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    post(...args) {
        this.add("POST", ...args);
        return this;
    }

    /**
     * Registers a PATCH route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    patch(...args) {
        this.add("PATCH", ...args);
        return this;
    }

    /**
     * Registers a CONNECT route.
     * @param {...any} args - Path and middleware functions.
     * @returns {Router} The router instance.
     */
    connect(...args) {
        this.add("CONNECT", ...args);
        return this;
    }

    /**
     * @callback StatusFunction
     * @param {number} code - HTTP status code.
     * @returns {CustomResponse}
     */

    /**
     * @callback SendFunction
     * @param {string|Buffer} body - The response body.
     * @returns {void}
     */

    /**
     * @callback JsonFunction
     * @param {any} data - The JSON data to send.
     * @returns {void}
     */

    /**
     * @callback SendFileFunction
     * @param {string} filePath - The file path to send.
     * @returns {void}
     */
    /**
     * @typedef {Object} CustomRequest
     * @property {any} raw - The original request object.
     * @property {string} _protocol - The request protocol (http or https).
     * @property {string} _host - The request host.
     * @property {string} _base - The request base URL.
     * @property {URL} _url - Parsed request URL object.
     * @property {Object.<string, string>} query - Parsed query parameters.
     * @property {Object.<string, string>} params - Route parameters.
     */

    /**
     * @typedef {Object} CustomResponse
     * @property {Object} locals - Object for storing local variables across middlewares.
     * @property {StatusFunction} status - Set response status.
     * @property {SendFunction} send - Send raw response body.
     * @property {JsonFunction} json - Send JSON response.
     * @property {SendFileFunction} sendFile - Send file response.
     */

    /**
     * Handles incoming HTTP requests and executes relevant middleware.
     * @param {CustomRequest} req - Custom wrapped request.
     * @param {CustomResponse} res - Custom wrapped response.
     * @returns {Promise<void>}
     */
    async request(req, res) {
        let end;
        let err;

        /***/
        req._protocol = req.socket.encrypted ? "https:" : "http:";
        /***/
        req._host = req.headers.host;
        /***/
        req._base = req._protocol + "//" + req._host;
        /***/
        req._url = new URL(req.url, req._base);

        const query = {};
        for (const [key, value] of req._url.searchParams.entries()) {
            if (query[key]) {
                if (Array.isArray(query[key])) {
                    query[key].push(value);
                } else {
                    query[key] = [query[key], value];
                }
            } else {
                query[key] = value;
            }
        }
        /***/
        req.query = query;

        /***/
        res.locals = {};

        /***/
        res.status = (code) => {
            res.statusCode = code;
            return res;
        };

        /***/
        res.send = (body) => {
            try {
                if (!(body instanceof Readable)) {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);
                    body = readable;
                }
                body.pipe(res);
                end = true;
            } catch (error) {
                err = error;
            }
        };

        /***/
        res.json = (body) => {
            try {
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(body));
            } catch (error) {
                err = error;
            }
        };

        /***/
        res.sendFile = (pathname) => {
            try {
                res.setHeader("Content-Type", MIME_TYPES[path.extname(pathname)]);
                res.send(fs.createReadStream(pathname));
            } catch (error) {
                err = error;
            }
        };

        for (const route of this.routes) {
            const matches = (route.method === "*" || req.method === route.method) && req._url.pathname.match(route.regexp);
            if (!matches) {
                continue;
            }

            /***/
            req.params = { ...matches.groups };

            for (const middleware of route.middlewares) {
                if (err && middleware.length !== 4) {
                    continue;
                }

                try {
                    await new Promise((resolve, reject) => {
                        let timeout;

                        const next = (error) => {
                            clearTimeout(timeout);

                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        };

                        timeout = setTimeout(() => {
                            res.status(408);
                            next(new Error(http.STATUS_CODES[408]));
                        }, this.config.requestTimeout);

                        if (err) {
                            middleware(err, req, res, next);
                        } else {
                            middleware(req, res, next);
                        }
                    });
                } catch (error) {
                    err = error;
                }

                if (end) {
                    break;
                }
            }

            if (end) {
                break;
            }
        }

        if (!end) {
            if (!err) {
                res.status(404);
                err = new Error(http.STATUS_CODES[404]);
            }

            err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

            if (res.statusCode >= 200 && res.statusCode < 300) {
                res.status(500);
            }

            res.json(err);
        }
    }

    /**
     * Starts an HTTP server and listens for incoming requests.
     * @param {...any} args - Arguments passed to `http.createServer().listen()`.
     * @returns {http.Server} The HTTP server instance.
     */
    listen(...args) {
        const server = http.createServer();
        server.on("request", this.request);
        server.listen(...args);
        return server;
    }

    /**
     * Middleware to enable compression (gzip, deflate, brotli) for response bodies.
     * @returns {Function} Express-style middleware function.
     */
    static compression() {
        return (req, res, next) => {
            const send = res.send;

            res.send = (body) => {
                if (!(body instanceof Readable)) {
                    const readable = new Readable();
                    readable.push(body);
                    readable.push(null);
                    body = readable;
                }

                const acceptEncoding = req.headers["accept-encoding"] || "";
                if (/\bgzip\b/.test(acceptEncoding)) {
                    res.setHeader("Content-Encoding", "gzip");
                    body = body.pipe(zlib.createGzip());
                } else if (/\bdeflate\b/.test(acceptEncoding)) {
                    res.setHeader("Content-Encoding", "deflate");
                    body = body.pipe(zlib.createDeflate());
                } else if (/\bbr\b/.test(acceptEncoding)) {
                    res.setHeader("Content-Encoding", "br");
                    body = body.pipe(zlib.createBrotliCompress());
                }

                send(body);
            };

            next();
        };
    }

    /**
     * Middleware to parse cookies from incoming requests and set cookies in responses.
     * @returns {Function} Express-style middleware function.
     */
    static cookie() {
        const ATTRIBUTES = {
            domain: "Domain",
            expires: "Expires",
            httpOnly: "HttpOnly",
            maxAge: "Max-Age",
            partitioned: "Partitioned",
            path: "Path",
            secure: "Secure",
            sameSite: "SameSite",
        };

        return (req, res, next) => {
            const cookie = {};
            for (const [, name, value] of (req.headers.cookie || "").matchAll(/([^=; ]+)=([^;]+)/g)) {
                cookie[name] = value;
            }
            req.cookie = cookie;

            const setCookie = [];
            res.cookie = (name, value, attributes = {}) => {
                const cookie = [[name, value].join("=")];

                for (const name in attributes) {
                    const value = attributes[name];

                    if (!ATTRIBUTES[name]) {
                        continue;
                    }

                    cookie.push([ATTRIBUTES[name], value].join("="));
                }

                setCookie.push(cookie.join("; "));

                res.setHeader("Set-Cookie", setCookie);

                return res;
            };

            next();
        };
    }

    /**
     * Middleware to parse incoming JSON request bodies.
     * @returns {Function} Express-style middleware function.
     */
    static json() {
        return async (req, res, next) => {
            try {
                if (["POST", "PATCH", "PUT"].includes(req.method)) {
                    const chunks = [];
                    for await (const chunk of req) {
                        chunks.push(chunk);
                    }

                    const buffer = Buffer.concat(chunks);

                    const contentType = req.headers["content-type"] || "";
                    if (contentType.includes("application/json")) {
                        req.body = JSON.parse(buffer);
                    } else {
                        req.body = buffer;
                    }
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * Middleware to enable CORS (Cross-Origin Resource Sharing).
     * @param {Object} [headers={}] - Custom headers for CORS.
     * @returns {Function} Express-style middleware function.
     */
    static cors(headers = {}) {
        headers = {
            "Access-Control-Allow-Origin": "*",
            ...headers,
        };

        return (req, res, next) => {
            for (const name in headers) {
                res.setHeader(name, headers[name]);
            }

            next();
        };
    }

    /**
     * Middleware to apply security headers to responses.
     * @param {Object} [headers={}] - Additional security headers.
     * @returns {Function} Express-style middleware function.
     */
    static security(headers = {}) {
        headers = {
            "X-DNS-Prefetch-Control": "off",
            "X-Frame-Options": "SAMEORIGIN",
            "Strict-Transport-Security": "max-age=15552000; includeSubDomains",
            "X-Content-Type-Options": "nosniff",
            "X-XSS-Protection": "0",
            "Referrer-Policy": "no-referrer",
            "Permissions-Policy": "geolocation=(), microphone=()",
            ...headers,
        };

        return (req, res, next) => {
            for (const name in headers) {
                res.setHeader(name, headers[name]);
            }

            next();
        };
    }

    /**
     * Middleware to implement configurable rate limiting rules for incoming requests.
     * Multiple rules can be defined based on request method and path.
     * @param {Array<Object>} [rules=[]] - Array of rate limiting rules.
     * @param {string} [rules[].method="*"] - HTTP method to apply rate limiting ("*" applies to all methods).
     * @param {string} [rules[].path="*"] - URL path pattern for applying rate limiting.
     * @param {number} [rules[].timeWindow=60] - Time window in seconds for limiting requests.
     * @param {number} [rules[].requestQuota=100] - Maximum number of requests allowed within the time window.
     * @returns {Function} Express-style middleware function for enforcing rate limits.
     */
    static rateLimit(rules = []) {
        if (!rules.length) {
            rules = [{ method: "*", path: "*", timeWindow: 60, requestQuota: 100 }];
        }

        rules = rules.map((rule) => {
            rule.regexp = pathToRegexp(rule.path);
            return rule;
        });

        const cacheMap = new CacheMap();

        return (req, res, next) => {
            const rule = rules.find((rule) => (rule.method === "*" || rule.method === req.method) && rule.regexp.test(req._url.pathname));

            if (rule) {
                res.locals.rule = rule;

                const { timeWindow = 60, requestQuota = 100 } = res.locals.rule;

                const now = Date.now();
                const key = [req.socket.remoteAddress, req.method, req._url.pathname].join();
                let item = cacheMap.get(key);

                if (!item || now > item.expiringLimit) {
                    item = {
                        requestQuota: requestQuota,
                        quotaUnits: requestQuota - 1,
                        expiringLimit: now + timeWindow * 1000,
                    };
                } else {
                    item.quotaUnits--;
                }

                cacheMap.set(key, item);

                const deltaSeconds = Math.ceil((item.expiringLimit - now) / 1000);

                res.setHeader("RateLimit-Limit", item.requestQuota);
                res.setHeader("RateLimit-Remaining", Math.max(0, item.quotaUnits));
                res.setHeader("RateLimit-Reset", deltaSeconds);

                if (item.quotaUnits < 0) {
                    res.status(429);
                    res.setHeader("Retry-After", deltaSeconds);

                    return next(new Error(http.STATUS_CODES[429]));
                }
            }

            next();
        };
    }

    /**
     * Middleware to serve static files from a specified directory.
     * Automatically serves `index.html` if the request targets `/`.
     * @param {string} dirname - The directory containing static files.
     * @returns {Function} Express-style middleware function.
     */
    static static(dirname) {
        return (req, res, next) => {
            const pathname = path.join(dirname, req._url.pathname === "/" ? "/index.html" : req._url.pathname);

            if (fs.existsSync(pathname)) {
                res.sendFile(pathname);
            } else {
                next();
            }
        };
    }

    /**
     * Middleware to handle 404 errors.
     * @returns {Function} Express-style middleware function.
     */
    static missing() {
        return (req, res, next) => {
            res.status(404);
            next(new Error(http.STATUS_CODES[404]));
        };
    }

    /**
     * Middleware to handle all uncaught errors.
     * @returns {Function} Express-style error handler middleware.
     */
    static catchAll() {
        return (err, req, res, next) => {
            err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

            if (res.statusCode >= 200 && res.statusCode < 300) {
                res.status(500);
            }

            res.json({ message: err.message });
        };
    }
}

module.exports = Router;
