const Router = require("../../lib/router.js");
const Controller = require("./controller.js");

const router = new Router();

router.use(Controller.init);
router.post("/", Controller.post);
router.get("/", Controller.getAll);
router.get("/:id", Controller.get);
router.patch("/:id", Controller.patch);
router.delete("/:id", Controller.delete);

module.exports = router;
