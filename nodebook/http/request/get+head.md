#GET 方法

我们准备一个基于node 的服务器，文件名  hello.js  ，代码如下：
```
var express = require('express');
var app = express();
app.get('/hello.htm', function (req, res) {
  res.send('<h1>Hello, World!</h1>');
});
var server = app.listen(3000, function () {
  console.log('listening on 3000');
});
```
并且通过node执行node hello.js 

然后我们使用nc发起get：
```
GET /hello.htm HTTP/1.1
```
可以看到响应如下：
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 22
ETag: W/"16-FmHX0hamHjYkHeAP/7PfzA"
Date: Thu, 03 Dec 2015 09:54:01 GMT
Connection: close

<h1>Hello, World!</h1>
```
如果使用HEAD方法
```
HEAD /hello.htm HTTP/1.1
```
响应就只会发送响应消息的头，而不会发送响应消息的主体了。如下：
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 22
ETag: W/"16-FmHX0hamHjYkHeAP/7PfzA"
Date: Thu, 03 Dec 2015 09:54:01 GMT
Connection: close
```
这个案例中的响应头内，有了一个新的项目，叫做ETag，是文档的标识。如果文档改变了，这个标识就会改变。服务器发送这个的目的是为了支持客户端的条件GET。客户端可以发起一个GET ,标明如果文档改变就发送，否则就会使用本地的缓冲。这样可以省下并非必要的网络流量。

继续这个案例，搭配ETag和If-None-Match(以及If-Match)头字段可以达到使用缓存的效果。客户端可以通过 If-None-Match 头字段指明，如果文档标识不匹配标识，就发送新文档来；否则，服务器就会发送  304 Not Modified。
```
GET /sample.html HTTP/1.1
Host: example.com
If-None-Match:  W/"16-FmHX0hamHjYkHeAP/7PfzA"
```
如果服务器发现指定的标识是匹配的，那么服务器响应：
```
HTTP/1.1 304 Not Modified
X-Powered-By: Express
ETag: W/"16-FmHX0hamHjYkHeAP/7PfzA"
Date: Thu, 03 Dec 2015 09:54:01 GMT
Connection: close
```
返回一个响应头，相比需要返回整个文件是要节省流量的。

还可以搭配 Last-Modified(响应头字段），If-Modified-Since（请求头字段）,If-UnModified-Since（请求头字段） 字段达到按照修改时间来让服务器决定发送文档或者客户端使用缓存文件。
```
GET /sample.html HTTP/1.1
Host: example.com
If-Modified-Since:  Thu, 03 Dec 2015 09:54:01 GMT
```
如果文件并没有在指定时间前修改过，那么服务器响应：
```
HTTP/1.1 304 Not Modified
X-Powered-By: Express
Last-Modified: Thu, 04 Dec 2015 09:54:01 GMT
Connection: close
```