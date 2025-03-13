const Router = require("../lib/router");

const router = new Router()

router.use('/main',require('./main/index.js'))
router.use('/auth',require('./auth/index.js'))

module.exports=router