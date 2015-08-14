#simplest html flex layout

验证的目的，做了一个用于shell.js Browser End 的布局，一个命令条内有命令输入和Run按钮，加上一个命令结果显示的textarea。

完美的体现了行布局，列布局，居中，占比或者充满，对齐的布局效果。另外还有些额外的效果，包括只读，占位文字,填补（搞大按钮）等。


    <div style="display: flex; flex-direction: column;width:70%;margin: auto;">
      <span>
          Directory Runner:{pwd}
      </span>
      <div style="display: flex; flex-direction: row;justify-content: flex-end;">
         <input type="text" placeholder="command here..." style="padding: 10px;width:90%">
         <input type="button" value="run" style="width:10%">   
      </div>
      <div style="display: flex;justify-content: flex-end;">
            <textarea style="width: 100%;height:90%" placeholder="Ready" readonly="true"> </textarea>
      </div>
    </div>
    


对了，当前曾经短暂的研究过html的盒子布局，还有float，absolute 等。觉得对UI好生无奈。
对html的布局从绝望，到重新充满信心。
    
    
# mock database for js 

不必安装redis，mongodb，仅仅js就可以试验它们的功能。

- mongodb like emebed nosql 
sergeyksv/tingodb - https://github.com/sergeyksv/tingodb
###mindb redis db in js
iwillwen.u.qiniudn.com/slides/MinDB.pdf - http://iwillwen.u.qiniudn.com/slides/MinDB.pdf  


#编译node on Windows

##必须有py 2.7,不支持3.x
##vcbuild.bat 执行。然后就生成了。加vcbuild.bat nosign 就不会在尾部报签名的错误。
##点击生成的Node.vcproj 启动生成
.....Platforms\Win32\Microsoft.Cpp.Win32.Targets(511,5): error MSB8008: 指定的平台工具集(v110)未安装或无效。请确保选择受支持的 PlatformToolset 值。


之前是用VS2012打开过的，所以你用VS2010打不开了，解决办法是：右键点击你的项目，选择属性，再点击配置属性中的常规，常规中有个平台工作集，把V110改成V100，点击应用即可


# understanding freeList 

it's very simple way to manage reuse of often created and destroyed objects. The freelist only creates new objects when no currently unused objects are available, reducing memory footprint without having to wait for garbage collection, etc. Using it involves three simple steps:


node.js - Understanding freelist - Stack Overflow - http://stackoverflow.com/questions/13617752/understanding-freelist


# node http function debuglog

enable debug mode of module 

    util.debuglog("http", "someinfo",obj)
    
想要让someinfo可以打印出来以便于调试，需要首先激活模块，在环境变量内

    set NODE_DEBUG=http



# 一种对象创建方法

function Foo() {
  if (!(this instanceof Foo)) return new Foo()
  this.bar = 1 
}

console.log(new Foo().bar)
console.log(Foo().bar)

无论直接Foo（），还是new Foo() 都是可以创建对象的。效果一样。


#Running scripts with npm - Jayway - http://www.jayway.com/2014/03/28/running-scripts-with-npm/

funny  ! npm test 参考 package.json - 

    {
      "name": "frodo",
      "version": "1.0.0",
      "scripts": {
        "start": "node server.js",
        "test": "node test_index.js"
      }
    }
    
npm test 会引发 script/test 的执行。
npm start 会引发 script/start 的执行。 
so
npm hello ? 这样可不行。

    {
      "name": "frodo",
      "version": "1.0.0",
      "scripts": {
        "hello": "echo hello",
      }
    }



# nodemon 让Edit - Run 可以再精简

  1. nodemon app.js
     监视当前工作目录，有变化，就重启
  2. 永远都在app.js 写代码。写测试。
  3. 通过后，搬移到实际的单元内和test文件内
  Loop....

