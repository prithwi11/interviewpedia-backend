module.exports = class homeController {
    constructor() {
        const questionModel = require('../../Model/Admin/model.question')
        this.questionModelObj = new questionModel()

        const categoryModel = require('../../Model/Admin/model.category')
        this.categoryModelObj = new categoryModel()
    }

    getQuestionListForDashboard = async(req, res) => {
        try {
            const questionList = await this.questionModelObj.getQuestionList()
            console.log('questionList', questionList)
            global.Helpers.successStatusBuild(res, questionList, 'Question list fetched successfully.')
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
        }
    }

    getCategoryDetails = async(req, res) => {
        try {
            const questionList = await this.questionModelObj.getQuestionAgainstCategory(req.body)
            const categoryList = await this.categoryModelObj.getChildCategoryAgaianstCategoryId(req.body)
            const categoryDetails = await this.categoryModelObj.getCategoryDetails(req.body)
            const dataset = {}
            dataset.question_list = questionList
            dataset.category_list = categoryList
            dataset.category_details = categoryDetails
            global.Helpers.successStatusBuild(res, dataset, 'Question list fetched successfully.')
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
        }
    }
}