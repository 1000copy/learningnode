The impact of not having persistent connections is a major increase in loading time of resources. With keep-alive, a single TCP connection can be used to request multiple resources; without, a new TCP session (with a new three-way handshake - and, if you use SSL, a new SSL negotiation) is required for each and every resource on the page.

In practical terms, the impact will depend on the number of resources on a page, the round-trip time between client and server, and the number of concurrent requests a client's browser is making at a time (modern browsers run ~6ish by default). Lots of resources per page and distant clients will mean a very noticeable increase in page load times.

各种文档都指向说明http 的 keepalive 可以作为一个性能优化特性：保持连接并用于后续的请求重用。也有一些优美的图形说明。一种朦朦胧胧的美感：）


道理我都懂。可是我希望在code层面弄明白，到底如何让后面的请求可以利用前面请求已经建立的连接，而不是自己重新建一个新的连接。

故而，我建立了一个http server，它可以打印出当前的来访client的port。我的实验环境的客户端，服务器都在一台mac上。我从这个mac上向本机http server发起两次不同路径的请求。这两次请求的客户端IP一致,服务器地址和端口也一致，如果打印出来的两次请求的客户端口一致，就说明两个请求是重用了一个connection了。为了方便辨认，我也打印了请求的url和请求头的connection，我希望connection的值为keepalive：

    var server = http.createServer(function(req, res) {
      console.log(req.socket._getpeername().port,req.url
        ,req.headers.connection)
     res.end("echo")
    }).listen(8011,function(){
     // 这里未来发起客户端连接
     makeReq()
    })
而makeReq，我想当然的用http.request按照常规的作法：

    function makeReq(){req("/path1");req("path2")}
    function req(path){
      var options = {
                      host: 'localhost',
                      port: "8011",
                      method: 'POST',
                      path: path,        
                    }
       var req = http.request(options,function(res){
                      var assert = require("assert")
                      res.on("data",function(d){
                      })
                      res.on("end",function(d){    
                      })
                    })
       req.end()
            
     }

然而，高冷的keep-alive 这样的特性，当然不是我用传统的傻小子方法就可以追到的。是的，我希望对path2的请求可以重用path1的。结果是我遭到了必然的、可耻的、失败。在http server内的打印内容表明，不但客户端端口不同，而且连接req.headers.connection也是close,而不是keep-alive 。

在仔细查询了Node的测试用例test-keep-alive.js 我写了这个测试程序的第二版：

    var assert = require('assert');
    var http = require('http');
    var Agent = http.Agent;
    var EventEmitter = require('events').EventEmitter;
    
    var common = {PORT:8088}
    
    var agent = new Agent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 5,
      maxFreeSockets: 5,
    });
    
    function get(path, callback) {
      return agent.get({
        host: 'localhost',
        port: common.PORT,
        path: path
      }, callback);
    }
    
    function second() {
      visit("/second")
    }
    function first(){
      visit("/first",second)
    }
    
    
    function visit(path,then) {
      get(path, function (res) {
        assert.equal(res.statusCode, 200);
        // 必须有callback消费data。否则end无法emit
        res.on('data', function(){});
        res.on('end', function () {
          // 必须nextTick 以便保证then在前一个visit全部完成再执行，
          // 方可以利用keep-alive的连接。否则利用不上。
          process.nextTick(function () {
            if (then)
              then()
          });
        });
      });
    }
    var server = http.createServer(function (req, res) {
      res.end('any data');
      // 尽管url不同，但是客户端端口是一样的！这说明connection确实被共享了。
      console.log(
          req.socket._getpeername().port,req.url
        ,req.headers.connection)
    }).listen(common.PORT, function() {
      first()
    });


验证成功，打印出来的结果

    55899 'path' 'keep-alive'
    55899 'path1' 'keep-alive'
要点就是两次路径访问的客户端端口（req.socket._getpeername().port）是一样的。

代码并不复杂，但是需要注意的是两点：

1. 两次请求必须共享一个Agent。这个可以理解，唯有共享Agent才知道彼此的状态，协调使用一个connection

