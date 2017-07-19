var db = require('../db');
var acc = require('../account');
var md = require('../account/modify');
var forPa = require('../account/forgetpass');

var Params = require('../../config/json/Params.js');

var json = new Params();

exports.login = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    acc.login.login(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.register = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    acc.register.regs(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.forPas = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    forPa.forPass.pas(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.mdUserName = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    md.username.update(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.mdSex = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    md.sex.update(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.mdBirthday = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    md.birthday.update(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.mdBigSti = function(req, res) {
    var resParams = req.body;
    // console.log(resParams);
    md.big_stickers.update(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.mdPassword = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    md.password.update(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.mdCountry = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    md.country.update(resParams, json, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}