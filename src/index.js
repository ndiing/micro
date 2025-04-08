require("./lib/crash.js");
require("./lib/env.js");

const http = require("http");
const https = require("https");
const Router = require("./lib/router.js");
const { authorization } = require("./api/auth/middleware.js");
const { permissions } = require("./api/auth/model.js");
const path = require("path");

const WebSocket = require("./lib/web-socket.js");

const app = new Router();

app.use(Router.compression());
app.use(Router.cookie());
app.use(Router.json());
app.use(Router.cors());
app.use(Router.security());
app.use(Router.rateLimit());
app.use(authorization(permissions));
app.use(Router.static(path.join(process.cwd(), "dist")));
app.use("/api", require("./api/index.js"));
app.use(Router.missing());
app.use(Router.catchAll());

const httpServer = http.createServer();
const httpsServer = https.createServer({});

httpServer.on("request", app.request);
httpsServer.on("request", app.request);

const socket = new WebSocket();

socket.on("connection", (client) => {
    client.on("open", () => {
        client.send(JSON.stringify({ message: "from server" }));
    });
    client.on("message", console.log);
    client.on("close", console.log);
    client.on("error", console.log);
});

httpServer.on("upgrade", socket.upgrade);
httpsServer.on("upgrade", socket.upgrade);

httpServer.listen(process.env.HTTP_PORT, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(process.env.HTTPS_PORT, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