2. 请求必须串行，而不能重叠（overlapped)。这也是符合http标准的。所以，可以在代码中看到执行了first() 后，必须用process.nextTick()来调用second(),这是一个关键点。用process.nextTick()保证在第一个请求全部完成后在执行。

一点也不朦胧的keep-alive终于搞清楚了。


ref:

http://my.oschina.net/flashsword/blog/80037
http://stackoverflow.com/questions/20592698/keep-alive-header-clarification




 was asked to build a site , and one of the co-developer told me That I would need to include the keep-alive header.

Well I read alot about it and still I have questions.

msdn ->

The open connection improves performance when a client makes multiple requests for Web page content, because the server can return the content for each request more quickly. Otherwise, the server has to open a new connection for every request
Looking at



When The IIS (F) sends keep alive header (or user sends keep-alive) , does it mean that (E,C,B) save a connection which is only for my session ?
Where does this info is kept ( "this connection belongs to "Royi") ?
Does it mean that no one else can use that connection
If so - does it mean that keep alive-header - reduce the number of overlapped connection users ?
if so , for how long does the connection is saved to me ? (in other words , if I set keep alive- "keep" till when?)
p.s. for those who interested :

clicking this sample page will return keep alive header

Where is this info kept ("this connection is between computer A and server F")?
A TCP connection is recognized by source IP and port and destination IP and port. Your OS, all intermediate routers and proxies and the server's OS will recognize the connection by this.

HTTP works with request-response: client connects to server, performs a request and gets a response. Normally, the connection to an HTTP server is closed after each response. With HTTP keep-alive you keep the underlying TCP connection open until certain criteria are met.

This allows for multiple request-response pairs over a single TCP connection, eliminating some of TCP's relatively slow connection startup.

When The IIS (F) sends keep alive header (or user sends keep-alive) , does it mean that (E,C,B) save a connection
So, yes, as long as server and browser understand and implement the keep-alive header properly.

which is only for my session ?
What?

Does it mean that no one else can use that connection
That is the intention of TCP connections: it is an end-to-end connection intented for only those two parties.

If so - does it mean that keep alive-header - reduce the number of overlapped connection users ?
Define "overlapped connections". See HTTP persistent connection for some advantages and disadvantages, such as:

Lower CPU and memory usage (because fewer connections are open simultaneously).
Enables HTTP pipelining of requests and responses.
Reduced network congestion (fewer TCP connections).
Reduced latency in subsequent requests (no handshaking).
if so , for how long does the connection is saved to me ? (in other words , if I set keep alive- "keep" till when?)
An typical keep-alive response looks like this:

Keep-Alive: timeout=15, max=100
See Hypertext Transfer Protocol (HTTP) Keep-Alive Header for example (a draft for HTTP/2 where the keep-alive header is explained in greater detail than both 2616 and 2086):

A host sets the value of the timeout parameter to the time that the host will allows an idle connection to remain open before it is closed. A connection is idle if no data is sent or received by a host.

The max parameter indicates the maximum number of requests that a client will make, or that a server will allow to be made on the persistent connection. Once the specified number of requests and responses have been sent, the host that included the parameter could close the connection.

However, the server is free to close the connection after an arbitrary time or number of requests (just as long as it returns the response to the current request). How this is implemented depends on your HTTP server.

Define "overlapped connections" ----> I mean simultaneously. ( and I think the number of simultaneous connection will be reduced because as you said : "connection X is reserved for John cause it uses keep-alive header."....am I right ? –  Royi Namir Dec 27 '13 at 11:23
      
Yes, that's correct, a client will make less simultaneous connections when using keep-alive, it will fire the requests in serial, not parallell. :) –  CodeCaster Dec 27 '13 at 11:24 
      
So what you're saying is that if the server can handle 100 connections at a time , and all those connections uses keep-alive , then the 101'st connection will be dumped ??? –  Royi Namir Dec 27 '13 at 11:25
1   
Thank you. I'll be able to provide the bounty in 10 hours. ( when SO let me) –  Royi Namir Dec 27 '13 at 19:51
1   
End of questions. thank you. (p.s. it will be slower cuz serial is slower...) –  Royi Namir Dec 27 '13 at 20:03

