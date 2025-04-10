const { DataTypes } = require('sequelize')
const Model = require('../model')

class userEducatonModel extends Model {
    constructor() {
        super(
            'int_user_education',
            {
                education_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                },
                degree : {
                    type : DataTypes.STRING
                },
                institution : {
                    type : DataTypes.STRING,
                },
                graduation_year : {
                    type : DataTypes.INTEGER,
                },
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_user_education'
            }
        )
    }
}

module.exports = userEducatonModel