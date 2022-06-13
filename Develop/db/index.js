// This is where the sql connection happens and export sql objects

const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees',
    port: 8889

});

db.query = util.promisify(db.query);

module.exports = db;