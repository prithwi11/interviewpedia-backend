module.exports = class ValidatorCls {
    constructor() {
        const { check } = require('express-validator')
        this.check = check
    }

    loginValidation() {
        return [
            this.check('email').trim().not().isEmpty().isEmail().withMessage("Please provide valid email Id"),
            this.check('password').trim().not().isEmpty().withMessage("Please provide password!")
        ];
    }

    registrationValidationRule() {
        return [
            this.check('firstName').trim().not().isEmpty().withMessage("Please provide first name"),
            this.check('lastName').trim().not().isEmpty().withMessage("Please provide last name"),
            this.check('email').trim().not().isEmpty().isEmail().withMessage("Please provide valid email"),
            this.check('password').trim().not().isEmpty().withMessage("Please provide password"),
        ]
    }
}