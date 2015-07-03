#node http server  development

也许，你已经高频多次听到了node。毕竟它真的很火。可是你还在犹豫，毕竟，学习一门语言以及库，是一个开坑和被坑的过程。也担心学习后不知道可以做点什么。那么现在完全可以行动了。我试图以此文，引导你做一个http server。

东西成了，学习也就成了。

##node 

说说我和js的交往吧。

一开始我做应用程序，无论怎样，都会写点javascript，比如数据核对，或者一些跑马灯之类的动态内容。然后ajax告诉我，熟悉的小玩意其实很强大。接着，出现了Node.js，服务端的JavaScript。一起来的，还有不太熟悉的面孔，像是事件驱动的，单线程模型等。用一样的语言，可以做前后端，只是想想也会感到很棒。


##安装

安装node，在windows/mac 上非常简单，就是一个安装包，然后一步步的走。Linux 上复杂点。不过这和我们的内容关系不大。可以看官方的安装指南。然后后在command line：

  $node -v
  v0.12.4

看到版本号？成功。版本号的话，偶数（偶数是稳定版，奇数是开发版）就好，大点就好。

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

Node上来就高端！用c#什么的，作为程序员，只能是IIS的用户。用户这个词，深深的伤害了我。

这就是User case:

-用户可以通过浏览器使用我们的应用
-用户请求http://domain/时，可以看到一个Apache Style的 It works ,加上一个upload Form
-用户可以上传图片
-可以显示所有上传图片http://domain/list



## 自顶向下，分而治之

我们来分解一下这个应用，为了实现上文的用例，我们需要实现哪些部分呢？

-提供html页面，-> 需要HTTP Server
-路由。不同的URL，会有不同的处理模块（function）。匹配两者的模块，就叫做路由。
-能处理POST数据，能够处理上传图片

用过PHP，Asp，JSP之类的大同小异的技术，都知道路由这样的工作，Server会处理。可是我们现在要做的就是Server，要自己实现了。


## Http Server


现在建立一个目录，好比是frodo. touch 一个 server.js的文件出来，输入：

    var http = require("http");
    http.createServer(function(request, response) {
      response.end("42");
    }).listen(8888);

    // visit http://localhost:8888

呃。完了？嗯。用node跑跑。

  node server.js

开一个浏览器（我爱chrome）访问http://localhost:8888/，看到 42 就成了。

## 从代码到人话

很多时候我们需要基于他人的工作。做http就应该引用http模块。它是node的内置模块。

我们可以先看以上代码的主线索,启动服务器，并侦听8888端口：

  var http = require("http");

  var server = http.createServer();
  server.listen(8888);


createServer。创建一个http server,侦听 8888端口。如果有请求到，就调用匿名函数：

    function(request, response) {
      response.end("42");
    }

在此函数内，调用response.end,把内容（42）发送给Browser，end函数本身会宣告内容传递完毕。

### 玩玩http

启动服务后
  node server.js

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

说明：再省点事儿，我侦听改为 80 ，这样browser不需要输入port。

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
    {path:"/",func:foo},
    {path:"/start",func:bar},
    {path:"/upload",func:baz}
  ]


首先，加入路由函数：

    var http = require("http");
    http.createServer(function(request, response) {
      var pathname = url.parse(request.url).pathname;
      route(pathname)(request,response);
      response.end("<b>it works</b><a href='/start'>start</a>");
    }).listen(80);
    function route(pathname){
      for(var i=0;i<m.length;i++)
        if (m.path == pathname)
          return m.func
      return null
    }
    function foo(request, response){console.log("foo")}
    function bar(request, response){console.log("bar")}
    function baz(request, response){console.log("baz")}


我们先将这个对象引入到主文件index.js中：

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
虽然handle并不仅仅是一个“东西”（一些请求处理程序的集合），我还是建议以一个动词作为其命名，这样做可以让我们在路由中使用更流畅的表达式，稍后会有说明。

正如所见，将不同的URL映射到相同的请求处理程序上是很容易的：只要在对象中添加一个键为"/"的属性，对应requestHandlers.start即可，这样我们就可以干净简洁地配置/start和/的请求都交由start这一处理程序处理。

