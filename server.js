  var http = require("http");//
  var tcp = require("net")

  function onRequest(request, response) {
    console.log(request.headers);
    request.once("upgrade",function(request, socket, head){
    	console.log(head)
    	socket.once("data",function(buffer){
    		console.log(buffer)
    		socket.write(42)
    		socket.close()
    	})
    })
    response.end("hello world\n")
  }
  http.createServer(onRequest).listen(8181);

// GET /u1/ HTTP/1.1
// Host: localhost
// Connection: Upgrade
// Upgrade: ADDONE/1.1



