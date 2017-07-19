var util = require('util');
var resp = require('../response');

exports.login = function(params, json, db, callback) {
    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_PASSWORD) &&
        params.hasOwnProperty(json.KEY_OS) && params.hasOwnProperty(json.KEY_OS_VER) &&
        params.hasOwnProperty(json.KEY_APP_NAME) && params.hasOwnProperty(json.KEY_APP_VER) &&
        params.hasOwnProperty(json.KEY_PHONE_MODEL)) {
        processData(params, json, db, callback);
    } else {
        callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS));
    }
}

exports.thirdLogin = function(params, data, appID, db, json, conn, callback) {
    console.log('16 thirdLogin ' + data);
    loginData(params, data, appID, db, conn, json, callback)
}

function processData(params, json, db, callback) {
    var conn = db.account.dbInitConn();
    var userData, infoID, appID;
    /**
     * Select APP是否在DB
     */
    var sql = util.format("SELECT COUNT(App_ID) AS CountColumn, App_ID FROM App WHERE App_Name = \'%s\' AND OS = \'%s\' GROUP BY App_ID", params[json.KEY_APP_NAME], params[json.KEY_OS]);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        console.log(rows);
        var len = rows.length;
        if (len > 0) {
            var data = rows[0];
            appID = data.App_ID;
            /**
             * Select Account是否存在
             */
            sql = util.format("SELECT T_I.Info_ID, T_I.Password, T_I.UserName, T_I.Sex, T_I.Birthday, T_I.Country_Code, T_I.Big_Strickers, T_RI.VFStates FROM Info AS T_I JOIN Register_Info AS T_RI ON T_I.Info_ID = T_RI.Info_ID WHERE Account = \'%s\' GROUP BY T_I.Info_ID", params[json.KEY_ACCOUNT]);
            db.tools.dbQuery(conn, sql).then(rows => {
                console.log(rows);
                var len = rows.length;
                if (len > 0) {
                    if (len > 0) {
                        var data = rows[0];
                        loginData(params, data, appID, db, conn, json, callback);
                    } else {
                        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB, callback);
                    }
                } else {
                    sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB, callback);
                }
            }).catch(err => {
                console.log(err);
                sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
            });
        } else {
            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_APP_NAME_ERROR, callback);
        }
    }).catch(err => {
        console.log('61 ' + err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function loginData(params, data, appID, db, conn, json, callback) {
    console.log('login 59 ' + data);
    var infoID = data.Info_ID;
    if (checkPsd(data.Password, params[json.KEY_PASSWORD])) {
        selectBindDeviceData(params, db, conn, json, data, appID, callback)
    } else { // Password err
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_PASSWORD_ERROR, callback);
    }
}

function selectBindDeviceData(params, db, conn, json, userData, appID, callback) {
    var connDev = db.device_aquarium.dbInitConn();
    var infoID = userData.Info_ID;
    var sql = util.format("SELECT T_ADAB.Device_Name, T_ADAB.Aquarium_Type, T_DA.Device_Mac, T_DP.Device_Model FROM Account_Device_Aquarium_Bind AS T_ADAB JOIN Device_Aquarium AS T_DA ON T_ADAB.DA_ID = T_DA.DA_ID JOIN Device_Pro AS T_DP ON T_DA.DP_ID = T_DP.DP_ID WHERE T_ADAB.Info_ID = %s AND T_ADAB.Is_Bind = 1", infoID);
    console.log(sql);
    db.tools.dbQuery(connDev, sql).then(rows => {
        db.tools.dbDisconnect(connDev);
        updateLoginInfo(params, db, conn, json, userData, appID, rows, callback);
    }).catch(err => {
        console.log(err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
        db.tools.dbDisconnect(connDev);
    });
}

function updateLoginInfo(params, db, conn, json, userData, appID, bindDevData, callback) {
    var infoID = userData.Info_ID;
    /**
     * Select 此帳號是否有登入資訊
     */
    var sql = util.format("SELECT ID FROM Login_Info WHERE Info_ID = %s AND App_ID = %s GROUP BY ID", infoID, appID);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows.length;
        if (len > 0) {
            var data = rows[0];
            sql = util.format("UPDATE Login_Info SET Phone_Model = \'%s\', OS_Ver = \'%s\', App_Ver = \'%s\', Login_Count = Login_Count + 1, Last_Time = NOW() WHERE ID = %s", params[json.KEY_PHONE_MODEL], params[json.KEY_OS_VER], params[json.KEY_APP_VER], data.ID);
        } else {
            sql = util.format("INSERT INTO Login_Info(Info_ID, App_ID, Phone_Model, OS_Ver, App_Ver, Last_Time) VALUES (%s, %s, \'%s\', \'%s\', \'%s\', NOW())", infoID, appID, params[json.KEY_PHONE_MODEL], params[json.KEY_OS_VER], params[json.KEY_APP_VER]);
        }
        console.log(sql);
        db.tools.dbQuery(conn, sql).then(rows => {
            // console.log('Finish');
            sendUserInfo(db, conn, json, userData, bindDevData, callback);
        }).catch(err => {
            console.log('116 ' + err);
            sendUserInfo(db, conn, json, userData, callback);
        });
    }).catch(err => {
        console.log(err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function checkPsd(input, store) {
    return input.trim() === store;
}

function sendUserInfo(db, conn, json, data, bindDevData, callback) {
    callback(resp.Resp.loginSucMsg(json, data, bindDevData));
    db.tools.dbDisconnect(conn);
}

function sendErrMsg(db, conn, json, errMsgCode, callback) {
    callback(resp.Resp.errMsg(json, errMsgCode));
    db.tools.dbDisconnect(conn);
}