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
                    type : DataTypes.ENUM,
                    values : ['active', 'inactive', 'deleted'],
                    defaultValue : 'active',
                },
                is_delete : {
                    type : DataTypes.ENUM,
                    values : ['0', '1'],
                    defaultValue : '0',
                },
                added_timestamp : {
                    type : DataTypes.DATE,
                    defaultValue : DataTypes.NOW,
                },
                updated_timestamp : {
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

    getCategoryListing = async() => {
        let sql = "SELECT c1.category_id, c1.category_name, c2.category_name AS parent_category_name, c2.category_id as parent_category_id FROM int_category c1 LEFT JOIN int_category c2 ON c1.parent_id = c2.category_id"

        return new Promise((resolve, reject) => {
            this.connectionObj.sequelize.query(sql, {
            }).then((data) => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = categoryModel