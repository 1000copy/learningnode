  var http = require("http");//
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
      console.log(pathname)
    // else  
    //   h404()
  }
  http.createServer(onRequest).listen(8080);


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



// var formidable = require('formidable'),
//     http = require('http'),
//     util = require('util');

// http.createServer(function(req, res) {
//   if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
//     var form = new formidable.IncomingForm();
//     form.parse(req, function(err, fields, files) {      
//       res.end('received upload:\n',files.upload.path);
//     });    
//   }

//   // show a file upload form
//   res.writeHead(200, {'content-type': 'text/html'});
//   res.end(
//     '<form action="/upload" enctype="multipart/form-data" '+
//     'method="post">'+
//     '<input type="text" name="title"><br>'+
//     '<input type="file" name="upload" multiple="multiple"><br>'+
//     '<input type="submit" value="Upload">'+
//     '</form>'
//   );
// }).listen(8888);



// var http = require("http");
// var url = require("url");

// var m ={}
// m["/form"] = form
// m["/upload"] = upload
// m["/show"] = show 
// m[404] = h404

//   function onRequest(request, response) {
//     var postData = "";
//     var pathname = url.parse(request.url).pathname;
//     console.log("Request for " + pathname + " received.");
//     var f = m[pathname]
//     if(f)
//       f(request, response)
//     else  
//       h404()
//   }
//   http.createServer(onRequest).listen(8080);
// function h404(request, response){
//       response.writeHead(404, {"Content-Type": "text/plain"});
//       response.write("404 Not found");
//       response.end();
// }
// function upload(request, response){
//     request.setEncoding("utf8");
//     var postData
//     var count = 0 
//     request.addListener("data", function(postDataChunk) {
//       postData += postDataChunk;
//       count++      
//     });
//     request.addListener("end", function() {
//       console.log(count);
//     });
// }
// function form(request, response){
//   var body = 
//     '<form action="/upload" method="post">'+
//     '<textarea name="text" rows="20" cols="60"></textarea>'+
//     '<input type="submit" value="Submit text" />'
    
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write(body);
//     response.end();
// }



// function show(r,response) {  
//   var fs = require("fs")
//   fs.readFile("C:/Users/rita/AppData/Local/Temp/upload_b3fa645d2425bc9f768494573a09b8ce", "binary", function(error, file) {
//     if(error) {
//       h500()
//     } else {
//       response.writeHead(200, {"Content-Type": "image/png"});
//       response.write(file, "binary");
//       response.end();
//     }
//   });
// }
// function h500(request, response){
//       response.writeHead(404, {"Content-Type": "text/plain"});
//       response.write("404 Not found");
//       response.end();
// }


  // var m ={}
  // m["/"] = function (){return "/"}
  // m["/start"] = function (){sleep(5000);return "/start"}
  // m["/upload"] = function (){return "/upload"}

  // var http = require("http");
  // http.createServer(function(request, response) {
  //   var pathname = require("url").parse(request.url).pathname;
  //   var r = route(pathname)
  //   if (r)
  //      response.end(r());
  //   else
  //      response.end("<b>it works</b>");
  // }).listen(8888);
  // function route(pathname){
  //   return m[pathname]
  // }

  // function sleep(milliSeconds) {
  //   var startTime = new Date().getTime();
  //   while (new Date().getTime() < startTime + milliSeconds);
  // }

    // $ curl localhost:8888/upload
    // upload
    // $ curl localhost:8888/start
    // start
    // $ curl localhost:8888/
    // /
