const Router = require("../src/lib/router");

const fs = require("fs");
const path = require("path");

{
    const users = new Router();
    users.use((req, res, next) => {
        next();
    });
    users.post("/", (req, res, next) => {
        res.json({ message: "post users", body: req.body });
    });
    users.get("/", (req, res, next) => {
        // res.cookie("name1", "value1");
        // res.cookie("name2", "value2");
        // res.cookie("name3", "value3");
        // res.cookie("name4", "value4");
        // res.cookie("name5", "value5");
        res.json({ message: "get all users", query: req.query });
    });
    users.get("/:id", (req, res, next) => {
        throw new Error("Test Error");
        res.json({ message: "get users" });
    });
    users.patch("/:id", (req, res, next) => {
        res.json({ message: "patch users", body: req.body });
    });
    users.delete("/:id", (req, res, next) => {
        res.json({ message: "delete users" });
    });

    const blogs = new Router();
    blogs
        .use((req, res, next) => {
            next();
        })
        .post("/", (req, res, next) => {
            res.json({ message: "post blogs", body: req.body });
        })
        .get("/", (req, res, next) => {
            // res.cookie("name1", "value1").cookie("name2", "value2").cookie("name3", "value3").cookie("name4", "value4").cookie("name5", "value5").json({ message: "get all blogs", query: req.query });
        })
        .get("/:id", (req, res, next) => {
            throw new Error("Test Error");
            res.json({ message: "get blogs" });
        })
        .patch("/:id", (req, res, next) => {
            res.json({ message: "patch blogs", body: req.body });
        })
        .delete("/:id", (req, res, next) => {
            res.json({ message: "delete blogs" });
        });

    const api = new Router();
    api.use((req, res, next) => {
        next();
    });
    api.use("/users", users);
    api.use("/blogs", blogs);

    const app = new Router();

    app.use(Router.compression());
    app.use(Router.cookie());
    app.use(Router.json());
    app.use(Router.cors());
    app.use(Router.security());
    app.use(Router.rateLimit());
    app.use(Router.static(path.join(process.cwd(), "dist")));
    app.use("/api", api);
    app.use(Router.missing());
    app.use(Router.catchAll());

    const server = app.listen(3000, "0.0.0.0", () => {
        console.log(server.address());
    });
}

