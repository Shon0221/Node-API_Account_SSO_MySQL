var util = require('util');

exports.vf = function(verifyID, db, callback) {
    var conn = db.account.dbInitConn();
    var sql = util.format("SELECT Info_ID FROM Register_Info WHERE VerifyID = \'%s\' GROUP BY Info_ID", verifyID);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows.length;
        if (len > 0) {
            var infoID = rows[0].Info_ID;
            sql = util.format("UPDATE Register_Info SET VFStates = 1, VF_DateTime = NOW() WHERE Info_ID = %s", infoID);
            db.tools.dbQuery(conn, sql).then(row => {
                resultMsg(db, conn, 'Register success ! Please retrun to Smart Aquarium and login to enjoy!', callback);
            }).catch(err => {
                resultMsg(db, conn, 'Sorry, there was something wrong happened, please register again.', callback);
            });
        } else {
            resultMsg(db, conn, 'Sorry, there was something wrong happened, please register again.', callback);
        }
    }).catch(err => {
        resultMsg(db, conn, 'Sorry, there was something wrong happened, please register again.', callback);
    });
}

function resultMsg(db, conn, msg, callback) {
    callback(msg);
    db.tools.dbDisconnect(conn);
}