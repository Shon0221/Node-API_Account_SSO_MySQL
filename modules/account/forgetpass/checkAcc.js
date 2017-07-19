var util = require('util');

exports.che = function(params, json, db, callback) {

    if (params.hasOwnProperty(json.KEY_VERIFY_ID)) {
        processData(params, json, db, callback);
    } else {
        resultMsg(false, 'The current account does not exist', '', callback)
    }
}

function processData(params, json, db, callback) {
    var conn = db.account.dbInitConn();
    var verifyID = params[json.KEY_VERIFY_ID];
    var sql = util.format('SELECT Info_ID FROM Register_Info WHERE VerifyID = \'%s\' GROUP BY Info_ID', verifyID);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows.length;
        if (len > 0) {
            resultMsgIncDB(db, conn, true, '', verifyID, callback);
        } else {
            resultMsgIncDB(db, conn, false, 'The current account does not exist', verifyID, callback);
        }
    }).catch(err => {
        console.log(err);
        resultMsgIncDB(db, conn, false, 'Sorry, there was something wrong happened, please try again.', verifyID, callback);
    });
}

function resultMsg(isSucc, msg, verifyID, callback) {
    var result = {
        States: isSucc,
        Msg: msg,
        VerifyID: verifyID
    };
    callback(result);
}

function resultMsgIncDB(db, conn, isSucc, msg, verifyID, callback) {
    console.log(msg);
    var result = {
        States: isSucc,
        Msg: msg,
        VerifyID: verifyID
    };
    callback(result);
    db.tools.dbDisconnect(conn);
}