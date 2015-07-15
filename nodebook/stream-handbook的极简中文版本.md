stream-handbook的极简中文版本
===============

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