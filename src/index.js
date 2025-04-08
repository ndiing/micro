require("./lib/crash.js");
require("./lib/env.js");

const http = require("http");
const https = require("https");
const Router = require("./lib/router.js");
const { authorization } = require("./api/auth/controller.js");
const { permissions } = require("./api/auth/model.js");
const app = new Router();

app.use(Router.compression());
app.use(Router.cookie());
app.use(Router.json());
app.use(Router.cors());
app.use(Router.security());
app.use(Router.rateLimit());
app.use(authorization(permissions));
app.use("/api", require("./api/index.js"));
app.use(Router.missing());
app.use(Router.catchAll());

const httpServer = http.createServer();
const httpsServer = https.createServer({});

httpServer.on("request", app.listener);
httpsServer.on("request", app.listener);

httpServer.listen(process.env.HTTP_PORT, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(process.env.HTTPS_PORT, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
