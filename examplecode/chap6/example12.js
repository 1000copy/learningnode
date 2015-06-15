var connect = require('connect'),
    http = require('http'),
    fs = require('fs'),
    crossroads = require('crossroads'),
    httpProxy = require('http-proxy'),
    base = '/home/examples/public_html';

// create the proxy that listens for all requests
httpProxy.createServer(function(req,res,proxy) {

   if (req.url.match(/^\/node\//))
      proxy.proxyRequest(req, res, {
        host: 'localhost',
        port: 8000
      });
   else
      proxy.proxyRequest(req,res, {
        host: 'localhost',
        port: 8124
      });
}).listen(9000);

// add route for request for dynamic resource
crossroads.addRoute('/node/{id}/', function(id) {
   console.log('accessed node ' + id);
});

// dynamic file server
http.createServer(function(req,res) {
   crossroads.parse(req.url);
   res.end('that\'s all!');
}).listen(8000);

// static file server
http.createServer(connect()
   .use(connect.favicon())
   .use(connect.logger('dev'))
   .use(connect.static(base))
   ).listen(8124);