在完成了对象的定义后，我们把它作为额外的参数传递给服务器，为此将server.js修改如下：

var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(handle, pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
这样我们就在start()函数里添加了handle参数，并且把handle对象作为第一个参数传递给了route()回调函数。

然后我们相应地在route.js文件中修改route()函数：

function route(handle, pathname) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname]();
  } else {
    console.log("No request handler found for " + pathname);
  }
}

exports.route = route;
通过以上代码，我们首先检查给定的路径对应的请求处理程序是否存在，如果存在的话直接调用相应的函数。我们可以用从关联数组中获取元素一样的方式从传递的对象中获取请求处理函数，因此就有了简洁流畅的形如handle[pathname]();的表达式，这个感觉就像在前方中提到的那样：“嗨，请帮我处理了这个路径”。

有了这些，我们就把服务器、路由和请求处理程序在一起了。现在我们启动应用程序并在浏览器中访问http://localhost:8888/start，以下日志可以说明系统调用了正确的请求处理程序：

Server has started.
Request for /start received.
About to route a request for /start
Request handler 'start' was called.
并且在浏览器中打开http://localhost:8888/可以看到这个请求同样被start请求处理程序处理了：

Request for / received.
About to route a request for /
Request handler 'start' was called.
让请求处理程序作出响应

很好。不过现在要是请求处理程序能够向浏览器返回一些有意义的信息而并非全是“Hello World”，那就更好了。

这里要记住的是，浏览器发出请求后获得并显示的“Hello World”信息仍是来自于我们server.js文件中的onRequest函数。

其实“处理请求”说白了就是“对请求作出响应”，因此，我们需要让请求处理程序能够像onRequest函数那样可以和浏览器进行“对话”。

不好的实现方式

对于我们这样拥有PHP或者Ruby技术背景的开发者来说，最直截了当的实现方式事实上并不是非常靠谱： 看似有效，实则未必如此。

这里我指的“直截了当的实现方式”意思是：让请求处理程序通过onRequest函数直接返回（return()）他们要展示给用户的信息。

我们先就这样去实现，然后再来看为什么这不是一种很好的实现方式。

让我们从让请求处理程序返回需要在浏览器中显示的信息开始。我们需要将requestHandler.js修改为如下形式：

function start() {
  console.log("Request handler 'start' was called.");
  return "Hello Start";
}

function upload() {
  console.log("Request handler 'upload' was called.");
  return "Hello Upload";
}

exports.start = start;
exports.upload = upload;
好的。同样的，请求路由需要将请求处理程序返回给它的信息返回给服务器。因此，我们需要将router.js修改为如下形式：

function route(handle, pathname) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    return handle[pathname]();
  } else {
    console.log("No request handler found for " + pathname);
    return "404 Not found";
  }
}

exports.route = route;
正如上述代码所示，当请求无法路由的时候，我们也返回了一些相关的错误信息。

最后，我们需要对我们的server.js进行重构以使得它能够将请求处理程序通过请求路由返回的内容响应给浏览器，如下所示：

var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    response.writeHead(200, {"Content-Type": "text/plain"});
    var content = route(handle, pathname)
    response.write(content);
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
如果我们运行重构后的应用，一切都会工作的很好：请求http://localhost:8888/start,浏览器会输出“Hello Start”，请求http://localhost:8888/upload会输出“Hello Upload”,而请求http://localhost:8888/foo 会输出“404 Not found”。

好，那么问题在哪里呢？简单的说就是： 当未来有请求处理程序需要进行非阻塞的操作的时候，我们的应用就“挂”了。

没理解？没关系，下面就来详细解释下。

阻塞与非阻塞

正如此前所提到的，当在请求处理程序中包括非阻塞操作时就会出问题。但是，在说这之前，我们先来看看什么是阻塞操作。

我不想去解释“阻塞”和“非阻塞”的具体含义，我们直接来看，当在请求处理程序中加入阻塞操作时会发生什么。

这里，我们来修改下start请求处理程序，我们让它等待10秒以后再返回“Hello Start”。因为，JavaScript中没有类似sleep()这样的操作，所以这里只能够来点小Hack来模拟实现。

