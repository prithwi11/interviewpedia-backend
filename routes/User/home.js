const express = require('express')
const router = express.Router()

const homeController = require('../../app/Controller/User/home')
this.homeControllerObj = new homeController()

let middlewares = [

]
router.route('/question-for-dashboard')
    .post(middlewares, this.homeControllerObj.getQuestionListForDashboard)

module.exports = router