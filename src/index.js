require("./lib/crash.js");
require("./lib/env.js");

const http = require("http");
const https = require("https");
const path = require("path");
const Router = require("./lib/router.js");
const WebSocket = require("./lib/web-socket.js");
const { authorization } = require("./api/auth/middleware.js");

require("./lib/index.js");

const app = new Router();

app.use(Router.compression());
app.use(Router.cookie());
app.use(Router.json());
app.use(Router.cors());
app.use(Router.security());
app.use(
    Router.rateLimit([
        { method: "POST", path: "/api/auth/request", timeWindow: 60, requestQuota: 3 },
        { method: "POST", path: "/api/auth/verify", timeWindow: 60, requestQuota: 3 },
    ]),
);
app.use(
    authorization([
        { role: "admin", type: "refresh_token", method: "POST", path: "/api/auth/refresh", scope: "own" },
        { role: "admin", type: "access_token", method: "POST", path: "/api/auth/revoke", scope: "own" },
        { role: "user", type: "refresh_token", method: "POST", path: "/api/auth/refresh", scope: "own" },
        { role: "user", type: "access_token", method: "POST", path: "/api/auth/revoke", scope: "own" },
    ]),
);
app.use(Router.static(path.join(process.cwd(), "dist")));
app.use("/api", require("./api/index.js"));
app.use(Router.missing());
app.use(Router.catchAll());

const httpServer = http.createServer();
const httpsServer = https.createServer({});

const socket = new WebSocket();

socket.on("connection", (client) => {
    client.on("open", () => {
        client.send(JSON.stringify({ message: "from server" }));
    });
    client.on("message", console.log);
    client.on("close", console.log);
    client.on("error", console.log);
});

httpServer.on("request", app.request);
httpsServer.on("request", app.request);

httpServer.on("upgrade", socket.upgrade);
httpsServer.on("upgrade", socket.upgrade);

httpServer.listen(global.env.httpPort, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(global.env.httpsPort, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