让我们将requestHandlers.js修改成如下形式：

function start() {
  console.log("Request handler 'start' was called.");

  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  sleep(10000);
  return "Hello Start";
}

function upload() {
  console.log("Request handler 'upload' was called.");
  return "Hello Upload";
}

exports.start = start;
exports.upload = upload;
上述代码中，当函数start()被调用的时候，Node.js会先等待10秒，之后才会返回“Hello Start”。当调用upload()的时候，会和此前一样立即返回。

（当然了，这里只是模拟休眠10秒，实际场景中，这样的阻塞操作有很多，比方说一些长时间的计算操作等。）

接下来就让我们来看看，我们的改动带来了哪些变化。

如往常一样，我们先要重启下服务器。为了看到效果，我们要进行一些相对复杂的操作（跟着我一起做）： 首先，打开两个浏览器窗口或者标签页。在第一个浏览器窗口的地址栏中输入http://localhost:8888/start， 但是先不要打开它！

在第二个浏览器窗口的地址栏中输入http://localhost:8888/upload， 同样的，先不要打开它！

接下来，做如下操作：在第一个窗口中（“/start”）按下回车，然后快速切换到第二个窗口中（“/upload”）按下回车。

注意，发生了什么： /start URL加载花了10秒，这和我们预期的一样。但是，/upload URL居然也花了10秒，而它在对应的请求处理程序中并没有类似于sleep()这样的操作！

这到底是为什么呢？原因就是start()包含了阻塞操作。形象的说就是“它阻塞了所有其他的处理工作”。

这显然是个问题，因为Node一向是这样来标榜自己的：“在node中除了代码，所有一切都是并行执行的”。

这句话的意思是说，Node.js可以在不新增额外线程的情况下，依然可以对任务进行并行处理 —— Node.js是单线程的。它通过事件轮询（event loop）来实现并行操作，对此，我们应该要充分利用这一点 —— 尽可能的避免阻塞操作，取而代之，多使用非阻塞操作。

然而，要用非阻塞操作，我们需要使用回调，通过将函数作为参数传递给其他需要花时间做处理的函数（比方说，休眠10秒，或者查询数据库，又或者是进行大量的计算）。

对于Node.js来说，它是这样处理的：“嘿，probablyExpensiveFunction()（译者注：这里指的就是需要花时间处理的函数），你继续处理你的事情，我（Node.js线程）先不等你了，我继续去处理你后面的代码，请你提供一个callbackFunction()，等你处理完之后我会去调用该回调函数的，谢谢！”

（如果想要了解更多关于事件轮询细节，可以阅读Mixu的博文——理解node.js的事件轮询。）

接下来，我们会介绍一种错误的使用非阻塞操作的方式。

和上次一样，我们通过修改我们的应用来暴露问题。

这次我们还是拿start请求处理程序来“开刀”。将其修改成如下形式：

var exec = require("child_process").exec;

function start() {
  console.log("Request handler 'start' was called.");
  var content = "empty";

  exec("ls -lah", function (error, stdout, stderr) {
    content = stdout;
  });

  return content;
}

function upload() {
  console.log("Request handler 'upload' was called.");
  return "Hello Upload";
}

exports.start = start;
exports.upload = upload;
上述代码中，我们引入了一个新的Node.js模块，child_process。之所以用它，是为了实现一个既简单又实用的非阻塞操作：exec()。

exec()做了什么呢？它从Node.js来执行一个shell命令。在上述例子中，我们用它来获取当前目录下所有的文件（“ls -lah”）,然后，当/startURL请求的时候将文件信息输出到浏览器中。

上述代码是非常直观的： 创建了一个新的变量content（初始值为“empty”），执行“ls -lah”命令，将结果赋值给content，最后将content返回。

和往常一样，我们启动服务器，然后访问“http://localhost:8888/start” 。

之后会载入一个漂亮的web页面，其内容为“empty”。怎么回事？

这个时候，你可能大致已经猜到了，exec()在非阻塞这块发挥了神奇的功效。它其实是个很好的东西，有了它，我们可以执行非常耗时的shell操作而无需迫使我们的应用停下来等待该操作。

