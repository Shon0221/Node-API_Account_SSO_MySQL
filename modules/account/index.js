var fs = require('fs');
var acc = {};

fs.readdirSync(__dirname).forEach(function(file) {
    // console.log('FileName ' + file);
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    acc[name] = require('./' + name);
});

module.exports = acc;