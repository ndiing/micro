const Router = require("../../lib/router");
const Controller = require("./controller.js");

const router = new Router();

router.post("/login", Controller.login);
router.post("/verify", Controller.verify);

module.exports = router;
