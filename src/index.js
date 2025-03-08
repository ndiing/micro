const crashHandler = require("./lib/crash.js");
crashHandler();

require("./lib/index.js");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const http = require("http");
const https = require("https");
const { notFoundHandler, errorHandler } = require("./lib/middleware.js");
const createWebSocketServer = require("./lib/websocket.js");
const { getCerts } = require("./lib/certificate.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.static("./dist"));

app.use("/api", require("./api/index.js"));

app.use(notFoundHandler());
app.use(errorHandler());

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
