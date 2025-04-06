const Router = require("./lib/router.js");
const app = new Router();

// require("./lib/otp.js");
// require("./lib/jwt.js");

app.use(Router.compression());
app.use(Router.cookie());
app.use(Router.json());
app.use(Router.cors());
app.use(Router.security());
app.use(Router.rateLimit());
app.use("/api", require("./api/index.js"));
app.use(Router.missing());
app.use(Router.catchAll());

const server = app.listen(80, "0.0.0.0", () => {
    console.log(server.address());
});
