const crashHandler = require("./lib/crash.js");
crashHandler();

require("dotenv").config();
const http = require("http");
const https = require("https");
const createWebSocketServer = require("./lib/websocket.js");
const { getCerts } = require("./lib/certificate.js");
const app = require("./app.js");

const httpServer = http.createServer(app);
const httpsServer = https.createServer(getCerts(), app);

const upgrade = createWebSocketServer();

httpServer.on("upgrade", upgrade);
httpsServer.on("upgrade", upgrade);

httpServer.listen(process.env.HTTP_PORT, "0.0.0.0", () => {
    console.log(httpServer.address());
});

httpsServer.listen(process.env.HTTPS_PORT, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
