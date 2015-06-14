// create server
// and callback function
var http = require('http');
var fs = require('fs');

function writeNumbers(res) {

  var counter = 0;

  // increment global, write to client
  for (var i = 0; i<100; i++) {
    counter++;
    res.write(counter.toString() + '\n');
   }
   debugger;
}

http.createServer(function (req, res) {

   var query = require('url').parse(req.url).query;
   var app = require('querystring').parse(query).file + ".txt";

   debugger;

   // content header
   res.writeHead(200, {'Content-Type': 'text/plain', 'connection' : 'keep-alive'});

   // write out numbers
   writeNumbers(res);

   // timer to open file and read contents
   setTimeout(function() { 

      debugger;
      // open and read in file contents 
      fs.readFile(app, 'utf8', function(err, data) {

         if (err)
            res.write('Could not find or open file for reading\n');
         else {
            res.write(data);
         }
         // reponse is done
         res.end();
      });
   },2000);
}).listen(8124);

console.log('Server running at 8124/');