（如果想要证明这一点，可以将“ls -lah”换成比如“find /”这样更耗时的操作来效果）。

然而，针对浏览器显示的结果来看，我们并不满意我们的非阻塞操作，对吧？

好，接下来，我们来修正这个问题。在这过程中，让我们先来看看为什么当前的这种方式不起作用。

问题就在于，为了进行非阻塞工作，exec()使用了回调函数。

在我们的例子中，该回调函数就是作为第二个参数传递给exec()的匿名函数：

function (error, stdout, stderr) {
  content = stdout;
}
现在就到了问题根源所在了：我们的代码是同步执行的，这就意味着在调用exec()之后，Node.js会立即执行 return content ；在这个时候，content仍然是“empty”，因为传递给exec()的回调函数还未执行到——因为exec()的操作是异步的。

我们这里“ls -lah”的操作其实是非常快的（除非当前目录下有上百万个文件）。这也是为什么回调函数也会很快的执行到 —— 不过，不管怎么说它还是异步的。

为了让效果更加明显，我们想象一个更耗时的命令： “find /”，它在我机器上需要执行1分钟左右的时间，然而，尽管在请求处理程序中，我把“ls -lah”换成“find /”，当打开/start URL的时候，依然能够立即获得HTTP响应 —— 很明显，当exec()在后台执行的时候，Node.js自身会继续执行后面的代码。并且我们这里假设传递给exec()的回调函数，只会在“find /”命令执行完成之后才会被调用。

那究竟我们要如何才能实现将当前目录下的文件列表显示给用户呢？

好，了解了这种不好的实现方式之后，我们接下来来介绍如何以正确的方式让请求处理程序对浏览器请求作出响应。

以非阻塞操作进行请求响应

我刚刚提到了这样一个短语 —— “正确的方式”。而事实上通常“正确的方式”一般都不简单。

不过，用Node.js就有这样一种实现方案： 函数传递。下面就让我们来具体看看如何实现。

到目前为止，我们的应用已经可以通过应用各层之间传递值的方式（请求处理程序 -> 请求路由 -> 服务器）将请求处理程序返回的内容（请求处理程序最终要显示给用户的内容）传递给HTTP服务器。

现在我们采用如下这种新的实现方式：相对采用将内容传递给服务器的方式，我们这次采用将服务器“传递”给内容的方式。 从实践角度来说，就是将response对象（从服务器的回调函数onRequest()获取）通过请求路由传递给请求处理程序。 随后，处理程序就可以采用该对象上的函数来对请求作出响应。

原理就是如此，接下来让我们来一步步实现这种方案。

先从server.js开始：

var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(handle, pathname, response);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
相对此前从route()函数获取返回值的做法，这次我们将response对象作为第三个参数传递给route()函数，并且，我们将onRequest()处理程序中所有有关response的函数调都移除，因为我们希望这部分工作让route()函数来完成。

下面就来看看我们的router.js:

function route(handle, pathname, response) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
同样的模式：相对此前从请求处理程序中获取返回值，这次取而代之的是直接传递response对象。

如果没有对应的请求处理器处理，我们就直接返回“404”错误。

最后，我们将requestHandler.js修改为如下形式：

var exec = require("child_process").exec;

function start(response) {
  console.log("Request handler 'start' was called.");

  exec("ls -lah", function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(stdout);
    response.end();
  });
}

function upload(response) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello Upload");
  response.end();
}

exports.start = start;
exports.upload = upload;
我们的处理程序函数需要接收response参数，为了对请求作出直接的响应。

start处理程序在exec()的匿名回调函数中做请求响应的操作，而upload处理程序仍然是简单的回复“Hello World”，只是这次是使用response对象而已。

这时再次我们启动应用（node index.js），一切都会工作的很好。

如果想要证明/start处理程序中耗时的操作不会阻塞对/upload请求作出立即响应的话，可以将requestHandlers.js修改为如下形式：

var exec = require("child_process").exec;

function start(response) {
  console.log("Request handler 'start' was called.");

  exec("find /",
    { timeout: 10000, maxBuffer: 20000*1024 },
    function (error, stdout, stderr) {
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.write(stdout);
      response.end();
    });
}

function upload(response) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello Upload");
  response.end();
}

