var util = require('util');
var Promise = require('promise');

exports.isAccExist = function(db, conn, acc) {
    var sql = util.format("SELECT Info_ID FROM Info WHERE Account = \'%s\' GROUP BY Info_ID", acc);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.tools.dbQuery(conn, sql).then(rows => {
            resolve(rows);
        }).catch(err => {
            return reject(err);
        });
    });
}