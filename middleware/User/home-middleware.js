module.exports = class validatorCls {
    constructor() {
        const { check } = require('express-validator')
        this.check = check
    }

    getCategoryDetailsValidationRule() {
        return [
            this.check('parent_id').not().isEmpty().withMessage("Please provide parent id").isInt().withMessage("Please provide valid parent id")
        ]
    }
}