var    spawn = require('child_process').spawn;

// command line arguments
var url = process.argv[2];
var output = process.argv[3];

if (url && output) {
   var wkhtmltopdf = spawn('wkhtmltopdf.sh', [url, output]);

  wkhtmltopdf.stdout.setEncoding('utf8'); 
   wkhtmltopdf.stdout.on('data', function (data) {
       console.log(data);
   });

   wkhtmltopdf.stderr.on('data', function (data) {
       console.log('stderr: ' + data);
   });

   wkhtmltopdf.on('exit', function (code) {
      console.log('child process exited with code ' + code);
   });
} else {
   console.log('You need to provide a URL and output file name');
}
