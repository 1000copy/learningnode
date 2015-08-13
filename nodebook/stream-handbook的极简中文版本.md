stream-handbook的极简中文版本
===============

对于一个ReadableStream ,响应的就有一个read消耗太慢，而生产太快的问题，我想这就是resume,pause存在的缘由吧。

对应于WriteableStream 的write可能返回false——readableStream.push 可能失败(返回false）。

  readable.push(chunk[, encoding])#

  chunk Buffer | null | String Chunk of data to push into the read queue
  encoding String Encoding of String chunks. Must be a valid Buffer encoding, such as 'utf8' or 'ascii'
  return Boolean Whether or not more pushes should be performed


2015年08月13日  理解如下概念，cork,uncork,write,highwatermark,_write,write,drain，只要看如下代码即可。
cork上之后，不停的写，write，write很多次，然后buffer就满了。write就会返回false。
这就是写入的速度快于消耗的速度时的代码处理的效果模拟。

stream.write 可能返回false，这说明buffer满了，消耗的太慢了。要等待drain（排水完毕）之后才可以继续写。


  var Writable = require('stream').Writable;
  //default highWaterMark is 16K
  var ws = Writable({highWaterMark:1000});
  ws.cork()
  var i = 0
  var chunks = []
  ws._write = function (chunk, enc, next) {
      // console.dir(chunk);
      // console.log(chunk.length)
      i++
      chunks.push(chunk)
      next();
  };

  // process.stdin.pipe(ws);
  write1000()
  function write1000(){
    for (var i=0;i<200;i++)
      if (false === ws.write("0123456789"))
        {
          // console.log(ws.highWaterMark)
          console.log(i)
          ws.on('drain',function(){
            console.log("drain")
          })
          ws.uncork()
          // break ;
        }
  }


// 11111
// process.stdin.resume()
// console.log(require("util").inspect(Object.keys(process.stdin._events)))
// process.stdin.pipe(process.stdout)
// console.log("----------------")
// console.log(require("util").inspect(Object.keys(process.stdin._events)))
// console.log("OK.")

// console.log(process.stdin._events.data.toString())

// 2222

// process.stdin.resume()
// process.stdin.on("data",function ondata(chunk) {
//     process.stdout.write(chunk);
// })
// console.log("OK.")

// process.nextTick(function(){
//  while
// })
// setTimeout(function() {
//   console.log('hello world!');
// }, 5000);
// console.log("ok")
//只有调用resume，就会一直等输入，不退出，除非你给一个sigint .当然只要有一个异步代码没有执行完，node都不会退出，哪怕最后一行代码执行完也只是静态意义上的。

process.stdin.resume()
// 很有气质的代码。一个是pipe是做了一个事件链接，就是告诉stdin如果有数据就通知下，并在通知的callback内埋入代码，转发这些数据的到目的流。可以通过
// console.log(process.stdin._events.data.toString()) 获得代码。
// 看了代码就知道，用

// process.stdin.on("data",function ondata(chunk) {
//     process.stdout.write(chunk);
// })

// 替代是可以演示效果的，尽管缺乏错误处理。另外drain 这个词是排水的意思，就是说如果写错了，是dest需要排水（满了），而src需要await，和pipe（管道）一次遥相呼应。
// node很喜欢这样的插入代码（事件）到别人的对象内，对封装的概念被无视，感觉不舒服。大脑混入异物。但是，它也因此变得更加声明话，而不是命令化的模式了。


在unix中，我们可以使用`|`符号来实现流，从而可以让很多小程序可以协作。node内建stream模块也借助这个概念。流模块的基本操作符叫做`.pipe()`。

#为什么用流?

在node中，I/O都是异步的，所以使用回调函数的场景颇多：

	var http = require('http');
	var fs = require('fs');

	var server = http.createServer(function (req, res) {
	    fs.readFile(__dirname + '/data.txt', function (err, data) {
	        res.end(data);
	    });
	});
	server.listen(8000);

这样的代码，在node中见惯不惊。然而，稍加分析，其实是有些问题的。

在每次请求时，我们都会把整个`data.txt`文件读入内存，然后返回它给客户端。`data.txt`有多大就得消耗多少内存，要是大量用户并发的话，消耗会更严重。

所幸的是，`(req,res)`参数都是流对象，这意味着我们可以：

	var http = require('http');
	var fs = require('fs');

	var server = http.createServer(function (req, res) {
	    var stream = fs.createReadStream(__dirname + '/data.txt');
	    stream.pipe(res);
	});
	server.listen(8000);
	
在这里，`.pipe()`方法会自动帮助我们监听`data`和`end`事件。

上面的这段代码不仅简洁，而且`data.txt`文件中每一小段数据只要可用，就会不断发送到客户端（有了就发，而不是全部准备好后一次发送）

# extra bonus

使用`.pipe()`可以更好匹配供方和需方的IO速度：客户端网络差、连接缓慢时，node可以匹配客户端的低速，也跟着慢加载到内存，少占用内存。

想要将数据进行压缩？我们可以使用相应的流模块完成这项工作!

	var http = require('http');
	var fs = require('fs');
	var oppressor = require('oppressor');

	var server = http.createServer(function (req, res) {
	    var stream = fs.createReadStream(__dirname + '/data.txt');
	    stream.pipe(oppressor(req)).pipe(res);
	});
	server.listen(8000);
	
通过上面的代码，我们成功的将发送到浏览器端的数据进行了gzip压缩。只不过加上一个模块，然后两边pipe匹配即可。

这样使用流api，真像搭乐高积木一样。

#流模块基础

在node中，一共有五种类型的流：readable,writable,transform,duplex以及"classic"

##pipe

无论哪一种流，都会使用`.pipe()`方法来实现输出和输出。

`.pipe()`函数接受一个源`src`并导向数据到一个目的`dst`中：

	src.pipe(dst)

链式调用:

	a.pipe(b).pipe(c).pipe(d)


就像unix管道：

	a | b | c | d


##readable流

Readable流可以产出数据


###创建一个readable流

现在我们就来创建一个readable流！

	var Readable = require('stream').Readable;

	var rs = new Readable;
	rs.push('beep ');
	rs.push('boop\n');
	rs.push(null);

	rs.pipe(process.stdout);

下面运行代码：

	$ node read0.js
	beep boop

在上面的代码中`rs.push(null)`的作用是告诉`rs`输出数据应该结束了。

需要注意是，我们在将数据输出到`process.stdout`之前已经将内容推送进readable流`rs`中。

要是当需要数据时数据才会产生，这样的按需生产，可以避免大量的缓存数据。就像丰田的jit。

### 按需推送

可以通过定义一个`._read`函数来实现按需推送:

	var Readable = require('stream').Readable;
	var rs = Readable();

	var c = 97;
	rs._read = function () {
	    rs.push(String.fromCharCode(c++));
	    if (c > 'z'.charCodeAt(0)) rs.push(null);
	};

	rs.pipe(process.stdout);

代码的运行结果如下所示:

	$ node read1.js
	abcdefghijklmnopqrstuvwxyz

在·_read`内虽然也使用了push，推进了rs中，但是只有当数据消耗者出现时，这个push的行为才真的发生。

###消耗一个readable流

pipe是最常用的。不过，也可以直接响应readable 事件，消耗一个stream：

	process.stdin.on('readable', function () {
	    var buf = process.stdin.read();
	    console.dir(buf);
	});
	
采用 shell 来产生一个间断流（就是sleep一会儿继续发），这样可以发生多次readable事件：

	$ (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume0.js 
	<Buffer 61 62 63 0a>
	<Buffer 64 65 66 0a>
	<Buffer 67 68 69 0a>
	null

当数据可用时，`readable`时间将会被触发，此时你可以调用`.read()`方法来从缓存中获取这些数据。

当流结束时，`.read()`将返回`null`，因为此时已经没有更多的字节可以供我们获取了。

##writable流

一个writable流指的是只能流进不能流出的流:

	src.pipe(writableStream)
	
###创建一个writable流  

只需要定义一个`._write(chunk,enc,next)`函数，就可以作为管道的接收方了：

	var Writable = require('stream').Writable;
	var ws = Writable();
	ws._write = function (chunk, enc, next) {
	    console.dir(chunk);
	    next();
	};

	process.stdin.pipe(ws);
	
用shell生产一个间断流：

	$ (echo beep; sleep 1; echo boop) | node write0.js 
	<Buffer 62 65 65 70 0a>
	<Buffer 62 6f 6f 70 0a>


第一个参数，`chunk`代表写进来的数据。

第二个参数`enc`代表字符串的编码。

第三个参数，`next(err)`是一个回调函数，使用这个回调函数你可以告诉数据提供者可以写更多的数据。

###向一个writable流中写东西  

如果你需要向一个writable流中写东西，只需要调用`.write(data)`。调用`.end()`方法来说明已经写完。

	var fs = require('fs');
	var ws = fs.createWriteStream('message.txt');

	ws.write('beep ');

	setTimeout(function () {
	    ws.end('boop\n');
	}, 1000);
	
运行结果如下所示:

	$ node writing1.js 
	$ cat message.txt
	beep boop


##transform流  

它可以读也可写，但是并不保存数据，它只负责处理流经它的数据。  

##duplex流  

Duplex流是一个可读也可写的流。比如：
	
	a.pipe(b).pipe(a)

那么b就是一个duplex流对象。

## 高级代码
### unshift妙用——多的退给你，下次再给我。
使用`unshift()`方法能够放置我们进行不必要的缓存拷贝。在下面的代码中我们将创建一个分割新行的可读解析器:

	var offset = 0;

	process.stdin.on('readable', function () {
	    var buf = process.stdin.read();
	    if (!buf) return;
	    for (; offset < buf.length; offset++) {
	        if (buf[offset] === 0x0a) {
	            console.dir(buf.slice(0, offset).toString());
	            buf = buf.slice(offset + 1);
	            offset = 0;
	            process.stdin.unshift(buf);
	            return;
	        }
	    }
	    process.stdin.unshift(buf);
	});
	
代码的运行结果如下所示：

	$ tail -n +50000 /usr/share/dict/american-english | head -n10 | node lines.js 
	'hearties'
	'heartiest'
	'heartily'
	'heartiness'
	'heartiness\'s'
	'heartland'
	'heartland\'s'
	'heartlands'
	'heartless'
	'heartlessly'
	
当然，已经有很多这样的模块比如split来帮助你完成这件事情，你完全不需要自己写一个。

###按需推送验证

为了验证我言不虚，我们可以：

	var Readable = require('stream').Readable;
	var rs = Readable();

	var c = 97 - 1;

	rs._read = function () {
	    if (c >= 'z'.charCodeAt(0)) return rs.push(null);

	    setTimeout(function () {
	        rs.push(String.fromCharCode(++c));
	    }, 100);
	};

	rs.pipe(process.stdout);

	process.on('exit', function () {
	    console.error('\n_read() called ' + (c - 97) + ' times');
	});
	process.stdout.on('error', process.exit);
	
用命令head，只请求5byte的数据:只会运行5次：

	$ node read2.js | head -c5
	abcde
	_read() called 5 times

当`head`获得了5字节，就不再关心我们的程序输出，OS就会给我进程一个`SIGPIPE`信号，此时`process.stdout`将会捕获到一个`EPIPE`错误。进入 process.stdout.on('error', process.exit)， 调用process.exit ,通知process退出。

之所以需要在_read函数内使用`setTimeout`（而不是立刻push），是因为这样OS才有时间片来发送程序结束信号。


------------
原文地址： https://github.com/substack/stream-handbook
中文原文地址：https://github.com/jabez128/stream-handbook

>简化点和理由:

	- 什么哲学之类的，我才不关心。所以，要简化下。
	- 歪果仁写东西，喜欢先来个逆话题，然后谈本来的话题。所以，要简化下。（比如你可以A blabla，不过一般我们都是b，随后谈b，再不谈a）
	- 遥远的类比和借用，也要简化。比如说stream的时候类比电话
	- 不常用的东西，比如classical stream ,都说了不常用，古老（node0.4）的东西了，就不必谈了。
	- unshift使用部分和概念关心不大，属于技巧部分，从主体中移动到高级内。

> 不喜欢就走开，不要来喷。


-----------等待整理
##node duplex 全双工

全双工的定义就是可以同时读写，实际上一个全双工流有两个stream嵌入，分别做流入和流程。

如果stdin和stdout打包一起作为一个全双工流，那么用这一个流就可以同时做读和写。

socket就是一个Duplex 案例。Node.js 的 socket就是一个全双工流，在socket上，内有两个通道，分别做数据收发，看起来是socket一个对象同时做收发。

    //Server.js
    var net = require('net');     
    var server = net.createServer(function(socket) {
    	socket.write('Echo server\r\n');
    	socket.pipe(socket);
    });     
    server.listen(1337, '127.0.0.1');
    //client.js
    var net = require('net');
     
    var client = new net.Socket();
    client.connect(1337, '127.0.0.1', function() {
    	console.log('Connected');
    	client.write('Hello, server! Love, Client.');
    });
     
    client.on('data', function(data) {
    	console.log('Received: ' + data);
    	client.destroy(); // kill client after server's response
    });
     
    client.on('close', function() {
    	console.log('Connection closed');
    });

### Creating a custom duplex stream

 -  Create a class which inherits from the Duplex abstract class
 -  Implement _write(chunk, encoding, cb) method for sending data
 -  Implement _read(n) method for receiving data

### Creating duplex stream with read timer and write logging

To show the independent nature of the two embedded streams, this example creates a duplex class which:

generates the current time string every second on the read stream

outputs the write stream to stdout

    var stream = require('stream');
    var util = require('util');
    var Duplex = stream.Duplex     
    // 定义一个定制流类别 DRTimeWLog ，继承自Duplex 
    function DRTimeWLog(options) {
      Duplex.call(this, options); 
      this.readArr = [];     
      // every second, add new time string to array
      this.timer = setInterval(addTime, 1000, this.readArr);
    }
    // 指定继承关系 
    util.inherits(DRTimeWLog, Duplex);
    
    /* add new time string to array to read */
    function addTime(readArr) {
      readArr.push((new Date()).toString());
    }
    // 覆盖_read方法，以便实现接收。
    DRTimeWLog.prototype._read = function readBytes(n) {
      var self = this;
      while (this.readArr.length) {
        var chunk = this.readArr.shift();
        if (!self.push(chunk)) {
          break; // false from push, stop reading
        }
      }
      if (self.timer) { // continuing if have timer
        // call readBytes again after a second has
        // passed to see if more data then
        setTimeout(readBytes.bind(self), 1000, n);
      } else { // we are done, push null to end stream
        self.push(null);
      }
    };
    
    /* stops the timer and ends the read stream */
    DRTimeWLog.prototype.stopTimer = function () {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
    };
    
    /* for write stream just ouptut to stdout */
    DRTimeWLog.prototype._write =
      function (chunk, enc, cb) {
        console.log('write: ', chunk.toString());
        cb();
      };
    
    
    // try out DRTimeWLog
    var duplex = new DRTimeWLog();
    // 何时readable发生？
    // When a chunk of data can be read from the stream, it will emit a 'readable' event.
    // 如果知道有一段数据可以读? 当然必须调用_read 收数据才可能。因此，必定是在创建流之后，流就会调用一次_read——问问你是否有可读的东西来？如果_read内做了内容的.push ,更改了流的内部buffer，流会知道这个改变，于是emit 一个readable的事件，以供流的消费者读取使用
    // 就是说_read 尽管和read非常接近，却不是read调用的_read 。_read更像是流的另外一端，提供进数据来，read则是读出数据。这和名字暗指的很不相同因此不易了解。并且流内部只会调用一次，如果_read可能需要做几次读知道可以push(null),就在自己在调用自己（setTimeout(readBytes.bind(self), 1000, n);）
    // 当然，以上都是猜测。
    
    duplex.on('readable', function () {
      var chunk;
      while (null !== (chunk = duplex.read())) {
        console.log('read: ', chunk.toString());
      }
    });
    duplex.write('Hello \n');
    duplex.write('World');
    duplex.end();
    
    // after 3 seconds stop the timer
    setTimeout(function () {
      duplex.stopTimer();
    }, 3000);
The above example has output similar to the following:

write:  Hello

write:  World
read:  Mon Aug 25 2013 17:57:14 GMT-0500 (CDT)
read:  Mon Aug 25 2013 17:57:15 GMT-0500 (CDT)
read:  Mon Aug 25 2013 17:57:16 GMT-0500 (CDT)


### passthrough

###Creating duplex passthrough stream


每个Passthrough 都可以叠加额外的变换，而不必把所有的逻辑集中到一个模块内。这个Passthrough 可以是过滤，压缩，加密，

一方面，感觉 node-http2 就是用着个技术。一个流进来，先后进行解压，反系列化（buffer->Frame),就是利用的Passthrough 技术，把几个 Passthrough 用管道连接起来，每个节点做各自的处理。另一方面，好像node-http2 好像没有这么罗嗦。


实现 duplex passthrough stream ，需要嵌入两个 PassThrough stream 到类内，以便加入我们自己的  _read() ， _write() 方法.


    var fs = require('fs');
    var stream = require('stream');
    var util = require('util');
    
    var Duplex = stream.Duplex ||
      require('readable-stream').Duplex;
    
    var PassThrough = stream.PassThrough ||
      require('readable-stream').PassThrough;
    
    /**
     * Duplex stream created with two transform streams
     * - inRStream - inbound side read stream
     * - outWStream - outbound side write stream
     */
    function DuplexThrough(options) {
      if (!(this instanceof DuplexThrough)) {
        return new DuplexThrough(options);
      }
      Duplex.call(this, options);
      // 加入两个 PassThrough
      this.inRStream = new PassThrough();
      this.outWStream = new PassThrough();
      this.leftHandlersSetup = false; // only setup the handlers once
    }
    util.inherits(DuplexThrough, Duplex);
    
    // 把_write方法导向到 .inRStream.write
    DuplexThrough.prototype._write =
      function (chunk, enc, cb) {
        this.inRStream.write(chunk, enc, cb);
      };
    
    /* left outbound side */
    /*
    当 outWStream  的事件 readable,end 发生时，去引发 outWStream.read 方法
     */
    DuplexThrough.prototype.setupLeftHandlersAndRead = function (n) {
      var self = this;
      self.leftHandlersSetup = true; // only set handlers up once
      self.outWStream
        .on('readable', function () {
          self.readLeft(n);
        })
        .on('end', function () {
          self.push(null); // EOF
        });
    };
    
    DuplexThrough.prototype.readLeft = function (n) {
      var chunk;
      while (null !==
             (chunk = this.outWStream.read(n))) {
        // if push returns false, stop writing
        if (!this.push(chunk)) break;
      }
    };
    
    DuplexThrough.prototype._read = function (n) {
      // first time, setup handlers then read
      if (!this.leftHandlersSetup) {
        return this.setupLeftHandlersAndRead(n);
      }
      // otherwise just read
      this.readLeft(n);
    };
    
    
    // try out DuplexThrough w/fileReadStream and writes
    var rstream = fs.createReadStream('myfile.txt');
    var duplex = new DuplexThrough();
    
    // inbound side - pipe file through
    duplex.inRStream
      .on('readable', function () {
        var chunk;
        while (null !==
               (chunk = duplex.inRStream.read())) {
          console.log('in: ', chunk.toString());
        }
      });
    rstream.pipe(duplex);
    
    
    // outbound side - write Hello \nworld
    duplex
      .on('readable', function () {
        var chunk;
        while (null !== (chunk = duplex.read())) {
          console.log('out: ', chunk.toString());
        }
      });
    duplex.outWStream.write('Hello \n');
    duplex.outWStream.write('world');
    duplex.outWStream.end();
Running the example produces output like:

out:  Hello
world
in:  Simple text file

 - one
 - two
 - three
Duplex streams summary


## 和流有关的两个概念Deplex ,Transform 

###A Duplex stream 
can be thought of a readable stream with a writable stream. Both are independent and each have separate internal buffer. The reads and writes events happen independently.

                             Duplex Stream
                          ------------------|
                    Read  <-----               External Source
            You           ------------------|   
                    Write ----->               External Sink
                          ------------------|
            You don't get what you write. It is sent to another source.
###A Transform stream 
is a duplex where the read and write takes place in a causal way. The end points of the duplex stream are linked via some transform. Read requires write to have occurred.

                                 Transform Stream
                           --------------|--------------
            You     Write  ---->                   ---->  Read  You
                           --------------|--------------
            You write something, it is transformed, then you read something.
            
            

causal adj.具有因果关系的，构成原因的

###用字符串构建一个流（这样比起文件或者socket，依赖要少得多）

    var Stream = require('stream');
    var stream = new Stream();
    
    stream.pipe = function(dest) {
      dest.write('your string');
      return dest;
    };
    
    stream.pipe(process.stdout); 
    
### Transform 

     describe('scenario', function() {  
        it('should work as expected', function(done) {
      var Transform = require('stream').Transform;
      var Stream = require('stream');
      var stream = new Stream();

      stream.pipe = function(dest) {
        dest.write('abc');
        return dest;
      };
      function createParser () {
          var parser = new Transform();
          parser._transform = function(data, encoding, done) {
              // data is Buffer object 
              this.push(data.slice(0,1));
              done();
          };
          return parser;
      }
      //  a transformer ,transmit abc to a
      var p = createParser();
      stream.pipe(p).pipe(process.stdout); 
      expect('a').to.be.equal('a');
      // console.log(1)
      done();
    });
    
## 当stream1.pipe(stream2)的时候，到底方式了什么？

曾经对使用pipe困惑不已。比如：

	var Readable = require('stream').Readable;
	var rs = Readable();

	var c = 97;
	rs._read = function () {
	    rs.push(String.fromCharCode(c++));
	    if (c > 'z'.charCodeAt(0)) rs.push(null);
	};

	rs.pipe(process.stdout);

1. 何不直接打印？
2. pipe高乐搞了什么？

	for(var c = 'a'.charCodeAt(0);c<'z'.charCodeAt(0);c++)
	  console.log(c)
	

当
```
stream1.pipe(stream2)
```

检视endpoint的时候，打印endpoint._connection._events 无意中发现了Pipe让stream那么牛逼的秘密。

```
{
  readable: [Function: pipeOnReadable],
  unpipe: [Function: onunpipe],
  drain: [Function],
  error: [ [Function: onerror], [Function] ],
  close: { [Function: g] listener: [Function: onclose] },
  finish: { [Function: g] listener: [Function: onfinish] },
}
```

原来这样做后，会截取若干事件，并在事件函数内写了不少逻辑。

挖个坑，空了再填。

	var Writable = require('stream').Writable;
	var ws = Writable();
	ws._write = function (chunk, enc, next) {
	    console.dir(chunk);
	    next();
	};

	process.stdin.pipe(ws);



		var Readable = require('stream').Readable;
	var rs = Readable();

	var c = 97;
	rs._read = function () {
	    rs.push(String.fromCharCode(c++));
	    if (c > 'z'.charCodeAt(0)) rs.push(null);
	};

	rs.pipe(process.stdout);