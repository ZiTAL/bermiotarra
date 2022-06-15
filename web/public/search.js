"use strict";
exports.__esModule = true;
var http = require("http");
var fs = require("fs");
var jsdom_1 = require("jsdom");
var Req;
var Res;
http.createServer(function (req, res) {
    Req = req;
    Res = res;
    var params = parseGetParams(Req['url']);
    var url = cleanUrl(Req['url']);
    switch (url) {
        case '/search':
            search(params);
            break;
        default:
            showError(404, 'Not Found!');
            break;
    }
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
            if (p)
                result[p[1]] = p[2];
        });
    }
    return result;
}
function cleanUrl(url) {
    return url.replace(/\/?\?[^$]+$/, '');
}
function search(params) {
    if (typeof params['q'] !== 'undefined') {
        var dir_1 = '/home/projects/bermiotarra/web/public/berbak-esamoldiek/';
        var files = fs.readdirSync(dir_1);
        var found_1 = [];
        files['forEach'](function (file) {
            var html = fs.readFileSync(dir_1 + file, 'utf-8');
            var dom = new jsdom_1.JSDOM(html);
            var content = dom['window']['document']['body'].querySelector('div[id="content"]');
            var childs = content['childNodes'];
            var words = getWords(childs);
            words.forEach(function (w) {
                var t = '';
                w.forEach(function (p) {
                    t = t + p.textContent + "\n";
                });
                var r = new RegExp(decodeURI(params['q']), "gi");
                console.log(t, r);
                if (t.match(r)) {
                    found_1.push(w);
                }
            });
        });
        console.log(found_1);
    }
    else
        showError(400, 'Bad request!');
}
function getWords(childs) {
    var deny_nodes = ['#text', 'H2'];
    var words = [[]];
    var i = -1;
    childs.forEach(function (c) {
        var node_name = c.nodeName;
        if (deny_nodes.indexOf(node_name) !== -1)
            return false;
        if (node_name === 'H3') {
            i++;
            words[i] = [];
        }
        words[i].push(c);
    });
    return words;
    /*
      let t:string = ''
      words[1].forEach(function(c)
      {
        t = t+c.textContent+"\n"
      })
    */
}
function showError(code, text) {
    Res['writeHead'](code);
    Res['end'](text);
}
