const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { notFoundHandler, errorHandler } = require("./lib/middleware.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.static("./dist"));
app.use("/api", require("./api/index.js"));
app.use(notFoundHandler());
app.use(errorHandler());

module.exports = app;
