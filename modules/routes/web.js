var db = require('../db');
var acc = require('../account');
var forPa = require('../account/forgetpass');

var Params = require('../../config/json/Params.js');

var json = new Params();

exports.vfAcc = function(req, res) {
    console.log(req.query);
    acc.verify.vf(req.query.VFCode, db, send => {
        console.log('7 ' + send);
        res.render('VerifyAcc', {
            title: 'Verify Account',
            classname: 'VerifyAcc',
            account: send
        });
    });
}

exports.chaPass = function(req, res) {
    console.log(req.query);
    forPa.checkAcc.che(req.query, json, db, send => {
        var isSuc = send.States;
        console.log(send);
        if (isSuc) {
            res.render('ChangePass', {
                title: 'Change Password',
                VerifyID: send.VerifyID
            });
        } else {
            res.render('Msg', {
                title: 'Error Msg',
                classname: 'Error Msg',
                message: send.Msg
            });
        }
    });
}

exports.chaPassDB = function(req, res) {
    console.log(req.body);
    forPa.chaPass.cha(req.body.newpas, req.body.conpas, req.body.VerifyID, db, send => {
        var isSuc = send.States;
        console.log(send);
        if (isSuc) {
            res.render('Msg', {
                title: 'Successfully Change Password',
                classname: 'Successfully Change Password',
                message: send.Msg
            });
        } else {
            res.render('ChangePass', {
                title: 'Change Password',
                message: send.Msg,
                VerifyID: send.id
            });
        }
    });
}