## 曾经...

  1. node fm.js ,一个自动化脚本
     监视当前工作目录，已有变化，就执行npm test (如果前一个npm test没有退出--比如服务器类的，就kill）
  2. package.json - scripts - test 设置为 node test\index.js
  3. 永远都在test\index.js 写代码，写测试。通过的代码搬移到实际的单元内和test文件内
  Loop....

# windows 不阻塞的命令行

每次启动一个node的服务器app，就会挂起整个console。如果要继续输入新的命令，必须重开一个console。可是麻烦 ！但是 start /b node server.js 就可不必如此了。因为/b 会让命令在后台运行。
如果是*nix的话，就更容易了。

# 快速找到事件的案发现场

当看到事件处理的时候，比如on('event1',function ....) ,常常需要了解在何处emit的这个事件。

代码多了点时候，这样的一点点的找真的可以说是非常转狂的。我就这样在node-http2阅读中常常处于转狂状态。比如这里的代码，三连环的事件嵌套，一个个的去找emit点，痛苦。

    describe('5serverpush', function() {
        it('push concerned only', function(done) {
          var path = '/x';
          var message = 'server response';
          var pushedPath = '/y';
          var pushedMessage = 'promise 1';        
          var server = http2.createServer(options, function(request, response) {
            expect(request.url).to.equal(path);
            var push1 = response.push('/y');
            push1.end(pushedMessage);
            response.end(message);
          });
          server.listen(1235, function() {          
            var request = http2.get('https://localhost:1235' + path);
            expect(request.constructor.name).to.equal("OutgoingRequest")
            // done = util.callNTimes(2, done);        
            request.on('push', function(promise) {
              // console.trace();
              promise.cancel();
              promise.on('response', function(pushStream) {
                expect(1).to.equal(0)// 不应该到这里
                pushStream.on('data', function(data) {
                  expect(1).to.equal(0)// 不应该到这里
                });
                pushStream.on('end', done);
              });
              done();
            });
          });
        });
      });
办法是有的。
1. 动态的办法，就是使用console.trace().      
2. 还有比较重量级的办法，就是使用debuger来查看callstack

# 在VS code 内加入mocha执行项目的断点

Is it possible to add breakpoints to ones Mocha tests using Visual Studio Code?

Another way is to use the --debug-brk command line option of mocha and the default Attach launch setting of the Visual Studio Code debugger.

Suggested deeper explanation (from André)

To do this:

Run mocha from the command line using this command:

mocha --debug-brk
Now in VS Code click on the Debug icon, then select Attach from the option next to the start button. Add breakpoints in VS Code and then click start.

	
This way is much easier, there's virtually no configuration –  André Vermeulen May 16 at 11:49
  	 	
Yes, but it's a bit more than just pressing f5.. –  Wolfgang Kluge May 16 at 12:30
  	 	
I might've found a solution here. –  GPX May 18 at 11:33

# 在做项目调试的时候，知道函数的构造器是非常有价值的

伴随着事件编程代码阅读的同时，还需要知道emit的参数类型，比如


       var request = http2.get('https://localhost:1235' + path);
       request.on('push', function(promise) {。。。。
       
这里的promise类型到底是什么？这对于理解代码是非常重要的。

       console.log(promise.constructor.name)

一个代码

    function Foo(){}
    var a = new Foo;
想要知道a是Foo的实例，如何做？

开始以为是typeof。错。typeof(a)=='object'

然后以为是Instanceof 。错。因为instanceof(a) =='function'

实际上是，a.constructor.name =='Foo'

妈蛋。


#sublime快速找到函数实现

原来查找fuction xxx，都说ctrld+xxx，然后找，费劲。现在直接查找function xxx 好的多了。Editor使用心得 [doge]

了解对象内到底有哪些属性？

       console.log(util.inspect(promiseHeaders,false,0))
      
            
# 大文件解压验证

unzip -t 1.zip 可以测试而不解压一个文件
	...
    No errors detected in compressed data of 1.zip.

我的一个备份10G，无空间释放了，用这个就可以验证。几乎不需要什么 disk free space 就可以。


#node http做大文件传递

10G大文件，一般用feiq来做局域网传递。
可是，对方人不在。于是我想要搭建一个服务器，给他发一个链接，然后我就可以逍遥了。



###这段时间一直弄node
,第一时间想到的就是搞个node 的server。

弄了下 node-http-server 提供一个10G文件的下载，内存狂涨，速度极慢

    C:\Users\lcj\AppData\Roaming\npm\hs -> C:\Users\lcj\AppData\Roaming\npm\node_modules\http-server\bin\http-server
    http-server@0.8.0 C:\Users\lcj\AppData\Roaming\npm\node_modules\http-server
    ├── opener@1.4.1
    ├── corser@2.0.0
    ├── colors@1.0.3
    ├── http-proxy@1.11.1 (eventemitter3@1.1.1, requires-port@0.0.1)
    ├── optimist@0.6.1 (wordwrap@0.0.3, minimist@0.0.10)
    ├── ecstatic@0.7.6 (url-join@0.0.1, mime@1.3.4, minimist@1.1.1, he@0.5.0)
    ├── portfinder@0.4.0 (async@0.9.0, mkdirp@0.5.1)
    └── union@0.4.4 (qs@2.3.3)
   ，然后，累死 OOM 
    C:\codebackup\passed
    λ http-server
    Starting up http-server, serving ./ on: http://0.0.0.0:8080
    Hit CTRL-C to stop the server
    [Wed, 08 Jul 2015 01:56:51 GMT] "GET /" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    [Wed, 08 Jul 2015 01:56:52 GMT] "GET /favicon.ico" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    [Wed, 08 Jul 2015 01:56:52 GMT] "GET /favicon.ico" Error (404): "Not found"
    [Wed, 08 Jul 2015 01:56:54 GMT] "GET /passed.zip" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    [Wed, 08 Jul 2015 01:58:22 GMT] "GET /" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    [Wed, 08 Jul 2015 01:58:23 GMT] "GET /favicon.ico" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    [Wed, 08 Jul 2015 01:58:23 GMT] "GET /favicon.ico" Error (404): "Not found"
    [Wed, 08 Jul 2015 02:02:44 GMT] "GET /passed.zip" "curl/7.30.0"
    [Wed, 08 Jul 2015 02:03:10 GMT] "GET /passed.zip" "curl/7.30.0"
    [Wed, 08 Jul 2015 02:03:33 GMT] "GET /passed.zip" "curl/7.30.0"
    FATAL ERROR: node::smalloc::Alloc(v8::Handle<v8::Object>, size_t, v8::ExternalArrayType) Out Of Memory

### 下载文件

curl -O url

curl -O http://192.168.3.50/1.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 10.7G  100 10.7G    0     0  52.5M      0  0:03:29  0:03:29 --:--:-- 30.7M

本机只要3分钟。感觉可以接受。
