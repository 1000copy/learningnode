var http = require('http'),
    url =  require('url'),
    fs   = require('fs'),
    mime = require('mime');

function processRange(res,ranges,len) {

  var start, end;

  // extract start and stop range
  var rangearray = ranges.split('-');

  start =  parseInt(rangearray[0].substr(6));
  end = parseInt(rangearray[1]);

  if (isNaN(start)) start = 0;
  if (isNaN(end)) end = len -1;

  // start beyond end of file length
  if (start > len - 1) {
      res.setHeader('Content-Range', 'bytes */' + len);
      res.writeHead(416);
      res.end();
  }

  // end can't be beyond file length
  if (end > len - 1)
     end = len - 1;

  return {start:start, end:end};
}
http.createServer(function (req, res) {

   pathname = __dirname + '/public' + req.url;

   fs.stat(pathname, function(err, stats) {
      if (err) {
        res.writeHead(404);
        res.write('Bad request 404\n');
        res.end();
      } else if (stats.isFile()) {

         var opt={};

         // assume no range
         res.statusCode = 200;

         var len = stats.size;

         // we have a Range request
         if (req.headers.range) {
            opt = processRange(res,req.headers.range,len);

            // adjust length
            len = opt.end - opt.start + 1;

            // change status code to partial
            res.statusCode = 206;

            // set header
            var ctstr = 'bytes ' + opt.start + '-' +
                        opt.end + '/' + stats.size;

            res.setHeader('Content-Range', ctstr);
         }

         console.log('len ' + len);
         res.setHeader('Content-Length', len);

         // content type
         var type = mime.lookup(pathname);
         res.setHeader('Content-Type', type);
         res.setHeader('Accept-Ranges','bytes');

         // create and pipe readable stream
         var file = fs.createReadStream(pathname,opt);
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
