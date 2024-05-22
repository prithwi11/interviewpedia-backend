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

middlewares = [
    questionMiddlewareObj.editQuestionValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/question-edit')
    .post(this.questionControllerObj.getQuestionAgainstID)

middlewares = [
    questionMiddlewareObj.updateQuestionValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/question-update')
    .post(middlewares, this.questionControllerObj.updateQuestion)


middlewares = [
    questionMiddlewareObj.editQuestionValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/question-delete')
    .post(this.questionControllerObj.deleteQuestion)

module.exports = router