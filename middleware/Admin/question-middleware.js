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

    editCategoryValidationRule() {
        return [
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category id'),
        ]
    }
    updateCategoryValidationRule() {
        return [
            this.check('category_name').trim().not().isEmpty().withMessage('Please provide category name'),
            this.check('parent_id').trim().not().isEmpty().withMessage('Please provide parent_id'),
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category id'),
        ]
    }

    campaignStatusChangeValidationRule() {
        return [
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category id'),
            this.check('status').trim().not().isEmpty().withMessage('Please provide status'),
        ]
    }

    deleteCategoryValidationRule() {
        return [
            this.check('category_id').trim().not().isEmpty().withMessage('Please provide category id'),
        ]
    }
}