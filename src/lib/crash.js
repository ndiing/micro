process.on("uncaughtException", (error, origin) => {
    console.log(error, origin);
});
process.on("unhandledRejection", (reason, promise) => {
    console.log(reason, promise);
});
