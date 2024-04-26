'use strict'

class ConnectionClass {
    /* MYSQL Connection using sequelize */
    connectToMysqlDb() {
        this.Sequelize = require('sequelize')
        const connectionObj = {
            host : process.env.DB_HOST,
            dialect : process.env.DB_DIALECT,
            pool : {
                max : 5,
                min : 0,
                idle : 5000,
                acquire : 15000,
            }
        }
        this.sequelize = new this.Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, connectionObj)

    }

}

module.exports = ConnectionClass