exports.start = start;
exports.upload = upload;
这样一来，当请求http://localhost:8888/start的时候，会花10秒钟的时间才载入，而当请求http://localhost:8888/upload的时候，会立即响应，纵然这个时候/start响应还在处理中。

更有用的场景

到目前为止，我们做的已经很好了，但是，我们的应用没有实际用途。

服务器，请求路由以及请求处理程序都已经完成了，下面让我们按照此前的用例给网站添加交互：用户选择一个文件，上传该文件，然后在浏览器中看到上传的文件。 为了保持简单，我们假设用户只会上传图片，然后我们应用将该图片显示到浏览器中。

好，下面就一步步来实现，鉴于此前已经对JavaScript原理性技术性的内容做过大量介绍了，这次我们加快点速度。

要实现该功能，分为如下两步： 首先，让我们来看看如何处理POST请求（非文件上传），之后，我们使用Node.js的一个用于文件上传的外部模块。之所以采用这种实现方式有两个理由。

第一，尽管在Node.js中处理基础的POST请求相对比较简单，但在这过程中还是能学到很多。 
第二，用Node.js来处理文件上传（multipart POST请求）是比较复杂的，它不在本书的范畴，但，如何使用外部模块却是在本书涉猎内容之内。

处理POST请求

考虑这样一个简单的例子：我们显示一个文本区（textarea）供用户输入内容，然后通过POST请求提交给服务器。最后，服务器接受到请求，通过处理程序将输入的内容展示到浏览器中。

/start请求处理程序用于生成带文本区的表单，因此，我们将requestHandlers.js修改为如下形式：

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello Upload");
  response.end();
}

exports.start = start;
exports.upload = upload;
好了，现在我们的应用已经很完善了，都可以获得威比奖（Webby Awards）了，哈哈。（译者注：威比奖是由国际数字艺术与科学学院主办的评选全球最佳网站的奖项，具体参见详细说明）通过在浏览器中访问http://localhost:8888/start就可以看到简单的表单了，要记得重启服务器哦！

你可能会说：这种直接将视觉元素放在请求处理程序中的方式太丑陋了。说的没错，但是，我并不想在本书中介绍诸如MVC之类的模式，因为这对于你了解JavaScript或者Node.js环境来说没多大关系。

余下的篇幅，我们来探讨一个更有趣的问题： 当用户提交表单时，触发/upload请求处理程序处理POST请求的问题。

现在，我们已经是新手中的专家了，很自然会想到采用异步回调来实现非阻塞地处理POST请求的数据。

这里采用非阻塞方式处理是明智的，因为POST请求一般都比较“重” —— 用户可能会输入大量的内容。用阻塞的方式处理大数据量的请求必然会导致用户操作的阻塞。

为了使整个过程非阻塞，Node.js会将POST数据拆分成很多小的数据块，然后通过触发特定的事件，将这些小数据块传递给回调函数。这里的特定的事件有data事件（表示新的小数据块到达了）以及end事件（表示所有的数据都已经接收完毕）。

我们需要告诉Node.js当这些事件触发的时候，回调哪些函数。怎么告诉呢？ 我们通过在request对象上注册监听器（listener） 来实现。这里的request对象是每次接收到HTTP请求时候，都会把该对象传递给onRequest回调函数。

如下所示：

request.addListener("data", function(chunk) {
  // called when a new chunk of data was received
});

request.addListener("end", function() {
  // called when all chunks of data have been received
});
问题来了，这部分逻辑写在哪里呢？ 我们现在只是在服务器中获取到了request对象 —— 我们并没有像之前response对象那样，把 request 对象传递给请求路由和请求处理程序。

在我看来，获取所有来自请求的数据，然后将这些数据给应用层处理，应该是HTTP服务器要做的事情。因此，我建议，我们直接在服务器中处理POST数据，然后将最终的数据传递给请求路由和请求处理器，让他们来进行进一步的处理。

因此，实现思路就是： 将data和end事件的回调函数直接放在服务器中，在data事件回调中收集所有的POST数据，当接收到所有数据，触发end事件后，其回调函数调用请求路由，并将数据传递给它，然后，请求路由再将该数据传递给请求处理程序。

