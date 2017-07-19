exports.get = function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<!DOCTYPE \"html\"><html><head><title>Hello World Page</title></head><body>Hello World!</body></html>");
    res.end();
}