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
router.route('/admin-login')
    .post(middlewares, this.userManagementControllerObj.adminUserLogin)

middlewares = [
    this.userManagementMiddlewareObj.registrationValidationRule(),
    this.commonMiddlewareObj.checkforerrors
]
router.route('/register-adminuser')
    .post(middlewares, this.userManagementControllerObj.addNewUser)

module.exports = router