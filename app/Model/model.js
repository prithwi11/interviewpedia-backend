'use strict'

class Model {
    constructor(name, schema, options) {
        const connection = require("../../config/configuration");
        this.connectionObj = new connection
        this.connectionObj.connectToMysqlDb();
        this.connectionObj = global.Connection_mysql
        this.Op = this.connectionObj.Sequelize.Op;
        this.Model = this.connectionObj.sequelize.define(name, schema, options);
    }

    addNewRecord(dataobj) {
        return this.Model.build(dataobj).save();
    }

    addbulkRecord(dataobj) {
        return this.Model.bulkCreate(dataobj);
    }  


    findByAny(dataobj) {
        return this.Model.findOne({
            where: dataobj
        });
    }

    findAll() {
        return this.Model.findAll({ raw: true});
    }

    findOneByAnyAttr(dataobj) {
        return this.Model.findOne(dataobj);
    }


    updateAnyRecord(dataobj, whereobj = {}) {
        let that = this;
        let returnData = {};
        return new Promise(function (resolve, reject) {
            that.Model.update(dataobj, whereobj)
                .then(saveData => {
                    returnData.status = 1;
                    returnData.data = saveData;
                    return resolve(returnData);
                })
                .catch(error => {
                    returnData.status = 0;
                    returnData.data = error;
                    return reject(returnData);
                })
        });
    }

    updateAnyRecordNotIn(dataobj, not_field, not_value, whereObj) {
        let that = this;
        let returnData = {};
        return new Promise(function (resolve, reject) {
            that.Model.update(dataobj, {where: {
                [that.Op.and] : whereObj,
                [not_field] : {
                    [that.Op.ne] : not_value
                }
            }})
                .then(saveData => {
                    returnData.status = 1;
                    returnData.data = saveData;
                    return resolve(returnData);
                })
                .catch(error => {
                    returnData.status = 0;
                    returnData.data = error;
                    return reject(returnData);
                })
        });
    }


    
    closeMysqlDbConnection() {
        this.connectionObj.sequelize.close();
    }


    
    findByAnyOne(dataobj) {
        return this.Model.findOne(dataobj);
    }


    
    deleteByAny(dataobj) {
        return this.Model.destroy({
            where: dataobj
        })
    }

    

    checkvalueInEdit(dataObj, id) {
        return this.Model.findOne({
            where: {
                [this.Op.and]: [
                    dataObj,
                    {
                        id: { [this.Op.ne]: id }
                    }
                ]
            }
        });
    }



    findByEmailData(emailObj) {
        return this.Model.findOne({
            where: emailObj
        })
    }

    
    findAllByAny(dataobj) {
        return this.Model.findAll(dataobj);
    }
    findByAnyWithCount(dataobj) {
        return this.Model.findAndCountAll({
            where: dataobj
        });
    }
    findAllWithCond(dataobj) {
        return this.Model.findAll({
            where: dataobj
        });
    }



    findByAnyOneIdNotIn(dataobj, id) {
        return this.Model.findOne({
            where: {
                [this.Op.and]: [
                    dataobj,
                    {
                        id: { [this.Op.ne]: id }
                    }
                ]
            }
        });
    }

    countAllByAny(dataobj) {
        return this.Model.count(dataobj);
    }

    countAllByAnyIdNotIn(dataobj, id) {
        return this.Model.count({
            where: {
                [this.Op.and]: [
                    dataobj,
                    {
                        user_id: { [this.Op.ne]: id }
                    }
                ]
            }
        });
    }
}

module.exports = Model