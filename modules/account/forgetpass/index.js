var fs = require('fs');
var forPa = {};

fs.readdirSync(__dirname).forEach(function(file) {
    // console.log('FileName ' + file);
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    forPa[name] = require('./' + name);
});

module.exports = forPa;