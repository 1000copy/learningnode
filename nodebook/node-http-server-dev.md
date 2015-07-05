#node http server  development

也许，你已经高频多次听到了node。毕竟它真的很火。可是你还在犹豫，毕竟，学习一门语言以及库，是一个开坑和被坑的过程。也担心学习后不知道可以做点什么。

我也和你一样。经过半年的学习，阅读了不少代码，我试图以此文，引导你做一个http server。

东西成了，学习也就成了。


##安装

安装node，在windows/mac 上非常简单，和其他应用软件也没有什么区别：下载安装包，然后执行，听从它的指示，一步步的走。完成后，在command line输入命令：

  $node -v
  v0.12.4

看到版本号？成功。版本号的话，偶数（偶数是稳定版，奇数是开发版）就好，大点就好。

Linux 上复杂点。不过这和我们的内容关系不大。可以看官方的安装指南。自己消化下。

##Hello World

Hello world 太多，可是初学者都喜欢。所以，我老着脸，就再来一个。

创建一个helloworld.js文件（哦，我爱sublime text）。代码：

    console.log("Hello World");

保存文件，到command line执行：

    node helloworld.js

正常的话，就会在终端输出Hello World 。

选择一个叫做“简洁”的角度闻过去，有点c的味道，比c的味道更浓。你看，不需要#include，不需要main{}。
也不需要设置环境变量。关于最后一条，java，golang两位同学，我没有针对你。

我喜欢这种一点点多余的泡泡肉也没有的感觉。

##不想重复的node app.js ?

输入node app.js ,ctrol+c ,然后一百遍的重复，以便重写测试代码。这样的输入一天下来也真是厌倦。所以nodemon 可以帮忙。

它会监视当前目录，如果发现代码有修改，就会自动重启代码。

  npm i nodemon 
  nodemon app.js

然后修改你的app.js ，会发现nodemon自动运行app.js 。

我的双显示器正好派上用场。一块运行nodemon,另外一块作为编辑器的工作台，编写我的app.js，然后save。这个小小的机器人不厌其烦的检测file save->重启app.js->显示错误（甚至app.js也crash。当然nodemon不会因此也crash）->待你修正保存。直接正确为止。

虽然功能简单，但是恰如其分，一个好工具。

## 异步来了

要是想要启动后延时1秒在say hi，怎么办？

  function hi(){console.log("hi")}
  setTimeout(hi,1000)

setTimeout是一个全局函数，文档这样说明它的规格：

  setTimeout(callback, delay[, arg][, ...])#

第一个参数，名字为callback，作为js的文档约定，说明此参数可以是一个函数。我们可以把函数作为变量传递给SetTimeout。这里传递的不是hi的结果，而是hi 本身！setTimeout会在它的实现内调用它。

还可以简洁。hi这个名字的存在不太必要，我们可以在应用hi的地方，直接定义这个函数：

    setTimeout(function(){console.log("hi")},1000)

这个函数定义存在，功能可用，但是无名。它就是“匿名函数"。

一个函数可以作为变量传递给另一个函数。我们可以先定义一个函数，然后传递，也可以在传递参数的地方直接定义函数。

简洁还在。但是有了callback，感觉稍微不太一样了，特别是和php等相比。

当setTimeout执行时，1s后会打印，那么<1s的时间，在干啥？等待。内部实现来说，node会把这个hi作为callback排到队列内。当道setTimeout的时间一到就会触发callback的执行。

    setTimeout(function(){console.log("hi")},1000)
    console.log("ready")

输出：
    ready
    hi
这个期间，node可以继续处理其他的工作，setTimeout 不会被阻塞，而是可以继续执行后面的代码。2行代码，其实执行线索上看有两条。

node大量使用异步代码，以此为卖点。怎么强调这个特性也不为过。对于强调并发的服务器编码，可以无需诉诸于多线程就能多线索的处理并发客户端需求。后面会看到在http sever内对此特性的使用和分析。

因为来了事件就调用callback，所以异步编程和事件驱动就常常一起出现了。尽管他们并不相同，在node 内常常是一回事，我们也不去细分了。

## 来个http server 

以往我的主语言是c#，那会儿，作为程序员，只能是IIS的用户。用户这个词，深深的伤害了我。现在node可以帮我报一箭之仇。

