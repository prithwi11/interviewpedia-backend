let express = require('express')
let router = express.Router()

let userManagementController = require('../../app/Controller/Admin/userManagement')
this.userManagementControllerObj = new userManagementController()

let userController = require('../../app/Controller/User/user')
this.userControllerObj = new userController()

let userManagementMiddleware = require('../../middleware/Admin/user-management-middleware')
this.userManagementMiddlewareObj = new userManagementMiddleware()

let commonMiddleware = require('../../middleware/common-middleware')
this.commonMiddlewareObj = new commonMiddleware()

let middlewares = [
    this.userManagementMiddlewareObj.loginValidation(),
    this.commonMiddlewareObj.checkforerrors
]
router.route('/login')
    .post(middlewares, this.userManagementControllerObj.loginUser)

middlewares = [
    this.userManagementMiddlewareObj.registrationValidationRule(),
    this.commonMiddlewareObj.checkforerrors
]
router.route('/register')
    .post(middlewares, this.userManagementControllerObj.addNewUser)

router.route('/create-verification')
    .post(this.userManagementControllerObj.createVerification)

router.route('/check-verification')
    .post(this.userManagementControllerObj.checkVerification)

router.route('/edit-view')
    .post(this.userControllerObj.getUserAllDetails)

module.exports = router