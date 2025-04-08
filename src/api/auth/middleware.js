const http = require("http");
const JWT = require("../../lib/jwt.js");
const { pathToRegexp } = require("../../lib/util.js");

class Middleware {
    static authorization(permissions) {
        permissions = permissions.map((item) => {
            item.regexp = pathToRegexp(item.path);

            return item;
        });

        return (req, res, next) => {
            const items = permissions.filter((item) => item.regexp.test(req._url.pathname));

            if (items.length) {
                const [scheme, credentials] = (req.headers.authorization || "").split(" ");

                try {
                    const payload = JWT.decode(credentials);
                    res.locals.decoded = payload;
                } catch (error) {
                    res.status(400);
                    return next(http.STATUS_CODES[400]);
                }

                try {
                    const secret = res.locals.decoded.type === "access_token" ? res.locals.SECRET_ACCESS : res.locals.SECRET_REFRESH;
                    const payload = JWT.verify(credentials, secret);
                    res.locals.payload = payload;
                } catch (error) {
                    res.status(401);
                    return next(new Error(http.STATUS_CODES[401]));
                }

                const permission = items.find((item) => item.role === res.locals.payload.role && item.method === req.method);

                if (!permission) {
                    res.status(403);
                    return next(new Error(http.STATUS_CODES[403]));
                }

                res.locals.permission = permission;
            }

            next();
        };
    }
}

module.exports = Middleware;
