const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
// app.use(express.json())
require('dotenv').config();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Adjust methods as needed
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Adjust headers as needed
    next();
  });

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
let category = require('./routes/Admin/category')
app.use('/api/v1/category', category)

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
})

module.exports = app
