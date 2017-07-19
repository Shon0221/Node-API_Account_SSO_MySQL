'use strict';
class Params {
    // Constructor
    constructor() {
        this.KEY_ACCOUNT = 'Account';
        this.KEY_PASSWORD = 'Password';
        this.KEY_USERNAME = 'UserName';
        this.KEY_BIG_STICKERS = 'Big_Stickers';
        this.KEY_BIG_STICKERS_FILENAME = 'Big_Stickers_Filename';
        this.KEY_COUNTRY = 'Country';
        this.KEY_SEX = 'Sex';
        this.KEY_BIRTHDAY = 'Birthday';
        this.KEY_APP_NAME = 'App_Name';
        this.KEY_APP_VER = 'App_Ver';
        this.KEY_OS = 'OS';
        this.KEY_PHONE_MODEL = 'Phone_Model';
        this.KEY_OS_VER = 'OS_Ver';
        this.KEY_VF_STATES = 'VF_States';

        this.KEY_REG_TYPE = 'Reg_Type';

        this.KEY_BIND_DEVICE = 'Bind_Devices';
        this.KEY_DEVICE_MAC = 'Device_Mac';
        this.KEY_DEVICE_NAME = 'Device_Name';
        this.KEY_DEVICE_MODEL = 'Device_Model';
        this.KEY_AQUARIUN_TYPE = 'Aquarium_Type';

        this.KEY_SSID = 'SSID';
        this.KEY_AP_SSID = 'AP_SSID';
        this.KEY_TOPIC_SUB = 'TopIC_Sub';
        this.KEY_TOPIC_GROUP = 'TopIC_Group';
        this.KEY_DEVICE_MAC = 'Device_Mac';
        this.KEY_DEVICE_MODEL = 'Device_Model';
        this.KEY_DEVICE_VERSION = 'Device_Version';
        this.KEY_DEVICE_NAME = 'Device_Name';
        this.KEY_MANUFACTURERS = 'Manufacturers';
        this.KEY_AQUARIUM_TYPE = 'Aquarium_Type';

        this.KEY_STATES = 'States';
        this.KEY_MESSAGE = 'Message';

        this.KEY_VERIFY_ID = 'VerifyID';

        this.VALUE_ERROR_MESSGAE_OF_SERVER_EXCEPTION = 0;
        this.VALUE_ERROR_MESSAGE_OF_APP_NAME_ERROR = 1;
        this.VALUE_ERROR_MESSAGE_OF_USER_NAME_EMPTY = 2;
        this.VALUE_ERROR_MESSAGE_OF_SEX_VALUE_ERROR = 3;
        this.VALUE_ERROR_MESSAGE_OF_BIRTHDAY_VALUE_ERROR = 4;
        this.VALUE_ERROR_MESSAGE_OF_LOSE_JSON_PARAMS = 5;
        this.VALUE_ERROR_MESSAGE_OF_ACCOUNT_NO_EXISTENCE_DB = 6;
        this.VALUE_ERROR_MESSAGE_OF_ACCOUNT_EXISTENCE_DB = 7;
        this.VALUE_ERROR_MESSAGE_OF_PASSWORD_ERROR = 8;
        this.VALUE_ERROR_MESSAGE_OF_DEVICE_MAC_ILLEGAL = 9;
        this.VALUE_ERROR_MESSAGE_OF_HAVE_BEEN_BIND = 10;
        this.VALUE_ERROR_MESSAGE_OF_HAVE_BEEN_NOT_BIND = 11;
        this.VALUE_ERROR_MESSAGE_OF_FILE_WRITE_ERROR = 12;
    }
}

// export the class
module.exports = Params;