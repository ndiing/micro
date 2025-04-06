const http = require("http");
const { Readable } = require("stream");
const zlib = require("zlib");
const CacheMap = require("./cache-map.js");

class Router {
    routes = [];

    constructor(config = {}) {
        this.config = {
            requestTimeout: 60 * 1000,
            ...config,
        };
        this.listener = this.listener.bind(this);
    }

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

        const pattern =
            "^" +
            path
                .replace(/:(\w+)/g, "(?<$1>[^/]+)")
                .replace(/\*/, "(?:.*)")
                .replace(/\/?$/, "(?:/?$)");
        const regexp = new RegExp(pattern, "i");

        this.routes.push({ method, path, middlewares, regexp });
    }

    use(...args) {
        this.add("*", ...args);
        return this;
    }

    get(...args) {
        this.add("GET", ...args);
        return this;
    }

    head(...args) {
        this.add("HEAD", ...args);
        return this;
    }

    options(...args) {
        this.add("OPTIONS", ...args);
        return this;
    }

    trace(...args) {
        this.add("TRACE", ...args);
        return this;
    }

    put(...args) {
        this.add("PUT", ...args);
        return this;
    }

    delete(...args) {
        this.add("DELETE", ...args);
        return this;
    }

    post(...args) {
        this.add("POST", ...args);
        return this;
    }

    patch(...args) {
        this.add("PATCH", ...args);
        return this;
    }

    connect(...args) {
        this.add("CONNECT", ...args);
        return this;
    }

    async listener(req, res) {
        let end;
        let err;

        req._protocol = req.socket.encrypted ? "https:" : "http:";
        req._host = req.headers.host;
        req._base = req._protocol + "//" + req._host;
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
        req.query = query;

        res.status = (code) => {
            res.statusCode = code;
            return res;
        };

        res.send = (body) => {
            if (!(body instanceof Readable)) {
                const readable = new Readable();
                readable.push(body);
                readable.push(null);
                body = readable;
            }
            body.pipe(res);
            end = true;
        };

        res.json = (body) => {
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(body));
        };

        for (const route of this.routes) {
            const matches = (route.method === "*" || req.method === route.method) && req._url.pathname.match(route.regexp);
            if (!matches) {
                continue;
            }

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

    listen(...args) {
        const server = http.createServer();
        server.on("request", this.listener);
        server.listen(...args);
        return server;
    }
}

function compression() {
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

function cookie() {
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

function json() {
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

function cors(headers = {}) {
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

function security(headers = {}) {
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

function rateLimit(options = {}) {
    const { timeWindow = 60, requestQuota = 100 } = options;

    const cacheMap = new CacheMap();

    return (req, res, next) => {
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

        next();
    };
}

function missing() {
    return (req, res, next) => {
        res.status(404);
        next(new Error(http.STATUS_CODES[404]));
    };
}

function catchAll() {
    return (err, req, res, next) => {
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

        if (res.statusCode >= 200 && res.statusCode < 300) {
            res.status(500);
        }

        res.json({ message: err.message });
    };
}

Router.compression = compression;
Router.cookie = cookie;
Router.json = json;
Router.cors = cors;
Router.security = security;
Router.rateLimit = rateLimit;
Router.missing = missing;
Router.catchAll = catchAll;

module.exports = Router;

// // Usage
// {
//     const users = new Router();
//     users.use((req, res, next) => {
//         next();
//     });
//     users.post("/", (req, res, next) => {
//         res.json({ message: "post users", body: req.body });
//     });
//     users.get("/", (req, res, next) => {
//         res.cookie("name1", "value1");
//         res.cookie("name2", "value2");
//         res.cookie("name3", "value3");
//         res.cookie("name4", "value4");
//         res.cookie("name5", "value5");
//         res.json({ message: "get all users", query: req.query });
//     });
//     users.get("/:id", (req, res, next) => {
//         throw new Error("Test Error");
//         res.json({ message: "get users" });
//     });
//     users.patch("/:id", (req, res, next) => {
//         res.json({ message: "patch users", body: req.body });
//     });
//     users.delete("/:id", (req, res, next) => {
//         res.json({ message: "delete users" });
//     });

//     const blogs = new Router();
//     blogs
//         .use((req, res, next) => {
//             next();
//         })
//         .post("/", (req, res, next) => {
//             res.json({ message: "post blogs", body: req.body });
//         })
//         .get("/", (req, res, next) => {
//             res.cookie("name1", "value1").cookie("name2", "value2").cookie("name3", "value3").cookie("name4", "value4").cookie("name5", "value5").json({ message: "get all blogs", query: req.query });
//         })
//         .get("/:id", (req, res, next) => {
//             throw new Error("Test Error");
//             res.json({ message: "get blogs" });
//         })
//         .patch("/:id", (req, res, next) => {
//             res.json({ message: "patch blogs", body: req.body });
//         })
//         .delete("/:id", (req, res, next) => {
//             res.json({ message: "delete blogs" });
//         });

//     const api = new Router();
//     api.use((req, res, next) => {
//         next();
//     });
//     api.use("/users", users);
//     api.use("/blogs", blogs);

//     const app = new Router();

//     app.use(Router.compression());
//     app.use(Router.cookie());
//     app.use(Router.json());
//     app.use(Router.cors());
//     app.use(Router.security());
//     app.use(Router.rateLimit());
//     app.use("/api", api);
//     app.use(Router.missing());
//     app.use(Router.catchAll());

//     const server = app.listen(80, "0.0.0.0", () => {
//         console.log(server.address());
//     });
// }
