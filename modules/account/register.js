var util = require('util');
var resp = require('../response');

exports.regs = function(params, json, db, callback) {
    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_PASSWORD) &&
        params.hasOwnProperty(json.KEY_USERNAME) && params.hasOwnProperty(json.KEY_REG_TYPE) &&
        params.hasOwnProperty(json.KEY_OS) && params.hasOwnProperty(json.KEY_OS_VER) &&
        params.hasOwnProperty(json.KEY_APP_NAME) && params.hasOwnProperty(json.KEY_APP_VER) &&
        params.hasOwnProperty(json.KEY_PHONE_MODEL)) {
        var usrName = params[json.KEY_USERNAME];
        if (usrName === '') {
            callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_USER_NAME_NOT_EMPTY));
        } else {
            processData(params, json, db, callback);
        }
    } else {
        callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS));
    }
}

function processData(params, json, db, callback) {
    var conn = db.account.dbInitConn();
    var appID;
    /**
     * Select APP是否在DB
     */
    var sql = util.format("SELECT App_ID FROM App WHERE App_Name = \'%s\' AND OS = \'%s\' GROUP BY App_ID", params[json.KEY_APP_NAME], params[json.KEY_OS]);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows.length;
        if (len > 0) {
            appID = rows[0].App_ID;
            /**
             * Select Account是否存在
             */
            sql = util.format("SELECT T_I.Info_ID, T_I.Password, T_I.UserName, T_I.Sex, T_I.Birthday, T_I.Country_Code, T_I.Big_Strickers, T_RI.VFStates FROM Info AS T_I JOIN Register_Info AS T_RI ON T_I.Info_ID = T_RI.Info_ID WHERE T_I.Account = \'%s\' GROUP BY T_I.Info_ID", params[json.KEY_ACCOUNT]);
            console.log(sql);
            db.tools.dbQuery(conn, sql).then(rows => {
                var len = rows.length;
                if (len > 0) {
                    var infoID = rows[0].Info_ID;
                    var states = rows[0].VFStates;
                    if (states === 0) {
                        regAccountWithoutVF(params, db, conn, json, infoID, appID, callback);
                    } else {
                        if (params[json.KEY_REG_TYPE] === 'CR') {
                            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_EXISTENCE_DB, callback);
                        } else {
                            var data = rows[0];
                            require('./login').thirdLogin(params, data, appID, db, json, conn, callback);
                        }
                    }
                } else {
                    regNewAccount(params, db, conn, json, appID, callback);
                }
            }).catch(err => {
                console.log('46 ' + err);
                sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
            });
        } else {
            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_APP_NAME_ERROR, callback);
        }
    }).catch(err => {
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function regNewAccount(params, db, conn, json, appID, callback) {
    var sha256 = require('sha256');
    var tmp = params[json.KEY_ACCOUNT] + Date.now();
    var verifyID = sha256(tmp);
    console.log('71 ' + verifyID);
    var sql = util.format("INSERT INTO Info (Account, Password, UserName, Update_Time) VALUES (\'%s\', \'%s\', \'%s\', NOW())", params[json.KEY_ACCOUNT], params[json.KEY_PASSWORD], params[json.KEY_USERNAME]);
    db.tools.dbQuery(conn, sql).then(row => {
        console.log(row);
        var infoID = row.insertId;
        if (params[json.KEY_REG_TYPE] === 'CR') {
            sql = util.format("INSERT INTO Register_Info (Info_ID, App_ID, Reg_Type, Phone_Model, OS_Ver, App_Ver, VerifyID, DateTime) VALUES (%s, %s, \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', NOW())", infoID, appID, params[json.KEY_REG_TYPE], params[json.KEY_PHONE_MODEL], params[json.KEY_OS_VER], params[json.KEY_APP_VER], verifyID);
        } else {
            sql = util.format("INSERT INTO Register_Info (Info_ID, App_ID, Reg_Type, Phone_Model, OS_Ver, App_Ver, VerifyID, VFStates, DateTime) VALUES (%s, %s, \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', 1, NOW())", infoID, appID, params[json.KEY_REG_TYPE], params[json.KEY_PHONE_MODEL], params[json.KEY_OS_VER], params[json.KEY_APP_VER], verifyID);
        }
        console.log(sql);
        return db.tools.dbQuery(conn, sql);
    }).then(row => {
        console.log('69 ' + row);
        console.log(verifyID);
        db.tools.dbDisconnect(conn);
        if (params[json.KEY_REG_TYPE] === 'CR') {
            sendEmail(params[json.KEY_ACCOUNT], verifyID, json, callback);
        } else {
            callback(resp.Resp.regSucThirdMsg(json, params));
        }
    }).catch(err => {
        console.log('71 ' + err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function regAccountWithoutVF(params, db, conn, json, infoID, appID, callback) {
    var sha256 = require('sha256');
    var tmp = params[json.KEY_ACCOUNT] + Date.now();
    var verifyID = sha256(tmp);
    console.log('71 ' + verifyID);
    var sql = util.format("UPDATE Info SET Account = \'%s\', Password = \'%s\', UserName = \'%s\', Update_Time = NOW() WHERE Info_ID = %s", params[json.KEY_ACCOUNT], params[json.KEY_PASSWORD], params[json.KEY_USERNAME], infoID);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(row => {
        sql = util.format("UPDATE Register_Info SET App_ID = %s, Reg_Type = \'%s\', Phone_Model = \'%s\', OS_Ver = \'%s\', App_Ver = \'%s\', VerifyID = \'%s\', DateTime = NOW() WHERE Info_ID = %s", appID, params[json.KEY_REG_TYPE], params[json.KEY_PHONE_MODEL], params[json.KEY_OS_VER], params[json.KEY_APP_VER], verifyID, infoID);
        console.log(sql);
        return db.tools.dbQuery(conn, sql);
    }).then(row => {
        sendEmail(params[json.KEY_ACCOUNT], verifyID, json, callback);
    }).catch(err => {
        console.log('117 ' + err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function sendEmail(account, vfCode, json, callback) {
    var tools = require('../../config/tools');
    var domain = tools.sendmail.domain();
    var link = util.format('http://%s:9999/Account/Aquarium/VF?VFCode=%s', domain, vfCode);
    console.log(link);
    var sendParams = tools.sendmail.vfMsg(account, link);
    console.log(sendParams);
    tools.sendmail.sendEmail(account, sendParams.Sub, sendParams.SendMsg).then(info => {
        callback(resp.Resp.regSucMsg(json));
    });
}

function sendErrMsg(db, conn, json, errMsgCode, callback) {
    callback(resp.Resp.errMsg(json, errMsgCode));
    db.tools.dbDisconnect(conn);
}