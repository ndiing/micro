(() => {
    process.on("uncaughtException", console.log);
    process.on("unhandledRejection", console.log);
})();
