var    spawn = require('child_process').spawn;

var pdftk = spawn('pdftk', [__dirname + '/pdfs/datasheet-node.pdf', 'dump_data']);

pdftk.stdout.on('data', function (data) {

  // convert results to an object
  var arry = data.toString().split('\n');
  var obj = {};
  arry.forEach(function(line) {
    var tmp = line.split(':');
    obj[tmp[0]] = tmp[1];
  });

  // print out number of pages
  console.log(obj['NumberOfPages']);
});

pdftk.stderr.on('data', function (data) {
   console.log('stderr: ' + data);
});

pdftk.on('exit', function (code) {
   console.log('child process exited with code ' + code);
});
