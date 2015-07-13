这篇文章来自stackoverflow的问答。虽然不是最高票回复，但是我个人比较认同此做法。因此翻译出来共享。

###首先，学习node的核心概念

1. 理解node鼓励的异步代码风格

    Understanding the node.js event loop - 
    http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/

2. Node 使用CommonJS风格的require()模块加载方案，这和你习惯的方案可能有点不同。

###熟悉NPM 

这样，你可以去看看社区提供什么： 金牌标准的包管理npm，一个命令行工具，可以管理你的项目依赖关系，确保你了解npm和node如何和你的项目、node_module目录、package.json 做交互，npm同时也是一个包注册仓库

### 针对不同的任务，需要了解流行的包和工具

Underscore  内置了每一个你需要的工具方法，Lo-Dash是一个Underscore的克隆，目标是更快更好定制，还有很少几个Underscore没有的方法。某些版本可以做为Underscore的替换。

CoffeeScript 可以让JS变得容易忍耐一点（JS很臭吗？），同时让你离麻烦的事儿远点。警告：社区内一大票人对此是头疼的，要是写库的话，你应该考虑普通的JS，以便从更大的协作中获益。

JSHint 一个代码检查工具，让你可以从查找二逼错误中脱离出来，建议找一个文本编辑器插件，自动运行它。

###单元测试

Mocha是比较流行的框架
Vows对异步测试简直拿手的很。尽管有些陈旧
Expresso 一个更加传统的单元测试框架
node-unit 另外一个相对传统的单元测试框架

### Web Frameworks:

Express.js 到目前为止最流行

Koa 是一个新的框架，有express团队设计，目标是小一点，更强表达能力，更健壮的Web app基础框架和api。

sails.js 基于express，最流行的MVC框架。被设计来仿真熟悉的MVC模式，就像ROR(Ruby on rails)，但是支持现代app需求：可伸缩的数据api，面向服务的架构

Meteor 整合了jQuery,Handlebars,Node.js,WebSocket, MongoDB, and DDP ,在不成为ROR的克隆的基础上，提升了“惯例优于配置”的范式。

Tower (过时了) ：在express.js 基础上的抽象，目标是成为ROR的克隆。

Geddy 另外一个Web框架尝试

RailwayJS 是一个ROR激发的MVC框架（那个MVC不是ROR激发的呢？）

Sleek.js 基于Express.js。一个简单的web 框架.

Hapi 以配置为中心的框架，内建输入验证，缓存，认证的支持

Danf 一个全占（栈）的OOP框架，提供很多特征，以便可以生成一个可伸缩的，可维护的，可测试的，性能优化的应用，允许客户端和服务端代码以同一模式开发。

Loopback.io 强大的一个Node.js框架，用来创建API，易于链接到后端的数据源，有Angular.js SDK ，也提供iOS 、 Android的SDK

###  框架工具:

Jade 一个HAML工具包
EJS 更传统的模板语言，别忘了Underscore的模板方法
Connect 一个node.js世界的 WSGI
Request 很流行的HTTP请求库
socket.io 拿来构建WebSocket 服务器是很趁手的.
Optimist 玩一样的解析参数
Commander 另一个比较流行的参数解析器
Colors 让命令行输出带颜色，更好看

javascript - How do I get started with Node.js - Stack Overflow - http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js?rq=1