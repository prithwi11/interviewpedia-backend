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
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add more methods if needed
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add more headers if needed
  
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
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
let question = require('./routes/Admin/question')
let category = require('./routes/Admin/category')
let home = require('./routes/User/home')

app.use('/api/v1/user', userManagement)
app.use('/api/v1/category', category)
app.use('/api/v1/question', question)
app.use('/api/v1/home', home)

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
})

module.exports = app
