const { DataTypes } = require('sequelize')
const Model = require('../model')
class questionModel extends Model {
    constructor() {
        super(
            'int_question',
            {
                question_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                question_text : {
                    type : DataTypes.STRING,
                    allowNull : false,
                    validate : {
                        notEmpty : {
                            msg : 'Question text cannot be empty'
                        },
                        len : {
                            args : [3, 100],
                            msg : 'Question text must be between 3 and 100 characters',
                        },
                    },
                },
                answer_text : {
                    type : DataTypes.STRING,
                    allowNull : false,
                    validate : {
                        notEmpty : {
                            msg : 'Answer text cannot be empty'
                        },
                        len : {
                            args : [3, 10000],
                            msg : 'Answer text must be between 3 and 100 characters',
                        },
                    },
                },
                fk_category_question_mapping_id : {
                    type : DataTypes.INTEGER,
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                },
                status : {
                    type : DataTypes.STRING,
                    allowNull : true,
                    defaultValue : 'active'
                },
                added_timestamp : {
                    type : DataTypes.DATE,
                    allowNull : true,
                    defaultValue : DataTypes.NOW
                },
                updated_timestamp : {
                    type : DataTypes.DATE,
                },
                is_delete : {
                    type : DataTypes.ENUM,
                    values : ['0', '1'],
                    defaultValue : '0',
                }
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_question'
            }
        )
    }

    assocWithCategoryQuestionMapping = () => {
        let categoryQuestionMappingModel = require('./model.category_question_mapping')
        let categoryQuestionMappingModelObj = new categoryQuestionMappingModel()
        this.Model.hasOne(categoryQuestionMappingModelObj.Model, {foreignKey : 'fk_question_id'})
        return categoryQuestionMappingModelObj
    }

    getQuestionList = async(data) => {
        const assocWithCategoryQuestionMapping = this.assocWithCategoryQuestionMapping()
        const associateWithCategory = assocWithCategoryQuestionMapping.assocWithCategory()

        return this.Model.findAll({
            attributes : ['question_id', 'question_text', 'answer_text', 'status', 'added_timestamp'],
            where : {
                is_delete : '0',
            },
            order : [
                ['question_id', 'DESC']
            ],
            include : {
                model : assocWithCategoryQuestionMapping.Model,
                attributes : ['category_question_mapping_id', 'fk_category_id', 'fk_question_id'],
                include : {
                    model : associateWithCategory.Model,
                    attributes : ['category_id', 'category_name'],
                    where : {
                        is_delete : '0',
                    },
                }
            }
        })
    }

    getQuestionRecordById = async(question_id) => {
        const assocWithCategoryQuestionMapping = this.assocWithCategoryQuestionMapping()
        const associateWithCategory = assocWithCategoryQuestionMapping.assocWithCategory()
        return this.Model.findOne({
            attributes : ['question_id', 'question_text', 'answer_text', 'status', 'added_timestamp'],
            where : {
                is_delete : '0',
                question_id : question_id
            },
            include : {
                model : assocWithCategoryQuestionMapping.Model,
                attributes : ['category_question_mapping_id', 'fk_category_id', 'fk_question_id'],
                include : {
                    model : associateWithCategory.Model,
                    attributes : ['category_id', 'category_name'],
                    where : {
                        is_delete : '0',
                    },
                }
            }
        })
    }
}

module.exports = questionModel