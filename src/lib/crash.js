function crashHandler() {
    process.on("uncaughtException", console.log);
    process.on("unhandledRejection", console.log);
}

module.exports = crashHandler;
