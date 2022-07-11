const mysql = require('mysql2');

const config = {
    db: {
        host:'localhost',
        user:'root',
        password:'password123#',
        database:'candy'
    }
}

const conn = mysql.createConnection(config.db)


module.exports = conn;