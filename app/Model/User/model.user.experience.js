const { DataTypes } = require('sequelize')
const Model = require('../model')

class userExperienceModel extends Model {
    constructor() {
        super(
            'int_user_experience',
            {
                experience_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                },
                company : {
                    type : DataTypes.STRING
                },
                role : {
                    type : DataTypes.STRING,
                },
                start_date : {
                    type : DataTypes.DATE,
                },
                end_date : {
                    type : DataTypes.DATE,
                },
                responsilbilities : {
                    type : DataTypes.STRING
                }
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_user_experience'
            }
        )
    }
}

module.exports = userExperienceModel