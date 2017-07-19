var util = require('util');
var resp = require('../../response');

exports.del = function(params, json, accTools, db, callback) {

    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_DEVICE_MAC)) {
        processData(params, json, accTools, db, callback);
    } else {
        callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS));
    }
}

function processData(params, json, accTools, db, callback) {
    var connAcc = db.account.dbInitConn();
    /**
     * Select Account是否存在
     */
    accTools.accQuery.isAccExist(db, connAcc, params[json.KEY_ACCOUNT]).then(rows => {
        var len = rows.length;
        if (len > 0) {
            db.tools.dbDisconnect(connAcc);
            var infoID = rows[0].Info_ID;
            var connDev = db.device_aquarium.dbInitConn();
            /**
             * Select Device是否存在
             */
            sql = util.format("SELECT DA_ID FROM Device_Aquarium WHERE Device_Mac = \'%s\' GROUP BY DA_ID", params[json.KEY_DEVICE_MAC]);
            console.log(sql);
            db.tools.dbQuery(connDev, sql).then(rows => {
                var len = rows.length;
                if (len > 0) {
                    var daID = rows[0].DA_ID;
                    sql = util.format("SELECT ID, Is_Bind FROM Account_Device_Aquarium_Bind WHERE Info_ID = %s AND DA_ID = %s GROUP BY ID", infoID, daID);
                    db.tools.dbQuery(connDev, sql).then(rows => {
                        var len = rows.length;
                        if (len > 0) {
                            var isBind = rows[0].Is_Bind;
                            if (isBind == 1) {
                                var id = rows[0].ID;
                                sql = util.format("UPDATE Account_Device_Aquarium_Bind SET Is_Bind = 0, Unbind_Time = NOW() WHERE ID = %s", id);
                                db.tools.dbQuery(connDev, sql).then(row => {
                                    sendSucMsg(db, connDev, json, callback);
                                }).catch(err => {
                                    sendErrMsg(db, connDev, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
                                });
                            } else {
                                sendErrMsg(db, connDev, json, json.VALUE_ERROR_MESSAGE_OF_HAVE_BEEN_NOT_BIND, callback);
                            }
                        } else {
                            sendErrMsg(db, connDev, json, json.VALUE_ERROR_MESSAGE_OF_HAVE_BEEN_NOT_BIND, callback);
                        }
                    }).catch(err => {
                        sendErrMsg(db, connDev, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
                    });
                } else {
                    sendErrMsg(db, connDev, json, json.VALUE_ERROR_MESSAGE_OF_DEVICE_MAC_ILLEGAL, callback);
                }
            }).catch(err => {
                sendErrMsg(db, connDev, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
            });
        } else {
            sendErrMsg(db, connAcc, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB, callback);
        }
    }).catch(err => {
        sendErrMsg(db, connAcc, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function sendSucMsg(db, conn, json, callback) {
    callback(resp.Resp.regSucMsg(json));
    db.tools.dbDisconnect(conn);
}

function sendErrMsg(db, conn, json, errMsgCode, callback) {
    callback(resp.Resp.errMsg(json, errMsgCode));
    db.tools.dbDisconnect(conn);
}