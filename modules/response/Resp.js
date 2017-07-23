const dateFormat = require('dateformat');

/**
 * Response Success Message:
 * @return {JSON}
 * @api public
 */
exports.sucMsg = function(json) {
    var msg = {};
    msg[json.KEY_STATES] = true;
    return msg;
}

/**
 * Response Error Message:
 * @return {JSON}
 * @api public
 */
exports.errMsg = function(json, msgCode) {
    var msg = {};
    if (msgCode === json.VALUE_ERROR_MESSAGE_OF_FILE_WRITE_ERROR) {
        msg[json.KEY_STATES] = true;
    } else {
        msg[json.KEY_STATES] = false;
    }
    if (msgCode !== -1) {
        msg[json.KEY_MESSAGE] = msgCode;
    }
    return msg;
}

/**
 * Response Register Success Message:
 * @return {JSON}
 * @api public
 */
exports.regSucMsg = function(json) {
    var msg = {};
    msg[json.KEY_STATES] = true;
    return msg;
}

/**
 * Response Register Success For Third Message:
 * @return {JSON}
 * @api public
 */
exports.regSucThirdMsg = function(json, params) {
    var msg = {};
    msg[json.KEY_STATES] = true;
    msg[json.KEY_USERNAME] = params[json.KEY_USERNAME];
    msg[json.KEY_SEX] = 1;
    msg[json.KEY_COUNTRY] = "";
    msg[json.KEY_BIRTHDAY] = "";
    msg[json.KEY_BIG_STICKERS_FILENAME] = "";
    msg[json.KEY_BIND_DEVICE] = [];
    return msg;
}

/**
 * Response Login Success Message:
 * @return {JSON}
 * @api public
 */
exports.loginSucMsg = function(json, data, devData) {
    console.log(data);
    var msg = {};
    var birthday = data.Birthday;
    // var tmp = birthday.match(/(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])/g);
    console.log('70 ' + birthday);
    if (birthday && birthday !== 'null' && birthday !== '0000-00-00') {
        birthday = dateFormat(birthday, "yyyy-mm-dd");
    } else {
        birthday = "";
    }
    msg[json.KEY_STATES] = true;
    msg[json.KEY_USERNAME] = data.UserName;
    msg[json.KEY_SEX] = data.Sex;
    msg[json.KEY_COUNTRY] = "";
    msg[json.KEY_BIRTHDAY] = birthday;
    msg[json.KEY_BIG_STICKERS_FILENAME] = "";
    if (data.VFStates === 1) {
        msg[json.KEY_VF_STATES] = true;
    } else {
        msg[json.KEY_VF_STATES] = false;
    }
    var bindArr = [];
    if (devData) {
        for (var pos in devData) {
            var tmp = devData[pos];
            var tmpJson = {};
            tmpJson[json.KEY_DEVICE_MAC] = tmp.Device_Mac;
            tmpJson[json.KEY_DEVICE_NAME] = tmp.Device_Name;
            tmpJson[json.KEY_DEVICE_MODEL] = tmp.Device_Model;
            tmpJson[json.KEY_AQUARIUN_TYPE] = tmp.Aquarium_Type;
            bindArr.push(tmpJson);
        }
    }
    msg[json.KEY_BIND_DEVICE] = bindArr;
    return msg;
}

/**
 * Response Update Big_Stickers Success Message:
 * @return {JSON}
 * @api public
 */
exports.updateBigStiSucMsg = function(json, fileName) {
    var msg = {};
    msg[json.KEY_STATES] = true;
    msg[json.KEY_BIG_STICKERS_FILENAME] = fileName;
    return msg;
}