看看我们可以做点什么:

-用户可以通过浏览器使用我们的应用
-用户请求http://domain/时，可以看到一个Apache Style的 It works 
-用户访问http://domain/start ,可以看到一个upload Form，利用它来上传图片
-用户访问http://domain/show , 可以显示此上传图片



## 自顶向下，分而治之

我们来分解一下这个应用，为了实现上文的用例，我们需要实现哪些部分呢？

-提供html页面，-> 需要HTTP Server
-路由。不同的URL，会有不同的处理模块（function）。匹配两者的模块，就叫做路由。
-能处理POST数据，能够处理上传图片

路由这样的工作，以往是有Web Server会处理。可是我们现在要自己做。


## Http Server


现在建立一个目录，好比是frodo. touch 一个 server.js的文件出来，输入：

    var http = require("http");
    http.createServer(function(request, response) {      
      response.setHeader('content-type', 'text/plain')
      response.end("42");
    }).listen(8888);

    // visit http://localhost:8888

呃。完了？嗯。用node跑跑。

   nodemon server.js

开一个浏览器（我爱chrome）访问http://localhost:8888/，看到 42 就成了。

## 从代码到人话

很多时候我们需要基于他人的工作。做http就应该引用http模块。它是node的内置模块。

我们可以先看以上代码的主线索,启动服务器，并侦听8888端口：

  var http = require("http");

  var server = http.createServer();
  server.listen(8888);


createServer。创建一个http server,侦听 8888端口。如果有请求到，就调用匿名函数：

    function(request, response) {
      response.setHeader('content-type', 'text/plain')
      response.end("42");
    }

在此函数内，调用response.end,把内容（42）发送给Browser。

setHeader指明返回给浏览器的内容的格式。这里指明内容为平文本（text/plain)。还有比较多的常用格式，包括text/html,image/jpeg ,text/script 。望文生义即可。我不写这一行的话，现代的浏览器常常可以自动识别内容的格式。所以我常常也偷个懒。

这样当然并不严谨。为了快速的观其大略，有些细节可以暂时忽略。

### 玩玩http

启动服务后
  nodemon server.js

可以在chrome内访问 localhost:8888,多开几个标签，都来打开 http://localhost:8888/，可以看到这个server总可以沉着的、稳定而单调的返回42 。多用户访问哦。

更多时候，我会用curl，一个命令行的browser模拟器。

  curl http://localhost:8888/
  42

实际上，开发node应用，第一次我常常会用chrome访问测试，后来的反复越多，我越会倾向于使用curl。如果我做这样app，我只有关心返回的是不是我期望的42，而不必关心chrome的进度条，菜单，状态栏。。。多好。42 ！最低眼球识别成本。

因此我不爱ide，而爱 sublime text 也基于同样的理由。


##提供html

易如反掌：

    var http = require("http");
    http.createServer(function(request, response) {
      response.end("<b>it works</b><a href='/start'>start</a>");
    }).listen(80);

    $curl localhost
    <b>it works</b><a href='/start'>start</a>

说明：
为了再省点事儿，我侦听改为 80 ，这样browser输入url的时候，不需要输入port。

##请求路由

http server过来的都是URL，而我们的代码是一个个的函数。URL 映射到函数的方法，就是路由。

因此，我们需要查看HTTP请求，从中提取出请求URL:

    var http = require("http");
    http.createServer(function(request, response) {
      var pathname = url.parse(request.url).pathname;
      console.log(pathname);
      response.end("<b>it works</b><a href='/start'>start</a>");
    }).listen(80);

点击start url，会看到/start 打印出来。

http 模块来的url，形如 http://domain.com:80/start?foo=bar&baz=bzz。可以通过url模块，解析它的pathname。这里的pathname = "/start"

    var url = require("url");
    var assert = require("assert")
    var u = "http://domain.com:80/start?foo=bar&baz=bzz"
    assert.equal("/start",url.parse(u).pathname)

### 路由

有了路由，来自/start和/upload的请求会导流到不同函数。所以，我们应该有一个结构，map两者的关系

  var m = [
    {path:"/",func:function (){return "/"}},
    {path:"/start",func:function (){return "/start"}},
    {path:"/upload",func:function (){return "/upload"}}
  ]


