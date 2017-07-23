var util = require('util');
var resp = require('../../response');

exports.update = function(params, json, db, callback) {

    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_BIRTHDAY)) {
        var birthday = params[json.KEY_BIRTHDAY];
        var tmp = birthday.match(/(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])/g);
        if (tmp !== null && tmp.length > 0) {
            processData(params, json, db, callback);
        } else {
            callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_BIRTHDAY_VALUE_ERROR));
        }
    } else {
        callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS));
    }
}

function processData(params, json, db, callback) {
    var conn = db.account.dbInitConn();
    /**
     * Select Account是否存在
     */
    var sql = util.format("SELECT Info_ID FROM Info WHERE Account = \'%s\' GROUP BY Info_ID", params[json.KEY_ACCOUNT]);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows.length;
        if (len > 0) {
            var infoID = rows[0].Info_ID;
            sql = util.format("UPDATE Info SET Birthday = \'%s\', Update_Time = NOW() WHERE Info_ID = %s", params[json.KEY_BIRTHDAY], infoID);
            console.log(sql);
            db.tools.dbQuery(conn, sql).then(row => {
                callback(resp.Resp.regSucMsg(json));
                db.tools.dbDisconnect(conn);
            }).catch(err => {
                sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
            });
        } else {
            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB, callback);
        }
    }).catch(err => {
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function sendErrMsg(db, conn, json, errMsgCode, callback) {
    callback(resp.Resp.errMsg(json, errMsgCode));
    db.tools.dbDisconnect(conn);
}