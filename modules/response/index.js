var fs = require('fs');
var resp = {};

fs.readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    resp[name] = require('./' + name);
});

module.exports = resp;