module.exports = class validatorCls {
    constructor() {
        const { check } = require('express-validator')
        this.check = check
    }

    getCategoryListValidationRule() {
        return [
            this.check('first').trim().not().isEmpty().withMessage("Please provide first").isInt().withMessage("Please provide valid first"),
            this.check('rows').trim().not().isEmpty().withMessage("Please provide rows").isInt().withMessage("Please provide valid rows"),
        ]
    }

    addQuestionValidationRule() {
        return [
            this.check('question_text').trim().not().isEmpty().withMessage('Please provide question'),
            this.check('answer_text').trim().not().isEmpty().withMessage('Please provide answer'),
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category'),
            this.check('user_id').trim().not().isEmpty().withMessage('Please provide user_id').isNumeric().withMessage('user_id must be numeric'),
        ]
    }

    editQuestionValidationRule() {
        return [
            this.check('question_id').trim().not().isEmpty().withMessage('Please provide question id'),
        ]
    }
    updateQuestionValidationRule() {
        return [
            this.check('question_id').trim().not().isEmpty().withMessage('Please provide question id'),
            this.check('question_text').trim().not().isEmpty().withMessage('Please provide question'),
            this.check('answer_text').trim().not().isEmpty().withMessage('Please provide answer'),
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category'),
            this.check('user_id').trim().not().isEmpty().withMessage('Please provide user_id').isNumeric().withMessage('user_id must be numeric'),
        ]
    }

    campaignStatusChangeValidationRule() {
        return [
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category id'),
            this.check('status').trim().not().isEmpty().withMessage('Please provide status'),
        ]
    }

    deleteQuestionValidationRule() {
        return [
            this.check('question_id').trim().not().isEmpty().withMessage('Please provide question id'),
        ]
    }
}