首先，加入路由函数：


  var http = require("http");
  http.createServer(function(request, response) {
    var pathname = require("url").parse(request.url).pathname;
    var r = route(pathname)
    if (r)
       response.end(r());
    else
       response.end("<b>it works</b>");
  }).listen(80);
  function route(pathname){
    for(var i=0;i<m.length;i++){
      if (m[i].path == pathname)
        return m[i].func
    }
    return null
  }

我们故伎重演，用curl解放眼球：


    $ curl localhost/upload
    upload
    $ curl localhost/start
    start
    $ curl localhost/
    /

##等效变幻

  数学上，有时候仅仅是改变下公式内元素的位置，就可以让解析或者证明变得更加容易。代码也是。我们把上面的m 映射改成：

  var m ={}
  m["/"] = function (){return "/"}
  m["/start"] = function (){return "/start"}
  m["/upload"] = function (){return "/upload"}

  表达的内容是等效的 。但是对于解析函数route会更加简单。

  function route(pathname){
    return m[pathname]
  }

目前我们什么都混在一起。也会继续混到一起：代码还不多，这样有利于把握整体。

## 服务器特定问题：阻塞

客户端总要考虑客户的使用友好，不要卡死，界面漂亮；而服务器需要处理的就是减少阻塞。

何为阻塞？

让代码慢下来，就可以看到阻塞。我们来让start（）睡一会，模拟下。

    function sleep(milliSeconds) {
      var startTime = new Date().getTime();
      while (new Date().getTime() < startTime + milliSeconds);
    }
    function start() {
      sleep(5000);
      return "/start";
    }


故伎重演。不过稍作变化。因为curl可以帮助统计运行时间，所以我们来利用下：
  
  curl  -w %{time_total}\\n localhost:8888/upload
  /upload 0.002

很快出结果，0.002，就是2毫秒。

  $ curl  -w %{time_total}\\n localhost:8888/start
  start 5.001

5毫秒。多一点。正如所愿。

一个一个的，很好。如果并发呢。

打开两个命令行窗口。

一个输入curl  -w %{time_total}\\n localhost:8888/upload，但是不执行
一个输入curl  -w %{time_total}\\n localhost:8888/start，但是不执行

然后，一二三，执行第二个，然后执行第一个。快点。

  $ curl  -w \\n%{time_total}\\n localhost:8888/start
  /start
  5.013


  $ curl  -w \\n%{time_total}\\n localhost:8888/upload
  /upload
  4.353


upload没有任何修改，本来执行很快，现在却慢到需要几乎5ms呢？

因为upload被start()阻塞了。start()的慢速，阻塞了其他的工作。

Node是单线程的。它通过事件轮询（event loop）来实现并行操作。如果轮询过来执行的代码时间长，就会无法处理后来的请求。因此，我们需要尽可能快的完成操作，以便返回控制权给node，让它可以抽身处理队列内等待的任务。


###POST 文本块到服务器

简单的用例：
1. 显示一个文本区（textarea）供用户输入内容，然后通过POST请求到服务器。
2. 服务器通过处理程序将输入的内容展示到浏览器中。

/start请求处理程序用于生成带文本区的表单，因此，我们将 app.js修改为如下形式：

  var http = require("http");
  var url = require("url");

  var m ={}
  m["/form"] = form
  m["/upload"] = upload
  m[404] = h404

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
  function h404(request, response){
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
  }
  function upload(request, response){
      request.setEncoding("utf8");
      var postData
      var count = 0 
      request.addListener("data", function(postDataChunk) {
        console.log("postDataChunk.length:",postDataChunk.length);
        postData += postDataChunk;
        count++      
      });
      request.addListener("end", function() {
        console.log(count);
      });
  }
  function form(request, response){
    var body = 
      '<form action="/upload" method="post">'+
      '<textarea name="text" rows="20" cols="60"></textarea>'+
      '<input type="submit" value="Submit text" />'
      
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(body);
      response.end();
  }



### 接受upload text

POST数据可能很大，为了使整个过程不会阻塞，Node会将POST数据拆分成小块。这也要求我们通过侦听触发事件，把它们重新拼接起来。我们需要：

1. 侦听data事件。表示新的小数据块到达了
2. 侦听end事件。所有的数据都已经接收完毕


