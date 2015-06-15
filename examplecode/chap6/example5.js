var connect = require('connect'),
    http = require('http'),
    fs = require('fs'),
    base = '/home/examples/public_html';

var writeStream = fs.createWriteStream('./log.txt',
      {'flags' : 'a',
       'encoding' : 'utf8',
       'mode' : 0666});

http.createServer(connect()
   .use(connect.logger({format : 'dev', stream : writeStream }))
   .use(connect.static(base))
   ).listen(8124);
