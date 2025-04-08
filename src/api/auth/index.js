const Router = require("../../lib/router.js");
const Controller = require("./controller.js");

const router = new Router();

router.post("/request", Controller.request);
router.post("/verify", Controller.verify);
router.post("/refresh", Controller.refresh);
router.post("/revoke", Controller.revoke);

module.exports = router;
