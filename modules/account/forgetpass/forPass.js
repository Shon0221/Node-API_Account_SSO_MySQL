var util = require('util');
var resp = require('../../response');
var tools = require('../../../config/tools');

exports.pas = function(params, json, db, callback) {
    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_APP_NAME) &&
        params.hasOwnProperty(json.KEY_OS)) {
        processData(params, json, db, callback);
    } else {
        callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS));
    }
}

function processData(params, json, db, callback) {
    var conn = db.account.dbInitConn();
    /**
     * Select APP是否在DB
     */
    var sql = util.format("SELECT COUNT(App_ID) AS CountColumn, App_ID FROM App WHERE App_Name = \'%s\' AND OS = \'%s\' GROUP BY App_ID", params[json.KEY_APP_NAME], params[json.KEY_OS]);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows[0].CountColumn;
        if (len > 0) {
            /**
             * Select Account是否存在
             */
            sql = util.format("SELECT COUNT(T_I.Info_ID) AS CountColumn, T_RI.VerifyID FROM Info AS T_I JOIN Register_Info AS T_RI ON T_I.Info_ID = T_RI.Info_ID WHERE T_I.Account = \'%s\'", params[json.KEY_ACCOUNT]);
            console.log(sql);
            db.tools.dbQuery(conn, sql).then(row => {
                var len = row[0].CountColumn;
                if (len > 0) {
                    var verifyID = row[0].VerifyID;
                    sendEmail(params[json.KEY_ACCOUNT], verifyID, json, callback);
                } else {
                    sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB, callback);
                }
            }).catch(err => {
                console.log('38 ' + err);
                sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
            });
        } else {
            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_APP_NAME_ERROR, callback);
        }
    }).catch(err => {
        console.log('32 ' + err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function sendEmail(account, verifyID, json, callback) {
    var domain = tools.sendmail.domain();
    var link = util.format('http://%s:9999/Account/Aquarium/ChangePassword?VerifyID=%s', domain, verifyID);
    console.log(link);
    var sendParams = tools.sendmail.forPasMsg(account, link);
    console.log(sendParams);
    tools.sendmail.sendEmail(account, sendParams.Sub, sendParams.SendMsg).then(info => {
        callback(resp.Resp.regSucMsg(json));
    });
}

function sendErrMsg(db, conn, json, errMsgCode, callback) {
    callback(resp.Resp.errMsg(json, errMsgCode));
    db.tools.dbDisconnect(conn);
}