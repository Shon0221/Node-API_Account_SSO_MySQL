var util = require('util');
var resp = require('../../response');

exports.update = function(params, json, db, callback) {

    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_SEX)) {
        var sex = params[json.KEY_SEX];
        if (sex == 1 || sex == 0) {
            processData(params, json, db, callback);
        } else {
            callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_SEX_VALUE_ERROR));
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
    var sql = util.format("SELECT COUNT(Info_ID) AS CountColumn, Info_ID FROM Info WHERE Account = \'%s\' GROUP BY Info_ID", params[json.KEY_ACCOUNT]);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows[0].CountColumn;
        if (len > 0) {
            var infoID = rows[0].Info_ID;
            sql = util.format("UPDATE Info SET Sex = %s, Update_Time = NOW() WHERE Info_ID = %s", params[json.KEY_SEX], infoID);
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