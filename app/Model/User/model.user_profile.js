const { DataTypes } = require('sequelize')
const Model = require('../model')

class userProfileModel extends Model {
    constructor() {
        super(
            'int_user_profile',
            {
                profile_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                },
                full_name : {
                    type : DataTypes.STRING
                },
                contact_number : {
                    type : DataTypes.STRING,
                },
                location : {
                    type : DataTypes.STRING,
                },
                job_title : {
                    type : DataTypes.STRING
                },
                company : {
                    type : DataTypes.STRING
                },
                years_of_experience : {
                    type : DataTypes.INTEGER
                },
                preferred_learning_method : {
                    type : DataTypes.STRING
                },
                availability_for_interviews : {
                    type : DataTypes.JSON, 
                },
                created_at : {
                    type : DataTypes.DATE,
                    defaultValue : DataTypes.NOW,
                },
                updated_at : {
                    type : DataTypes.DATE,
                }
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_user_profile'
            }
        )
    }
}

module.exports = userProfileModel