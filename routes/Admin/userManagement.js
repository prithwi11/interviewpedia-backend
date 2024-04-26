let express = require('express')
let router = express.Router()

let userManagementController = require('../../app/Controller/Admin/userManagement')
this.userManagementControllerObj = new userManagementController()

let middlewares = []
router.route('/admin-login')
    .post(middlewares, this.userManagementControllerObj.adminUserLogin)

module.exports = router