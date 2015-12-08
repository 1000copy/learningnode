#引入

如果我们知道一个站点（example.com)的根目录有一个hello.htm 的页面，那么我可以通过打开一个浏览器，输入url（http://example.com/hello.htm),等待一些时间，就可以看到一个html页面呈现在我的浏览器内。

当我们需要再进一步，我们会需要弄明白一件事：在浏览器内输入URL并按回车后，浏览器到底和服务器有怎么样的交互时，我们就需要学习HTTP协议了。正是这个协议，把客户端的请求打包为HTTP请求消息，发送给服务器，也是由这个协议把一个响应打包成HTTP响应消息，送回客户端。

客户端是形形色色的，比如常见的用户代理如IE，Chrome。或者专业用户使用的curl，wget。
服务器端也是形形色色的，比如Apache Httpd,IIS。

但是这些软件之间，遵循一个共同的交互标准。正是http的存在，我们可以根据不同情况采用不同的客户端、服务器的组合。

具体过程是这样的：

客户端软件打开服务器的连接，发送

GET /hello.htm HTTP/1.1
User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)
Host: example.com
Accept-Language: en-us
Accept-Encoding: gzip, deflate
Connection: Keep-Alive

接到这个请求消息，解析后知道，客户端想要根目录下的hello.htm 资源文件（以及更多的信息，比如它接受美国英语（Accept-Language: en-us）等），服务器软件则找到此资源，给出响应：

HTTP/1.1 200 OK
Date: Mon, 27 Jul 2009 12:28:53 GMT
Server: Apache/2.2.14 (Win32)
Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
Content-Length: 88
Content-Type: text/html
Connection: Closed

<html>
   <body>

   <h1>Hello, World!</h1>

   </body>
</html>

浏览器接收完毕后，解析内容，根据制定长度（Content-Length: 88）解析出文件内容

<html>
   <body>

   <h1>Hello, World!</h1>

   </body>
</html>

显示此html给用户，并且关闭连接（Connection: Closed）。


#请求消息

通用的目的下，一个请求消息是这样构成的

##一个请求行
正如GET /hello.htm HTTP/1.1，指明使用的方法（http method，随后介绍）),资源名称，和HTTP 版本。
##零行或者多行头字段，跟着一个CRLF。案例中的
User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)
Host: example.com
Accept-Language: en-us
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
都被称为头字段。
##一个空行（CRLF)。指示头字段完成
##可选的消息主体。
本案例是没有主体的。

头字段由冒号分隔为两部分，左边的被称为头字段名，右边的是头字段值。比如Host: example.com，说明头字段Host的值为example.com。头字段会有一个常常的列表，它们的值也各有不同，随后会给出详细解释和案例。

请求方法（Request Method）可以有我们已知的GET ,以及POST,HEAD,PUT,DELETE,CONNECT,OPTIONS,TRACE。

GET 表示我要请求一个指定名称的资源。
POST表示我要更新一个资源，资源的新数据由消息主题提供。
PUT表示我要创建一个指定名称的资源，资源的新数据由消息主题提供。
DELETE表示我要删除一个指定名称的资源。

因为方法是最关键的请求消息字段，所以，直接按照请求方法对请求消息做出归类是非常方便的。这样的话，使用GET方法的消息，直接简化为GET请求；相应的，自然还有POST请求，PUT请求，DELETE请求。等等。

#响应消息
构成如下：

 ##一个状态行。
 由http版本，状态码和状态描述文字构成。如HTTP/1.1 200 OK。状态码200表示成功。
 ##一个空行（CRLF)。指示头字段完成。
 本案例中这些行都是头字段
 Date: Mon, 27 Jul 2009 12:28:53 GMT
Server: Apache/2.2.14 (Win32)
Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
Content-Length: 88
Content-Type: text/html
Connection: Closed
##可选的消息主体。案例中就是一个hello.htm文件的内容
 
状态码共有5组，分别是 100-199，200-299，300-399，400-499，500-599的范围。案例中的200就在200-299段，我们称之为200系列，它是最常用的一个系列。

200-299 成功。指明客户端请求是正确的，并被成功执行。
300-399  重定向。指明客户端请求是正确的，不过当前请求资源的位置在别处，请再次定向你的资源位置，发起新的请求
400-499 客户端错误。指明客户端的请求是不正确的，可能是格式无法识别，或者URL太长等等。
500-599 服务器端错误。指明客户端的请求正确，但是服务器因为自身原因无法完成请求。
100-199 信息提示。这个系列的状态码只有2个，但是比较费解。会专门做出解释。

因为状态码是最关键的响应消息字段，选择不同的状态码常常意味着不同的首部字段和主体，所以，直接按照状态码对响应消息做出归类是非常方便的。这样的话，状态码为100系列的响应消息，就可以简化为100型响应。相应的，自然还有200型响应,300型响应，400型响应，500型响应。


-----------------
实验： 打开chrome，查看查看developer tools 内的network页面，然后访问google.com （或者别的你喜欢的网站）,查看URL和请求消息头的一部分的关联。


实验：
1.建立一个资源的node http 服务器
实验：访问 https://www.w3.org/People/Berners-Lee/Longer.html ，查看developer tools - network 可以看到请求消息和响应消息。

实验： 打开chrome，查看查看developer tools 内的network页面，然后访问google.com （或者别的你喜欢的网站）,查看资源请求方法；然后点击status列排序，查看有多少状态码。
2. 使用nc对node http 服务器的资源发起原始（raw）GET请求，查看原始（raw）响应

服务器代码：
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('<a href="/test204">204</a> <a href="/test205">205</a> <a href="/test300">300</a>');
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
执行node app.js
nc 输入请求，查看响应

$ nc localhost 3000
GET /

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 80
ETag: W/"50-41mmSLl6PW+Zt5VLKLE2/Q"
Date: Thu, 03 Dec 2015 08:54:23 GMT
Connection: close

查看 1.0 的http响应

$ nc localhost 3000
GET / HTTP/1.0

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 80
ETag: W/"50-41mmSLl6PW+Zt5VLKLE2/Q"
Date: Thu, 03 Dec 2015 08:52:45 GMT
Connection: close

<a href="/test204">204</a> <a href="/test205">205</a> <a href="/test300">300</a>
