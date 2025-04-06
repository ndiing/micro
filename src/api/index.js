const Router = require("../lib/router.js");

const api = new Router();

api.use("/main", require("./main/index.js"));
api.use("/auth", require("./auth/index.js"));

module.exports = api;
