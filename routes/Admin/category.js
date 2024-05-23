let express = require('express')
let router = express.Router()

let categoryController = require('../../app/Controller/Admin/category')
this.categoryControllerObj = new categoryController()

let categoryMiddleware = require('../../middleware/Admin/category-middleware')
let categoryMiddlewareObj = new categoryMiddleware()

let commonMiddleware = require('../../middleware/common-middleware')
let commonMiddlewareObj = new commonMiddleware()

let middlewares = []

middlewares = [
    commonMiddlewareObj.validateToken,
    categoryMiddlewareObj.getCategoryListValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-list')
    .post(middlewares, this.categoryControllerObj.getCategory)



middlewares = [
    commonMiddlewareObj.validateToken,
    categoryMiddlewareObj.addCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-add')
    .post(middlewares, this.categoryControllerObj.category_add)

middlewares = [
    commonMiddlewareObj.validateToken,
    commonMiddlewareObj.validateFormData,
]
router.route('/category-add-csv')
    .post( this.categoryControllerObj.category_add_csv)


middlewares = [
    commonMiddlewareObj.validateToken,
    categoryMiddlewareObj.editCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-edit')
    .post(middlewares, this.categoryControllerObj.getCategoryDetailsyId)


middlewares = [
    commonMiddlewareObj.validateToken,
    categoryMiddlewareObj.updateCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-update')
    .post(middlewares, this.categoryControllerObj.updateCategory)


middlewares = [
    commonMiddlewareObj.validateToken,
    categoryMiddlewareObj.campaignStatusChangeValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-status-change')
    .post(middlewares, this.categoryControllerObj.updateStatus)


middlewares = [
    commonMiddlewareObj.validateToken,
    categoryMiddlewareObj.deleteCategoryValidationRule(),
    commonMiddlewareObj.checkforerrors
]
router.route('/category-delete')
    .post(middlewares, this.categoryControllerObj.deleteCategory)

module.exports = router