还等什么，马上来实现。先从server.js开始：

var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '"+
      postDataChunk + "'.");
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });

  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
上述代码做了三件事情： 首先，我们设置了接收数据的编码格式为UTF-8，然后注册了“data”事件的监听器，用于收集每次接收到的新数据块，并将其赋值给postData 变量，最后，我们将请求路由的调用移到end事件处理程序中，以确保它只会当所有数据接收完毕后才触发，并且只触发一次。我们同时还把POST数据传递给请求路由，因为这些数据，请求处理程序会用到。

上述代码在每个数据块到达的时候输出了日志，这对于最终生产环境来说，是很不好的（数据量可能会很大，还记得吧？），但是，在开发阶段是很有用的，有助于让我们看到发生了什么。

我建议可以尝试下，尝试着去输入一小段文本，以及大段内容，当大段内容的时候，就会发现data事件会触发多次。

再来点酷的。我们接下来在/upload页面，展示用户输入的内容。要实现该功能，我们需要将postData传递给请求处理程序，修改router.js为如下形式：

function route(handle, pathname, response, postData) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
然后，在requestHandlers.js中，我们将数据包含在对upload请求的响应中：

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent: " + postData);
  response.end();
}

exports.start = start;
exports.upload = upload;
好了，我们现在可以接收POST数据并在请求处理程序中处理该数据了。

我们最后要做的是： 当前我们是把请求的整个消息体传递给了请求路由和请求处理程序。我们应该只把POST数据中，我们感兴趣的部分传递给请求路由和请求处理程序。在我们这个例子中，我们感兴趣的其实只是text字段。

我们可以使用此前介绍过的querystring模块来实现：

var querystring = require("querystring");

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent the text: "+
  querystring.parse(postData).text);
  response.end();
}

exports.start = start;
exports.upload = upload;
好了，以上就是关于处理POST数据的全部内容。

处理文件上传

最后，我们来实现我们最终的用例：允许用户上传图片，并将该图片在浏览器中显示出来。

回到90年代，这个用例完全可以满足用于IPO的商业模型了，如今，我们通过它能学到这样两件事情： 如何安装外部Node.js模块，以及如何将它们应用到我们的应用中。

这里我们要用到的外部模块是Felix Geisendörfer开发的node-formidable模块。它对解析上传的文件数据做了很好的抽象。 其实说白了，处理文件上传“就是”处理POST数据 —— 但是，麻烦的是在具体的处理细节，所以，这里采用现成的方案更合适点。

使用该模块，首先需要安装该模块。Node.js有它自己的包管理器，叫NPM。它可以让安装Node.js的外部模块变得非常方便。通过如下一条命令就可以完成该模块的安装：

npm install formidable
如果终端输出如下内容：

npm info build Success: formidable@1.0.9
npm ok
就说明模块已经安装成功了。

现在我们就可以用formidable模块了——使用外部模块与内部模块类似，用require语句将其引入即可：

var formidable = require("formidable");
这里该模块做的就是将通过HTTP POST请求提交的表单，在Node.js中可以被解析。我们要做的就是创建一个新的IncomingForm，它是对提交表单的抽象表示，之后，就可以用它解析request对象，获取表单中需要的数据字段。

node-formidable官方的例子展示了这两部分是如何融合在一起工作的：

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });
    return;
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
如果我们将上述代码，保存到一个文件中，并通过node来执行，就可以进行简单的表单提交了，包括文件上传。然后，可以看到通过调用form.parse传递给回调函数的files对象的内容，如下所示：

received upload:

{ fields: { title: 'Hello World' },
  files:
   { upload:
      { size: 1558,
        path: '/tmp/1c747974a27a6292743669e91f29350b',
        name: 'us-flag.png',
        type: 'image/png',
        lastModifiedDate: Tue, 21 Jun 2011 07:02:41 GMT,
        _writeStream: [Object],
        length: [Getter],
        filename: [Getter],
        mime: [Getter] } } }
为了实现我们的功能，我们需要将上述代码应用到我们的应用中，另外，我们还要考虑如何将上传文件的内容（保存在/tmp目录中）显示到浏览器中。

