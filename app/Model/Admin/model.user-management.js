const { DataTypes } = require('sequelize')
const Model = require('../model')

class userManagementModel extends Model {
    constructor() {
        super(
            'int_user',
            {
                user_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                first_name : {
                    type : DataTypes.STRING,
                },
                last_name : {
                    type : DataTypes.STRING
                },
                email : {
                    type : DataTypes.STRING,
                    unique : true
                },
                password : {
                    type : DataTypes.STRING
                },
                user_type : {
                    type : DataTypes.ENUM,
                    values : ['super_admin', 'admin', 'user']
                },
                status : {
                    type : DataTypes.ENUM,
                    values : ['active', 'inactive', 'deleted']
                }
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_user'
            }
        )
    }
}

module.exports = userManagementModel