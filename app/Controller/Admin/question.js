module.exports = class questionController {
    constructor() {
        const questionModel = require('../../Model/Admin/model.question');
        this.questionModelObj = new questionModel()

        const category_question_mappingModel = require('../../Model/Admin/model.category_question_mapping')
        this.category_question_mappingModelObj = new category_question_mappingModel()
    }

    getQuestion = async(req, res) => {
        try {
            const reqBody = req.body
            const question_list = await this.questionModelObj.getQuestionList(reqBody)
            // console.log(question_list)
            global.Helpers.successStatusBuild(res, question_list, 'Question list fetched successfully!')
        }
        catch(e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
        }
    }

    insertQuestion = async(req, res) => {
        try {
            const reqBody = req.body
            const insert_question_obj = {
                question_text : reqBody.question_text,
                answer_text : reqBody.answer_text,
                fk_user_id : reqBody.user_id,
                status : 'active',
                added_timestamp : global.Helpers.getCurrentDateTime()
            }

            const insert_question = await this.questionModelObj.addNewRecord(insert_question_obj)
            if (insert_question) {
                const inserted_question_id = insert_question.question_id
                const insert_category_question_mapping_obj = {
                    fk_question_id : inserted_question_id,
                    fk_category_id : reqBody.category_id,
                }
                const insert_question_category_mapping = await this.category_question_mappingModelObj.addNewRecord(insert_category_question_mapping_obj)

                if (insert_question_category_mapping) {
                    const category_question_mapping_id = insert_question_category_mapping.category_question_mapping_id
                    const update_question_obj = {
                        fk_category_question_mapping_id : category_question_mapping_id
                    }
                    const update_question_condition_obj = {
                        where : {
                            question_id : inserted_question_id
                        }
                    }
                    const update_question = await this.questionModelObj.updateAnyRecord(update_question_obj, update_question_condition_obj)
                    
                    if (update_question) {
                        global.Helpers.successStatusBuild(res, 'Question added successfully!')
                    }
                    else {
                        global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
                    }
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')    
            }

        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
        }
    }

    getQuestionAgainstID = async(req, res) => {
        try {
            const question_id = req.body.question_id
            const get_question = await this.questionModelObj.getQuestionRecordById(question_id)
            if (get_question) {
                global.Helpers.successStatusBuild(res, get_question)
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'Some error occurred.')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, "Some error occurred.")
        }
    }

    updateQuestion = async(req, res) => {
        try {
            let question_id = req.body.question_id
            let question_text = req.body.question_text
            let answer_text = req.body.answer_text
            let category_id = req.body.category_id
            let status = req.body.status

            let updateQuestionConditionObj = {
                where : {
                    question_id : question_id
                }
            }

            let questionObj = await this.questionModelObj.findByAny({question_id : question_id})
            if (questionObj) {
                let updateQuestionObj = {
                    question_text : question_text,
                    answer_text : answer_text,
                    status : status,
                }
    
    
                let updateQuestion = await this.questionModelObj.updateAnyRecord(updateQuestionObj, updateQuestionConditionObj)
    
                if (updateQuestion) {
                    let questionMapCondObj = {
                        where : {
                            category_question_mapping_id : questionObj.fk_category_question_mapping_id
                        }
                    }

                    let questionMapUpdateObj = {
                        fk_category_id : category_id
                    }
                    let updateQuestionMap = await this.category_question_mappingModelObj.updateAnyRecord(questionMapUpdateObj, questionMapCondObj)

                    if (updateQuestionMap) {
                        global.Helpers.successStatusBuild(res, "Question updated successfully.")
                    }
                    else {
                        global.Helpers.badRequestStatusBuild(res, "Some error occurred.")
                    }
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, "Some error occurred.")
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'No Question set found.')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, "Some error occurred.")
        }
    }
}