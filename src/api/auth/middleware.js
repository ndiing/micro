const http = require("http");
const JWT = require("../../lib/jwt.js");
const { JWTError } = require("../../lib/jwt.js");
const { pathToRegexp } = require("../../lib/util.js");

// authentication
// authorization

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

                if (!credentials) {
                    res.status(400);
                    return next(new JWTError("invalid_request", "The request is missing a required parameter"));
                }

                res.locals.credentials = credentials;

                try {
                    const payload = JWT.verify(res.locals.credentials, process.env.SECRET_TOKEN);
                    res.locals.payload = payload;
                } catch (error) {
                    res.status(401);
                    // return next(new JWTError("invalid_token", "The access token provided is malformed"));
                    return next(error);
                }

                const permission = items.find((item) => item.role === res.locals.payload.role && item.method === req.method);

                if (!permission) {
                    res.status(403);
                    return next(new JWTError("insufficient_scope", "The request requires higher privileges than provided by the access token"));
                }

                res.locals.permission = permission;

                if (res.locals.permission.type !== res.locals.payload.type) {
                    res.status(401);
                    return next(new JWTError("invalid_token", "The access token provided is invalid for other reasons"));
                }
            }

            next();
        };
    }
}

module.exports = Middleware;
