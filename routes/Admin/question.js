let express = require('express')
let router = express.Router()

let questionController = require('../../app/Controller/Admin/question')
this.questionControllerObj = new questionController()


let commonMiddleware = require('../../middleware/common-middleware')
let commonMiddlewareObj = new commonMiddleware()

let questionMiddleware = require('../../middleware/Admin/question-middleware')
let questionMiddlewareObj = new questionMiddleware()

let middlewares = []

router.route('/question-list')
    .post(this.questionControllerObj.getQuestion)

middlewares = [
    questionMiddlewareObj.addQuestionValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/question-add')
    .post(middlewares, this.questionControllerObj.insertQuestion)

module.exports = router