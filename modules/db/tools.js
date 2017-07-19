var Promise = require('promise');

exports.dbQuery = function(connection, sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function(err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

exports.dbDisconnect = function(connection) {
    connection.end();
    console.log("Database is disconnected ... nn");
}