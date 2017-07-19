var util = require('util');

exports.cha = function(pas, conPas, verifyID, db, callback) {

    if (pas === null || pas === "") {
        resultMsg(false, "Please enter a new password", verifyID, callback);
    } else {
        if (pas.length < 8) {
            resultMsg(false, "The password is at least six characters long", verifyID, callback);
        } else {
            if (pas === conPas) {
                processData(pas, verifyID, db, callback);
            } else {
                resultMsg(false, "Confirm password input error", verifyID, callback);
            }
        }
    }
}

function processData(pas, verifyID, db, callback) {
    var conn = db.account.dbInitConn();
    var sql = util.format("SELECT COUNT(Info_ID) AS CountColumn, Info_ID FROM Register_Info WHERE VerifyID = \'%s\' GROUP BY Info_ID", verifyID);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        console.log(rows);
        var len = rows[0].CountColumn;
        if (len > 0) {
            var infoID = rows[0].Info_ID;
            var sha256 = require('sha256');
            var password = sha256(pas);
            sql = util.format("UPDATE Info SET Password = \'%s\' WHERE Info_ID = %s", password, infoID);
            console.log(sql);
            db.tools.dbQuery(conn, sql).then(row => {
                resultMsgIncDB(db, conn, true, 'Successfully changed password', verifyID, callback);
            }).catch(err => {
                console.log('36 ' + err);
                resultMsgIncDB(db, conn, false, 'Sorry, there was something wrong happened, please try again.', verifyID, callback);
            });
        } else {
            resultMsgIncDB(db, conn, false, 'Sorry, there was something wrong happened, please try again.', verifyID, callback);
        }
    }).catch(err => {
        resultMsgIncDB(db, conn, false, 'Sorry, there was something wrong happened, please try again.', verifyID, callback);
    });
}

function resultMsg(isSucc, msg, verifyID, callback) {
    var result = {
        States: isSucc,
        Msg: msg,
        id: verifyID
    };
    callback(result);
}

function resultMsgIncDB(db, conn, isSucc, msg, verifyID, callback) {
    console.log(msg);
    var result = {
        States: isSucc,
        Msg: msg,
        id: verifyID
    };
    callback(result);
    db.tools.dbDisconnect(conn);
}