const Router = require("../../lib/router");
const Controller = require('./controller.js')

const router = new Router()

router.post('/',Controller.post)
router.get('/:id',Controller.get)
router.get('/',Controller.getAll)
router.patch('/:id',Controller.patch)
router.delete('/:id',Controller.delete)

module.exports=router