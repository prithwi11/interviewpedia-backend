const { DataTypes } = require('sequelize')
const Model = require('../model')

class categoryQuestionMappingModel extends Model {
    constructor() {
        super(
            'int_category_question_mapping',
            {
                category_question_mapping_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_category_id : {
                    type : DataTypes.INTEGER,
                    allowNull : false,
                },
                fk_question_id : {
                    type : DataTypes.INTEGER,
                    allowNull : false,
                }
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_category_question_mapping'
            }
        )
    }

    assocWithCategory = () => {
        let categoryModel = require('./model.category')
        let categoryModelObj = new categoryModel()
        this.Model.belongsTo(categoryModelObj.Model, {foreignKey : 'fk_category_id'})
        return categoryModelObj
    }
}

module.exports = categoryQuestionMappingModel