const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config();

/* MYSQL Connection STarts */
const Connection = require('./config/configuration')
global.Connection_mysql = new Connection()
global.Connection_mysql.connectToMysqlDb()
/* MYSQL Connection Ends */

/* Load Global Helper Starts */
global.CONFIG = require('./config/env/' + process.env.APP_ENV)
let CommonFunction = require('./helper/CommonHelper')
global.Helpers = new CommonFunction()
/* Load Global Helper Ends */

let userManagement = require('./routes/Admin/userManagement')
app.use('/api/v1/user', userManagement)

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
})

module.exports = app
