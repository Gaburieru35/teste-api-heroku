const mysql = require('mysql')
require('dotenv').config()

var pool = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PSW,
    "database": process.env.MYSQL_DB,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
})

exports.pool = pool;