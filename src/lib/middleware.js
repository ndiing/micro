const http = require("http");

function errorHandler() {
    return (err, req, res, next) => {
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

        if (res.statusCode >= 200 && res.statusCode < 300) {
            res.status(500);
        }

        res.json(err);
    };
}

function notFoundHandler() {
    return (req, res, next) => {
        res.status(404);
        next(new Error(http.STATUS_CODES[404]));
    };
}

module.exports = {
    errorHandler,
    notFoundHandler,
};
