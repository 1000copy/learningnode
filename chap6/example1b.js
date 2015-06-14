var http = require('http'),
    path = require('path'),
    fs   = require('fs'),
    mime = require('mime'),
    base = '/home/examples/public_html';

http.createServer(function (req, res) {

   pathname = base + req.url;
   console.log(pathname);

   path.exists(pathname, function(exists) {
      if (!exists) {
        res.writeHead(404);
        res.write('Bad request 404\n');
        res.end();
      } else {
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
       }
    });
}).listen(8124);

console.log('Server running at 8124/');
