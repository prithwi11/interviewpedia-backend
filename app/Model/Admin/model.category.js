const { DataTypes } = require('sequelize')
const Model = require('../model')

class categoryModel extends Model {
    constructor() {
        super(
            'int_category',
            {
                category_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true,
                },
                category_name : {
                    type : DataTypes.STRING,
                    allowNull : false,
                },
                parent_id : {
                    type : DataTypes.INTEGER,
                    allowNull : false,
                    defaultValue : 0,
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                    allowNull : true
                },
                level : {
                    type : DataTypes.INTEGER,
                    allowNull : false,
                    defaultValue : 0,
                },
                status : {
                    type : DataTypes.INTEGER,
                    defaultValue : 0,
                },
                added_timestamp : {
                    type : DataTypes.DATE,
                    defaultValue : DataTypes.NOW,
                },
                updated_timestamps : {
                    type : DataTypes.DATE
                }
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_category'
            }
        )
    }
}

module.exports = categoryModel