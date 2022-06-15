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
        var founds_1 = [];
        var html_1 = '';
        files.forEach(function (file) {
            html_1 = fs.readFileSync(dir_1 + file, 'utf-8');
            var dom = new jsdom_1.JSDOM(html_1);
            var content = dom['window']['document']['body'].querySelector('div[id="content"]');
            var childs = content['childNodes'];
            var words = getWords(childs);
            words.forEach(function (w) {
                var t = '';
                w.forEach(function (p) {
                    t = t + p['textContent'] + "\n";
                });
                var r = new RegExp(decodeURI(params['q']), "gi");
                if (t.match(r))
                    founds_1.push(w);
            });
        });
        html_1 = wordsToHtml(founds_1);
    }
    else
        showError(400, 'Bad request!');
}
function getWords(childs) {
    //let deny_nodes = ['#text', 'H2']
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
}
function wordsToHtml(words) {
    var html = '';
    words.forEach(function (w) {
        w.forEach(function (p) {
            html = html + p.outerHTML;
        });
    });
    console.log(html);
    return html;
}
function showError(code, text) {
    Res.writeHead(code);
    Res.end(text);
}
