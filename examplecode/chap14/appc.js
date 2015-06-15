var connect = require('connect'),
    http = require('http'),
    fs = require('fs'),
    custom = require('./custom'),
    _base = '/home/examples';

http.createServer(connect()
   .use(connect.favicon('/public_html/favicon.ico'))
   .use(connect.logger())
   .use(custom(_base + '/public_html', '404 File Not Found', '403 Directory Access Forbidden'))
   .use(connect.static(_base + '/public_html'))
   ).listen(8124);
