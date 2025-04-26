const Router = require("../lib/router.js");

const api = new Router();

api.use("/main", require("./main/index.js"));
api.use("/auth", require("./auth/index.js"));
api.use("/example", require("./example/index.js"));

module.exports = api;
