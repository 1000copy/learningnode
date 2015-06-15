var spawn = require('child_process').spawn;

// get photo
var photo = process.argv[2];

// conversion array
var opts = [
photo,
'-resize',
'150',
photo + ".png"];

// convert
var im = spawn('convert', opts);

im.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

im.on('exit', function (code) {
   if (code === 0)
       console.log('photo has been converted and is accessible at '
                   + photo + '.png');
});
