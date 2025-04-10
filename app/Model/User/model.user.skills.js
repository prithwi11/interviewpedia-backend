const { DataTypes } = require('sequelize')
const Model = require('../model')

class userSkillsModel extends Model {
    constructor() {
        super(
            'int_user_skills',
            {
                skill_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                },
                skill_name : {
                    type : DataTypes.STRING
                },
                proficiency_level : {
                    type : DataTypes.ENUM,
                    values : ['Beginner', 'Intermediate', 'Advanced'],
                    defaultValue : 'Beginner'
                },
                type : {
                    type : DataTypes.ENUM,
                    values : ['Primary', 'Secondary']
                },
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_user_skills'
            }
        )
    }
}

module.exports = userSkillsModel