"use strict";
exports.__esModule = true;
var http = require("http");
http.createServer(function (req, res) {
    var params = parseGetParams(req.url);
    var url = cleanUrl(req.url);
    switch (url) {
        case '/search':
            break;
        default:
            break;
    }
    res.writeHead(200);
    res.end('Hello, World!');
}).listen(8080);
function parseGetParams(url) {
    var result = {};
    var query_string = url.replace(/[^\?]+\?/, '');
    if (query_string === '')
        return result;
    var params = query_string.match(/([^=&]+)=([^=&]+)/g);
    if (params === null)
        return result;
    if (params.length > 0) {
        params.forEach(function (element) {
            var p = element.match(/([^=&]+)=([^=&]+)/);
            result[p[1]] = p[2];
        });
    }
    return result;
}
function cleanUrl(url) {
    return url.replace(/\/?\?[^$]+$/, '');
}
