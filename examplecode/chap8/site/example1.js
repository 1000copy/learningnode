var   http = require('http')
    , ejs = require('ejs')
;

// create http server
http.createServer(function (req, res) {


  res.writeHead(200, {'content-type': 'text/html'});

  // data to render
  var names = ['Joe', 'Mary', 'Sue', 'Mark'];
  var title = 'Testing EJS';

  // render or error
  ejs.renderFile(__dirname + '/views/test.ejs',
                 {title : 'testing', names : names},
                   function(err, result) {
      if (!err) {
         res.end(result);
      } else {
         res.end('An error occurred accessing page');
         console.log(err);
      }
  });

}).listen(8124);

console.log('Server running on 8124/');
