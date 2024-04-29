module.exports = class categoryController {
    constructor() {
        const categoryModel = require('../../Model/Admin/model.category')
        this.categoryModelObj = new categoryModel()
    }

    getCategory = async(req, res) => {
        try {
            const categoryObj = await this.categoryModelObj.findAllByAny({where : {is_delete : '0'}})
            if (categoryObj.length > 0) {
                global.Helpers.successStatusBuild(res, categoryObj)
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'No category found')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred')
        }
    }

    category_add = async(req, res) => {
        try {
            const { category_name, parent_id, level, user_id } = req.body
            const category_insert_obj = {
                category_name : category_name,
                parent_id : parent_id,
                level : level,
                fk_user_id : user_id
            }

            const addCategory = await this.categoryModelObj.addNewRecord(category_insert_obj)
            if (addCategory) {
                global.Helpers.successStatusBuild(res, addCategory)
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'some error occurred!')    
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'some error occurred!')
        }
    }
}