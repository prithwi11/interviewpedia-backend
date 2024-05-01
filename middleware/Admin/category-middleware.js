module.exports = class validatorCls {
    constructor() {
        const { check } = require('express-validator')
        this.check = check
    }

    addCategoryValidationRule() {
        return [
            this.check('category_name').trim().not().isEmpty().withMessage('Please provide category name'),
            this.check('parent_id').trim().not().isEmpty().withMessage('Please provide parent_id'),
            this.check('level').trim().not().isEmpty().withMessage('Please provide level').isNumeric().withMessage('level must be numeric'),
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
            this.check('level').trim().not().isEmpty().withMessage('Please provide level').isNumeric().withMessage('level must be numeric'),
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