# http - header - chunked vs. Content-Length

在字面意义上,头字段 Transfer-Code:chunked 有些令人感到费解。然而和Content-Length参照学习效果更好。

如果你要传递的内容事先知道大小，就可以指定Content-Length。否则，可以设置传输编码： chunked。

## 让代码说话

让我们通过curl的帮助，来看看chunked的具体形象。案例：

    var http = require('http');
    var server = http.createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain',"Content-Length":7});
      res.end("chunked", 'utf8');
    }).listen(8011);

然后使用curl 的raw模式，可以看到响应

    $ curl localhost:8011 --raw 
    7
    chunked
    0

就是说，在块传输模式下，传递内容（不包括header)的第一行是一个数字，指明后面跟随的块的长度，随后是块内容。当看到传递块长度为0时，说明内容传递完成。

使用curl的无--raw 参数的情况下，是看不到原始chunked内容的。

    $curl localhost:8011 
    chunked

## 参照下粗放的php的做法

在node http 模块内，默认传递编码就是chunked编码。如果是php，默认需要自己编码。看看下面的代码，会更加直观的了解chunked的编码过程：

    header("Transfer-Encoding: chunked");
    echo "5\r\n";
    echo "Hello";
    echo "\r\n\r\n";
    flush();
    echo "5\r\n";
    echo "World";
    echo "\r\n";
    flush();
    echo "0\r\n\r\n";
    flush();
 
## 来看看对立面

如果事先知道内容大小，可以用Content-Length。案例：

    var http = require('http');
    var server = http.createServer(function(req, res) {
      res.end("chunked", 'utf8');
    }).listen(8011);

然后使用curl 的raw模式，可以看到响应

    $ curl localhost:8011 --raw -v
    ...
    > GET / HTTP/1.1
    > User-Agent: curl/7.41.0
    > Host: localhost:8011
    > Accept: */*
    > 
    < HTTP/1.1 200 OK
    < Content-Type: text/plain
    < Content-Length: 7
    < Date: Sat, 08 Aug 2015 04:02:35 GMT
    < Connection: keep-alive
    
    chunked

如果修改代码中的 content-length ,让它和实际内容长度不符合，会有些有趣的现象发生。比如长度修改为大于实际内容。那么curl会一直等待，希望服务器给出更多的内容。表现为不退出，如果在mac上，console上的菊花进度圈一直旋转。

如果小于（比如设置为6）就会报错：

    * Excess found in a non pipelined read: excess = 1, size = 6, maxdownload = 6, bytecount = 0

## 实用价值

chunked 传递模式很有价值。比如用数据库内容填充表格，可能需要比较长的时间，并且事先也无法获得内容长度。此时可以把html已有的头和架构内容发送到客户端，让客户端有机会下载head内指定的资源（如js，css等），从而并发提示效率。

    var http = require("http")
    http.createServer(function (request, response) {
        response.setHeader('Content-Type', 'text/html; charset=UTF-8');
        response.setHeader('Transfer-Encoding', 'chunked');
        var html =
            '<!DOCTYPE html>' +
            '<html lang="en">' +
                '<head>' +
                    '<meta charset="utf-8">' +
                    '<title>Chunked transfer encoding test</title>' +
                '</head>' +
                '<body>';
        response.write(html);
        html = '<h1>Chunked transfer encoding test</h1>'
        response.write(html);
        // Now imitate a long request which lasts 5 seconds.
        setTimeout(function(){
            html = '<h5>This is a chunked response after 5 seconds. The server should not close the stream before all chunks are sent to a client.</h5>'
            response.write(html);
            // since this is the last chunk, close the stream.
            html =
                '</body>' +
                    '</html';
     
            response.end(html);
        }, 5000);
        // this is another chunk of data sent to a client after 2 seconds before the
        // 5-second chunk is sent.
        setTimeout(function(){
            html = '<h5>This is a chunked response after 2 seconds. Should be displayed before 5-second chunk arrives.</h5>'
     
            response.write(html);
     
        }, 2000);
    }).listen(8011);
    