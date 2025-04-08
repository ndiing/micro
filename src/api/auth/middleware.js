const http = require("http");
const JWT = require("../../lib/jwt.js");

class Middleware {
    static authorization(permissions) {
        permissions = permissions.map((item) => {
            const pattern =
                "^" +
                item.path
                    .replace(/:(\w+)/g, "(?<$1>[^/]+)")
                    .replace(/\*/, "(?:.*)")
                    .replace(/\/?$/, "(?:/?$)");
            const regexp = new RegExp(pattern, "i");
            item.regexp = regexp;

            return item;
        });

        return (req, res, next) => {
            const items = permissions.filter((item) => item.regexp.test(req._url.pathname));

            if (items.length) {
                const [scheme, credentials] = (req.headers.authorization || "").split(" ");

                try {
                    const payload = JWT.verify(credentials, process.env.SECRET);
                    res.locals.payload = payload;
                } catch (error) {
                    res.status(401);
                    return next(error);
                }

                const permission = items.find((item) => item.role === res.locals.payload.role);

                if (!permission) {
                    res.status(403);
                    return next(new Error(http.STATUS_CODES[403]));
                }

                if (permission.type !== res.locals.payload.type) {
                    res.status(401);
                    return next(new Error(http.STATUS_CODES[401]));
                }

                if (permission.method !== req.method) {
                    res.status(405);
                    res.setHeader("Allow", [...new Set(items.map((item) => item.method))].join(", "));
                    return next(new Error(http.STATUS_CODES[405]));
                }

                res.locals.permission = permission;
            }

            next();
        };
    }
}

module.exports = Middleware;
