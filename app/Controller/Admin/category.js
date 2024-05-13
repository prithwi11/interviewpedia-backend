module.exports = class categoryController {
    constructor() {
        const categoryModel = require('../../Model/Admin/model.category')
        this.categoryModelObj = new categoryModel()
    }

    getCategory = async(req, res) => {
        try {
            const categoryObj = await this.categoryModelObj.getCategoryListing()
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
                fk_user_id : user_id,
                status : 'active',
                is_delete : '0'
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

    category_add_csv = async(req, res) => {
        try {
            let csvtojson = require('csvtojson')
            const fileUploadHelper = require('../../../helper/FileUploadHelper')
            const uploadFile = await fileUploadHelper.fileUpload(req)
            let errorFlag = false
            let errorMessage = ''
            if (uploadFile) {
                const categoryArray = await csvtojson().fromFile(uploadFile)
                console.log('categoryArray', categoryArray)
                for (let fileIndex = 0; fileIndex < categoryArray.length; fileIndex++) {
                    let categoryName = categoryArray[fileIndex]['Category']
                    let parentCategoryName = categoryArray[fileIndex]['Parent_Category']

                    /* Same category name will not be twice checking */
                    let checkCategoryNameExist = await this.categoryModelObj.findByAny({category_name : categoryName})

                    if (checkCategoryNameExist) {
                        errorFlag = true;
                        errorMessage = "Category Name Already Exists for index " + fileIndex
                    }
                    else {
                        if (parentCategoryName == 'N/A') {
                            var categoryInsertObj = {
                                category_name : categoryName,
                                parent_id : 0,
                                level : 0,
                                fk_user_id : 0
                            }
                        }
                        else {
                            let checkForParentCategory = await this.categoryModelObj.findByAny({category_name : parentCategoryName})
                            if (checkForParentCategory) {
                                var categoryInsertObj = {
                                    category_name : categoryName,
                                    parent_id : checkForParentCategory.category_id,
                                    level : checkForParentCategory.level + 1,
                                    fk_user_id : 0
                                }
                            }
                            else {
                                var categoryInsertObj = {
                                    category_name : categoryName,
                                    parent_id : 0,
                                    level : 0,
                                    fk_user_id : 0
                                }
                            }
                        }
                        let categoryInsert = await this.categoryModelObj.addNewRecord(categoryInsertObj)
                        if (categoryInsert) {
                            errorFlag = false
                        }
                    }
                }
                global.Helpers.successStatusBuild(res, 'File Uploaded successfully')
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

    getCategoryDetailsyId = async(req, res) => {
        try {
            const { category_id } = req.body
            const categoryObj = await this.categoryModelObj.findByAny({'category_id' : category_id})
            if (categoryObj) {
                global.Helpers.successStatusBuild(res, categoryObj)
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'No category found')
            }
        }
        catch(e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'some error occurred!')
        }
    }

    updateCategory = async(req, res) => {
        try {
            const { category_id, category_name, parent_id, level } = req.body
            const categoryObj = await this.categoryModelObj.findByAny({'category_id' : category_id})
            if (categoryObj) {
                let updatedDate = global.Helpers.getCurrentDateTime()
                const updateObj = {
                    category_name : category_name,
                    parent_id : parent_id,
                    level : level,
                    updated_timestamp : updatedDate
                }
                let updateCategory = await this.categoryModelObj.updateAnyRecord(updateObj, {where : {category_id : category_id}})
                if (updateCategory) {
                    global.Helpers.successStatusBuild(res, 'Category updated successfully!')
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Category not updated, please try after some time!')    
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'No Category found!')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'some error occurred!')
        }
    }

    updateStatus = async(req, res) => {
        try {
            const {category_id, status} = req.body
            const categoryObj = await this.categoryModelObj.findByAny({'category_id' : category_id})
            if (categoryObj) {
                let updatedDate = global.Helpers.getCurrentDateTime()
                const updateObj = {
                    status : status,
                    updated_timestamp : updatedDate
                }
                let updateCategory = await this.categoryModelObj.updateAnyRecord(updateObj, {where : {category_id : category_id}})

                if (updateCategory) {
                    if (status == 'active') {
                        global.Helpers.successStatusBuild(res, 'Category activated successfully!')
                    }
                    else {
                        global.Helpers.successStatusBuild(res, 'Category deactivated successfully!')
                    }
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Please try again later!')    
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'No Category found')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'some error occurred!')
        }
    }

    deleteCategory = async(req, res) => {
        try {
            const { category_id } = req.body
            const categoryObj = await this.categoryModelObj.findByAny({'category_id' : category_id})
            if (categoryObj) {
                let updatedDate = global.Helpers.getCurrentDateTime()
                const updateObj = {
                    status : 'deleted',
                    updated_timestamp : updatedDate,
                    is_delete : '1'
                }
                let updateCategory = await this.categoryModelObj.updateAnyRecord(updateObj, {where : {category_id : category_id}})
                if (updateCategory) {
                    global.Helpers.successStatusBuild(res, 'Category deleted successfully')
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Please try again after some time!')
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'No category found!')
            }
        }
        catch(e) {
            global.Helpers.badRequestStatusBuild(res, 'some error occurred!')
        }
    }
}