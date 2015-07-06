 var http = require("http");
    var url = require("url");

    var m ={}
    m["/show"] = show 

    function onRequest(request, response) {
      var postData = "";
      var pathname = url.parse(request.url).pathname;
      console.log("Request for " + pathname + " received.");
      var f = m[pathname]
      if(f)
        f(request, response)
      else  
        h404()
    }
    http.createServer(onRequest).listen(80);


    function show(r,response) {  
      var fs = require("fs")
      fs.readFile("C:/Users/rita/AppData/Local/Temp/upload_b3fa645d2425bc9f768494573a09b8ce", "binary", function(error, file) {
        if(error) {
          h500()
        } else {
          response.writeHead(200, {"Content-Type": "image/png"});
          response.write(file, "binary");
          response.end();
        }
      });
    }
    function h500(request, response){
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write("404 Not found");
          response.end();
    }