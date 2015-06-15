var connect = require('connect');
var http = require('http');

http.createServer(connect()
   .use(connect.favicon())
   .use(connect.logger())
   .use(function(req,res) {
      res.end('Hello World\n');
   })).listen(8124);
