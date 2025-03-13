const http = require("http");
const { Readable } = require("stream");

/**
 * Router class responsible for handling HTTP routes and requests.
 */
class Router {
    /**
     * Creates an instance of the Router class.
     */
    constructor() {
        this.routes = [];
        this.request = this.request.bind(this);
    }

    /**
     * Adds a route with the specified method, path, and middlewares.
     * @param {string} method - The HTTP method (e.g., "GET", "POST", "PATCH", "DELETE").
     * @param {string|Function} path - The path for the route or a middleware function.
     * @param {...Function} middlewares - The middleware functions for the route.
     */
    add(method, path, ...middlewares) {
        if (typeof path === "function") {
            middlewares = [path, ...middlewares];
            path = "*";
        }

        if (middlewares[0].routes) {
            middlewares[0].routes.forEach((route) => {
                this.add(route.method, path + route.path, ...route.middlewares);
            });

            return;
        }
        const pattern =
            "^" +
            path
                .replace(/\:(\w+)/g, "(?<$1>[^/]+)")
                .replace(/\*/, "(?:.*)")
                .replace(/\/?$/, "(?:/?$)");
        const regexp = new RegExp(pattern, "gi");
        this.routes.push({ method, path, middlewares, regexp });
    }

    /**
     * Adds a middleware function to be used for all routes.
     * @param {...Function} args - The middleware functions.
     */
    use(...args) {
        this.add("*", ...args);
    }

    /**
     * Adds a POST route with the specified path and middlewares.
     * @param {string} path - The path for the route.
     * @param {...Function} middlewares - The middleware functions for the route.
     */
    post(path, ...middlewares) {
        this.add("POST", path, ...middlewares);
    }

    /**
     * Adds a GET route with the specified path and middlewares.
     * @param {string} path - The path for the route.
     * @param {...Function} middlewares - The middleware functions for the route.
     */
    get(path, ...middlewares) {
        this.add("GET", path, ...middlewares);
    }

    /**
     * Adds a PATCH route with the specified path and middlewares.
     * @param {string} path - The path for the route.
     * @param {...Function} middlewares - The middleware functions for the route.
     */
    patch(path, ...middlewares) {
        this.add("PATCH", path, ...middlewares);
    }

    /**
     * Adds a DELETE route with the specified path and middlewares.
     * @param {string} path - The path for the route.
     * @param {...Function} middlewares - The middleware functions for the route.
     */
    delete(path, ...middlewares) {
        this.add("DELETE", path, ...middlewares);
    }

    /**
     * Handles incoming HTTP requests and executes the appropriate middlewares.
     * @param {http.IncomingMessage} req - The HTTP request object.
     * @param {http.ServerResponse} res - The HTTP response object.
     */
    async request(req, res) {
        let err;
        let end;

        res.send = (data = "") => {
            try {
                const readable = new Readable();
                readable.push(data);
                readable.push(null);
                readable.pipe(res);
                end = true;
            } catch (error) {
                err = error;
            }
        };

        res.json = (data = {}) => {
            try {
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                res.setHeader("Content-Type", "application/json");
                res.send(data);
            } catch (error) {
                err = error;
            }
        };

        try {
            for (const route of this.routes) {
                if (end) {
                    break;
                }
                const matches = (route.method === "*" || req.method === route.method) && req.url.match(route.regexp);

                if (matches) {
                    for (const middleware of route.middlewares) {
                        if (end) {
                            break;
                        }

                        if (err && middleware.length !== 4) {
                            continue;
                        }
                        try {
                            await new Promise((resolve, reject) => {
                                const next = (error) => {
                                    if (error) {
                                        reject(error);
                                    }
                                    resolve();
                                };

                                if (err) {
                                    middleware(err, req, res, next);
                                } else {
                                    middleware(req, res, next);
                                }
                            });
                        } catch (error) {
                            err = error;
                        }
                    }
                }

                if (err) {
                    continue;
                }
            }
        } catch (error) {
            err = error;
        }

        if (end) {
            return;
        }

        if (!err) {
            res.statusCode = 404;
            err = new Error(http.STATUS_CODES[404]);
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
            res.statusCode = 500;
        }
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        res.json({ message: err.message });
    }

    /**
     * Starts an HTTP server and listens for incoming requests.
     * @param {...any} args - The arguments to pass to http.createServer().listen().
     * @returns {http.Server} The HTTP server instance.
     */
    listen(...args) {
        const server = http.createServer(this.request);
        server.listen(...args);

        return server;
    }
}

module.exports = Router;
