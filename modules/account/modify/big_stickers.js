var util = require('util');
var fs = require("fs");
var resp = require('../../response');

let dir = 'save_img/Aquarium/user/Big_Stickers/';

exports.update = function(params, json, db, callback) {

    if (params.hasOwnProperty(json.KEY_ACCOUNT) && params.hasOwnProperty(json.KEY_BIG_STICKERS)) {
        processData(params, json, db, callback);
    } else {
        callback(resp.Resp.errMsg(json, json.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS));
    }
}

function processData(params, json, db, callback) {
    var conn = db.account.dbInitConn();
    /**
     * Select Account是否存在
     */
    var sql = util.format("SELECT COUNT(Info_ID) AS CountColumn, Info_ID, Big_Strickers FROM Info WHERE Account = \'%s\' GROUP BY Info_ID", params[json.KEY_ACCOUNT]);
    console.log(sql);
    db.tools.dbQuery(conn, sql).then(rows => {
        var len = rows[0].CountColumn;
        if (len > 0) {
            var infoID = rows[0].Info_ID;
            var oldFile = rows[0].Big_Strickers;
            var newPhotoContent = params[json.KEY_BIG_STICKERS];
            if (oldFile === null || oldFile === '') {
                if (newPhotoContent === '') {
                    var sql = util.format("UPDATE Info SET Big_Strickers = \'%s\', Update_Time = NOW() WHERE Info_ID = %s", '', infoID);
                    db.tools.dbQuery(conn, sql).then(row => {
                        sendSucMsg(db, conn, json, '', callback);
                    }).catch(err => {
                        console.log('33 ' + err);
                        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
                    });
                } else {
                    updateUserPhoto(db, conn, json, infoID, newPhotoContent, callback);
                }
            } else {
                oldFile = dir + oldFile;
                console.log(oldFile);
                fs.unlinkSync(oldFile);
                updateUserPhoto(db, conn, json, infoID, newPhotoContent, callback);
            }
        } else {
            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB, callback);
        }
    }).catch(err => {
        console.log('49 ' + err);
        sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
    });
}

function updateUserPhoto(db, conn, json, infoID, photoContent, callback) {
    var fs = require("fs");
    // Regular expression for image type:
    // This regular image extracts the "jpeg" from "image/jpeg"
    // var imageTypeRegularExpression = /\/(\S+)\;/;
    // The [1] value is the real image extension
    // var imageTypeDetected = photoContent.match(imageTypeRegularExpression);
    // var base64Data = photoContent.replace(/(\S+)\,/, '');
    var base64Data = photoContent;
    // fileName = infoID + '_' + Date.now() + '.' + imageTypeDetected[1];
    var fileName = infoID + '_' + Date.now() + '.jpg';
    var dirFileName = dir + fileName;
    fs.writeFile(dirFileName, base64Data, 'base64', writeErr => {
        if (writeErr) {
            writeErr = json.VALUE_ERROR_MESSAGE_OF_FILE_WRITE_ERROR;
            fileName = '';
        }
        var sql = util.format("UPDATE Info SET Big_Strickers = \'%s\', Update_Time = NOW() WHERE Info_ID = %s", fileName, infoID);
        db.tools.dbQuery(conn, sql).then(row => {
            if (writeErr) {
                sendErrMsg(db, conn, json, writeErr, callback);
            } else {
                sendSucMsg(db, conn, json, fileName, callback);
            }
        }).catch(err => {
            console.log('79 ' + err);
            sendErrMsg(db, conn, json, json.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION, callback);
        });
    });
}

function sendSucMsg(db, conn, json, fileName, callback) {
    callback(resp.Resp.updateBigStiSucMsg(json, fileName));
    db.tools.dbDisconnect(conn);
}

function sendErrMsg(db, conn, json, errMsgCode, callback) {
    callback(resp.Resp.errMsg(json, errMsgCode));
    db.tools.dbDisconnect(conn);
}