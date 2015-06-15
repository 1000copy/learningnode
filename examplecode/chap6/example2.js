var http = require('http'),
    url =  require('url'),
    fs   = require('fs'),
    mime = require('mime');
    base = '/home/examples/public_html';

http.createServer(function (req, res) {

   pathname = base + req.url;

   fs.stat(pathname, function(err, stats) {
      if (err) {
        res.writeHead(404);
        res.write('Bad request 404\n');
        res.end();
      } else if (stats.isFile()) {
         // content type
         var type = mime.lookup(pathname);
         console.log(type);
         res.setHeader('Content-Type', type);

         // 200 status - found, no errors
         res.statusCode = 200;

         // create and pipe readable stream
         var file = fs.createReadStream(pathname);
         file.on("open", function() {

            file.pipe(res);
         });
         file.on("error", function(err) {
           console.log(err);
         });
       } else {
        res.writeHead(403);
        res.write('Directory access is forbidden');
        res.end();
       }
    });
}).listen(8124);
console.log('Server running at 8124/');
