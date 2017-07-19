var fs = require('fs');
var tools = {};

fs.readdirSync(__dirname).forEach(function(file) {
    // console.log('FileName ' + file);
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    tools[name] = require('./' + name);
});

module.exports = tools;