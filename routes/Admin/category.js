let express = require('express')
let router = express.Router()

let categoryController = require('../../app/Controller/Admin/category')
this.categoryControllerObj = new categoryController()

let categoryMiddleware = require('../../middleware/Admin/category-middleware')
let categoryMiddlewareObj = new categoryMiddleware()

let commonMiddleware = require('../../middleware/common-middleware')
let commonMiddlewareObj = new commonMiddleware()

let middlewares = []

router.route('/category-list')
    .post(middlewares, this.categoryControllerObj.getCategory)



middlewares = [
    categoryMiddlewareObj.addCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-add')
    .post(middlewares, this.categoryControllerObj.category_add)

middlewares = [
    commonMiddlewareObj.validateFormData,
]
router.route('/category-add-csv')
    .post( this.categoryControllerObj.category_add_csv)


middlewares = [
    categoryMiddlewareObj.editCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-edit')
    .post(middlewares, this.categoryControllerObj.getCategoryDetailsyId)


middlewares = [
    categoryMiddlewareObj.updateCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-update')
    .post(middlewares, this.categoryControllerObj.updateCategory)


middlewares = [
    categoryMiddlewareObj.campaignStatusChangeValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-status-change')
    .post(middlewares, this.categoryControllerObj.updateStatus)


middlewares = [
    categoryMiddlewareObj.deleteCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-delete')
    .post(middlewares, this.categoryControllerObj.deleteCategory)

module.exports = router