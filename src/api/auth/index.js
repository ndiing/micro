const Router = require("../../lib/router");
const Controller = require("./controller.js");

const router = new Router();

router.use(Controller.checkPermission)

router.post('/request-otp',Controller.requestOTP)
router.post('/send-otp',Controller.sendOTP)
router.post('/verify-otp',Controller.verifyOTP)

router.post('/refresh-token',Controller.refreshToken)
router.post('/revoke-token',Controller.revokeToken)

module.exports = router;
