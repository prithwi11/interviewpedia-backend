const { DataTypes } = require('sequelize')
const Model = require('../model')

class userCertificationModel extends Model {
    constructor() {
        super(
            'int_user_certifications',
            {
                certification_id : {
                    type : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_user_id : {
                    type : DataTypes.INTEGER,
                },
                name : {
                    type : DataTypes.STRING
                },
                issuing_organization : {
                    type : DataTypes.STRING,
                },
                issue_date : {
                    type : DataTypes.DATE,
                },
            },
            {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_user_certifications'
            }
        )
    }
}

module.exports = userCertificationModel