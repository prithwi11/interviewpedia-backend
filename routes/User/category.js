let express = require('express')
let router = express.Router()

let categoryController = require('../../app/Controller/Admin/category')
this.categoryControllerObj = new categoryController()

let questionController = require('../../app/Controller/Admin/question')
this.questionControllerObj = new questionController()

let homeController = require("../../app/Controller/User/home")
this.homeControllerObj = new homeController()

let categoryMiddleware = require('../../middleware/Admin/category-middleware')
let categoryMiddlewareObj = new categoryMiddleware()

let homeMiddleware = require('../../middleware/User/home-middleware')
let homeMiddlewareObj = new homeMiddleware()

let commonMiddleware = require('../../middleware/common-middleware')
let commonMiddlewareObj = new commonMiddleware()

let middlewares = []

middlewares = [
    
]
router.route('/category-list-user')
    .post(middlewares, this.categoryControllerObj.getCategory)


middlewares = [
    homeMiddlewareObj.getCategoryDetailsValidationRule(),
    commonMiddlewareObj.checkforerrors
]

router.route('/category-details')
    .post(middlewares, this.homeControllerObj.getCategoryDetails)




module.exports = router