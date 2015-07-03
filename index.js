  var m ={}
  m["/"] = function (){return "/"}
  m["/start"] = function (){sleep(5000);return "/start"}
  m["/upload"] = function (){return "/upload"}

  var http = require("http");
  http.createServer(function(request, response) {
    var pathname = require("url").parse(request.url).pathname;
    var r = route(pathname)
    if (r)
       response.end(r());
    else
       response.end("<b>it works</b>");
  }).listen(8888);
  function route(pathname){
    return m[pathname]
  }

  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

    // $ curl localhost:8888/upload
    // upload
    // $ curl localhost:8888/start
    // start
    // $ curl localhost:8888/
    // /
