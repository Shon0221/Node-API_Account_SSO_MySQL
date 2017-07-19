var db = require('../db');
var aqu = require('../device/aquarium');
var accTools = require('../account/tools');

var Params = require('../../config/json/Params.js');

var json = new Params();

exports.add = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    aqu.add.add(resParams, json, accTools, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.del = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    aqu.del.del(resParams, json, accTools, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}

exports.update = function(req, res) {
    var resParams = req.body;
    console.log(resParams);
    aqu.update.update(resParams, json, accTools, db, send => {
        console.log(send);
        res.json(send);
        res.end();
    });
}