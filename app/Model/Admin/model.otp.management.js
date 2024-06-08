const { DataTypes } = require('sequelize')
const Model = require('../model')

class otpManagementModel extends Model {
    constructor() {
        super(
            'int_otp_management',
            {
                otp_id : {
                    type  : DataTypes.INTEGER,
                    primaryKey : true,
                    autoIncrement : true
                },
                fk_user_id  : {
                    type : DataTypes.INTEGER,
                    allowNull : false
                },
                verification_code : {
                    type : DataTypes.STRING,
                    allowNull : false
                },
                status : {
                    type : DataTypes.ENUM,
                    values : ['pending', 'verified', 'unverified', 'deleted'],
                    defaultValue : 'pending'
                },
                expired_in : {
                    type : DataTypes.INTEGER,
                },
                created_at : {
                    type : DataTypes.DATE,
                    defaultValue : DataTypes.NOW
                },
                updated_at : {
                    type : DataTypes.DATE,
                }
            }, {
                timestamps : false,
                freezeTableName : true,
                tableName : 'int_otp_management'
            }
        )
    }
}

module.exports = otpManagementModel