我们先来解决后面那个问题： 对于保存在本地硬盘中的文件，如何才能在浏览器中看到呢？

显然，我们需要将该文件读取到我们的服务器中，使用一个叫fs的模块。

我们来添加/showURL的请求处理程序，该处理程序直接硬编码将文件/tmp/test.png内容展示到浏览器中。当然了，首先需要将该图片保存到这个位置才行。

将requestHandlers.js修改为如下形式：

var querystring = require("querystring"),
    fs = require("fs");

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent the text: "+
  querystring.parse(postData).text);
  response.end();
}

function show(response, postData) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
我们还需要将这新的请求处理程序，添加到index.js中的路由映射表中：

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);
重启服务器之后，通过访问http://localhost:8888/show，就可以看到保存在/tmp/test.png的图片了。

好，最后我们要的就是：

在/start表单中添加一个文件上传元素
将node-formidable整合到我们的upload请求处理程序中，用于将上传的图片保存到/tmp/test.png
将上传的图片内嵌到/uploadURL输出的HTML中
第一项很简单。只需要在HTML表单中，添加一个multipart/form-data的编码类型，移除此前的文本区，添加一个文件上传组件，并将提交按钮的文案改为“Upload file”即可。 如下requestHandler.js所示：

var querystring = require("querystring"),
    fs = require("fs");

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent the text: "+
  querystring.parse(postData).text);
  response.end();
}

function show(response, postData) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
很好。下一步相对比较复杂。这里有这样一个问题： 我们需要在upload处理程序中对上传的文件进行处理，这样的话，我们就需要将request对象传递给node-formidable的form.parse函数。

但是，我们有的只是response对象和postData数组。看样子，我们只能不得不将request对象从服务器开始一路通过请求路由，再传递给请求处理程序。 或许还有更好的方案，但是，不管怎么说，目前这样做可以满足我们的需求。

到这里，我们可以将postData从服务器以及请求处理程序中移除了 —— 一方面，对于我们处理文件上传来说已经不需要了，另外一方面，它甚至可能会引发这样一个问题： 我们已经“消耗”了request对象中的数据，这意味着，对于form.parse来说，当它想要获取数据的时候就什么也获取不到了。（因为Node.js不会对数据做缓存）

我们从server.js开始 —— 移除对postData的处理以及request.setEncoding （这部分node-formidable自身会处理），转而采用将request对象传递给请求路由的方式：

var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
接下来是 router.js —— 我们不再需要传递postData了，这次要传递request对象：

function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
现在，request对象就可以在我们的upload请求处理程序中使用了。node-formidable会处理将上传的文件保存到本地/tmp目录中，而我们需要做的是确保该文件保存成/tmp/test.png。 没错，我们保持简单，并假设只允许上传PNG图片。

这里采用fs.renameSync(path1,path2)来实现。要注意的是，正如其名，该方法是同步执行的， 也就是说，如果该重命名的操作很耗时的话会阻塞。 这块我们先不考虑。

接下来，我们把处理文件上传以及重命名的操作放到一起，如下requestHandlers.js所示：

var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");
    fs.renameSync(files.upload.path, "/tmp/test.png");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
好了，重启服务器，我们应用所有的功能就可以用了。选择一张本地图片，将其上传到服务器，然后浏览器就会显示该图片。

总结与展望

恭喜，我们的任务已经完成了！我们开发完了一个Node.js的web应用，应用虽小，但却“五脏俱全”。 期间，我们介绍了很多技术点：服务端JavaScript、函数式编程、阻塞与非阻塞、回调、事件、内部和外部模块等等。

当然了，还有许多本书没有介绍到的： 如何操作数据库、如何进行单元测试、如何开发Node.js的外部模块以及一些简单的诸如如何获取GET请求之类的方法。

但本书毕竟只是一本给初学者的教程 —— 不可能覆盖到所有的内容。

幸运的是，Node.js社区非常活跃（作个不恰当的比喻就是犹如一群有多动症小孩子在一起，能不活跃吗？）， 这意味着，有许多关于Node.js的资源，有什么问题都可以向社区寻求解答。 其中Node.js社区的wiki以及 NodeCloud就是最好的资源。