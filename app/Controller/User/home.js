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
}