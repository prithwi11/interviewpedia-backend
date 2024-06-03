let express = require('express')
let router = express.Router()

let userManagementController = require('../../app/Controller/Admin/userManagement')
this.userManagementControllerObj = new userManagementController()

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

module.exports = router