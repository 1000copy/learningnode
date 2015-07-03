var http = require('http')
http.createServer(function (req, res) {
   console.log(req)
   res.setHeader('Content-Type', 'text/html');
   res.statusCode = 200;
   res.end("hello")
         // create and pipe readable stream     
}).listen(8124);

console.log('Server running at 8124/');
