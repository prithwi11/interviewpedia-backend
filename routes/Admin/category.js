let express = require('express')
let router = express.Router()

let categoryController = require('../../app/Controller/Admin/category')
this.categoryControllerObj = new categoryController()

middlewares = []

router.route('/category-list')
    .post(middlewares, this.categoryControllerObj.getCategory)

module.exports = router