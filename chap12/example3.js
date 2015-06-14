var connect = require('connect');
var pdfprocess = require('./pdfprocess');

// if POST
// upload file, kick off PDF burst, respond with ack
function upload(req, res, next){
  if ('POST' != req.method) return next();

  res.setHeader('Content-Type', 'text/html');
  if (req.files.pdffile && req.files.pdffile.type === 'application/pdf') {
     res.write('<p>Thanks ' + req.body.username +
             ' for uploading ' + req.files.pdffile.name + '</p>');
     res.end("<p>You'll receive an email with file links when processed.</p>");

     // post upload processing
     pdfprocess.processFile(req.body.username, req.body.email,
                            req.files.pdffile.path, req.files.pdffile.name);
   } else {
     res.end('The file you uploaded was not a PDF');
   }
}
// in order
// static files
// POST - upload file
// otherwise, directory listing
connect()
         .use(connect.bodyParser({uploadDir: __dirname + '/pdfs'}))
         .use(connect.static(__dirname + '/public'))
         .use(upload)
         .use(connect.directory(__dirname + '/public'))
         .listen(8124);

console.log('Server started on port 8124');