如下所示：

      request.addListener("data", function(postDataChunk) {
        console.log("postDataChunk.length:",postDataChunk.length);       
        postData += postDataChunk;
        count++      
      });
      request.addListener("end", function() {
        console.log(count);          
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Received: " + postData);
        response.end();
      });

实验体会：尝试着去输入大段内容，就会发现data事件会触发多次。就是说，打印出来的count可能不是1,而每个postDataChunk.length也不尽相同。

###浏览器内容回显

我们在/upload页面，展示用户输入的内容。

      request.addListener("end", function() {
        console.log(count);          
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Received: " + postData);
        response.end();
      });


### 文件上传

最后，实现用例：
1. 允许用户上传图片
2. 并将该图片在浏览器中显示出来。

我们要用到的外部模块：node-formidable，用来处理文件上传。

完成模块安装：

  npm install formidable

用require语句引入：

var formidable = require("formidable");

该模块可以解析来自HTTP POST的表单:


  var formidable = require('formidable'),
      http = require('http'),
      util = require('util');

  http.createServer(function(req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {      
        res.end('received upload:\n',files.upload.path);
      });    
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" '+
      'method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  }).listen(8888);

在表单中添加一个文件上传元素。只需要在HTML表单中，添加一个multipart/form-data的编码类型。

formidable 会把此上传文件放到一个当前用户的临时目录内。并在files.upload.path 通知调用者具体位置:

  received upload:C:\Users\rita\AppData\Local\Temp\upload_b3fa645d2425bc9f768494573a09b8ce



###展现图片到浏览器(TODO : 代码有错)

我们来添加/show 请求处理程序，它硬编码显示刚刚传递的png到浏览器中。

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


重启服务器之后，通过访问http://localhost/show，就可以看到保存在刚刚上传的图片了

###wrapper up

恭喜，我们的半成品完成了。关于语言本身，需要理解的就是模块和Callback。作为服务器端脚本，概念就稍微多点点：阻塞与非阻塞，事件驱动，以及HTTP协议，文件Post上传，MIME类型。

一回生二回熟。至此，Node对我们而言，有些亲切了。

和路由相关的代码展示了作为服务器框架的一个重要构成的概念。对此有兴趣的话，可以继续研究express框架。

另外，代码也都堆积到一个文件，根本没有考虑重构，也没有考虑到模块划分。对于较大的程序来说，这当然会构成一个问题。我在(极简node模块开发)[note.md]探究此技术。

学无止境。学习node常常会有哦也的赞叹，这样的乐趣相伴左右。

###格外说明

本文是[nodebeginner](http://www.nodebeginner.org/)对应的中文版的阅读笔记。但是在实验代码的过程中，也顺手加入了些自己的一些文字与代码的风味：

-简洁：行文简化，代码也做了重构。并且表意也直接（总觉得别人啰嗦）。还忽略和模块等和主题不太相关的内容。
-也有些我的想法。比如curl替代browser做响应验证

经过这个工作，我更好的学习了原文，体会到node的精要之处。所以感谢nodebeginer作者的创造和译者的工作。

说说我和js的交往吧。

过去N年，我一直是一家企业的技术团队管理者，同时也是MS技术的开发者。我采用c#做b/s 企业应用。其中涉及到的javascript很少，有的话，基本也就是数据核对。或者玩点动画之类的动态内容。一直认为js很简单，故而也谈不上做稍微深入的研究。

然后ajax技术告诉我，这个看起来很小的玩意其实可以很强大。

接着，出现了Node，服务端的JavaScript，以及火热的NPM模块仓库。一起来的，还有不太熟悉的面孔，像是事件驱动的，非阻塞等等。

这几年社区明显的火起来。在github上算得上第一语言，即使MS也在为她做工具（Node tool,Visual studio code )，甚至创造了一门（再一个）可以编译到js的语言：TypeScript。

我(一路大跌眼镜)[http://1000copy.farbox.com/post/crossing-eye-s-hell]，一次次的修正自己的认识，于是我真心的想要花点气力研究，以便充分的从此语言中获益。

无论如何，js是现代编程的一个必选项。并且，用一样的语言可以同时完成前后端的代码，只是想想也会感到很棒。
