var fs = require('fs');
var db = {};

fs.readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    db[name] = require('./' + name);
});

module.exports = db;