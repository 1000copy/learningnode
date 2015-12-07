var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('<a href="/test204">204</a> <a href="/test205">205</a> <a href="/test300">300</a>');
});

app.get('/test204', function (req, res) {
  res.status(204)
  res.set("Location","/a")
  res.send("Hello World!")
});
 
app.get('/test205', function (req, res) {
  res.status(205)
});

app.get('/test300', function (req, res) {
  res.status(300).send("<a href='/a1'>a1</a> <a href='/a2'>a2</a>")
});


var server = app.listen(3000, function () {
  console.log('listening on 3000',);
});