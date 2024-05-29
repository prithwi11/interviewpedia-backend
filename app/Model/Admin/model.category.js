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

    getCategoryListing = async(data) => {
        let limit = data.rows
        let offset = data.first
        let sql = "SELECT c1.category_id, c1.image_url, c1.category_name, c1.level, c1.status, DATE_FORMAT(c1.added_timestamp, '%D %b, %Y') AS added_timestamp, c2.category_name AS parent_category_name, c2.category_id as parent_category_id FROM int_category c1 LEFT JOIN int_category c2 ON c1.parent_id = c2.category_id WHERE c1.is_delete = '0' ORDER BY c1.category_id DESC "
        if (data.rows) {
            sql += " LIMIT " + limit + " OFFSET " + offset
        }

        return new Promise((resolve, reject) => {
            this.connectionObj.sequelize.query(sql, {
                type: this.connectionObj.sequelize.QueryTypes.SELECT
            }).then((data) => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

    getCategoryListingTotalCount = async(data) => {
        let limit = data.rows
        let offset = data.first
        let sql = "SELECT COUNT(c1.category_id) AS totalCategoryCount FROM int_category as c1 WHERE is_delete = '0' "

        return new Promise((resolve, reject) => {
            this.connectionObj.sequelize.query(sql, {
                type: this.connectionObj.sequelize.QueryTypes.SELECT
            }).then((data) => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

    getChildCategoryAgaianstCategoryId = async(data) => {
        return this.Model.findAll({
            attributes : ['category_id', 'category_name', 'image_url'],
            where : {
                is_delete : '0',
                parent_id : data.parent_id
            }
        })
    }

    getCategoryDetails = async(data) => {
        return this.Model.findOne({
            attributes : ['category_id', 'category_name', 'image_url', 'level', 'parent_id'],
            where : {
                is_delete : '0',
                category_id : data.parent_id
            }
        })
    }
}

module.exports = categoryModel