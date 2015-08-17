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
我希望对path2的请求可以重用path1的。当然，我招到了可耻的失败。在http server内的打印内容表明，不但客户端端口不同，而且连接req.headers.connection也是close,而不是keep-alive 。

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
    // var clientport = undefined
    
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
      // request second, use the same socket
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


    