"use strict";
exports.__esModule = true;
var http = require("http");
var search_1 = require("../private/libs/search");
var server_1 = require("../private/libs/server");
http.createServer(function (req, res) {
    var url = server_1.Server.cleanUrl(req['url']);
    switch (url) {
        case '/search':
            new search_1.Search(req, res);
            break;
        default:
            server_1.Server.write(res, 404, 'Not Found!');
            break;
    }
}).listen(8080);
