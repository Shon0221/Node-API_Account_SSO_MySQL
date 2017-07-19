'use strict';
var mysql = require('mysql');

exports.dbInitConn = function() {
    console.log("Database init");
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Aquarium_Device',
        multipleStatements: true
    });
    return conn;
}