var fs = require('fs');
var md = {};

fs.readdirSync(__dirname).forEach(function(file) {
    // console.log('FileName ' + file);
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    md[name] = require('./' + name);
});

module.exports = md;