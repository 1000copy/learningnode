调试一个小小的程序，希望它可以打印来自局域网另外一台主机（其实是iPhone)的UDP广播消息。

代码是来自Gists的一段。基于我大nodejs的一贯立场，代码简洁清晰，就是这样：

	var PORT = 2425;
	var HOST = '192.168.2.112';
	
	var dgram = require('dgram');
	var server = dgram.createSocket('udp4');

	server.on('listening', function () {
	    var address = server.address();
	    console.log('UDP Server listening on ' + address.address + ":" + address.port);
	});
	server.on('message', function (message, remote) {
	    console.log(remote.address + ':' + remote.port +' - ' + message);
	});
	server.bind(PORT,HOST);
    // server.bind(PORT);
然而，当另一个小程序（其实是IP Messager for iOS),发起一个广播消息的时候，我怎么也收不到它。当我疑神疑鬼的时候，tcpdump站起来讲，它是可以收到的：

	sudo tcpdump -nnvvXS  port 2425 

它没有乱说。我要的几个广播包，硬硬的都在：

		tcpdump: data link type PKTAP
		tcpdump: listening on pktap, link-type PKTAP (Packet Tap), 
		...
		20:01:13.663746 IP (tos 0x0, ttl 64, id 13617, offset 0, flags [none], proto UDP (17), length 148)
		    192.168.2.115.2425 > 255.255.255.255.2425: [udp sum ok] UDP, length 120
			0x0000:  ffff ffff ffff 3848 4cba b393 0800 4500  ......8HL.....E.
			0x0010:  0094 3531 0000 4011 820d c0a8 0273 ffff  ..51..@......s..
			0x0020:  ffff 0979 0979 0080 9330 313a 3134 3431  ...y.y...01:1441
			0x0030:  3139 3532 3734 3a6d 6f62 696c 653a 6c63  195274:mobile:lc
			0x0040:  6a69 5068 6f6e 652e 6c6f 6361 6c3a 3138  jiPhone.local:18
			...
想过是不是本身代码不灵，但是netcat试过了，说明是一般的消息还是玩得转的。

		$nc -u 192.168.2.112  2425
	    abcd
	    efefafadfd
	    
	    $nodemon test.js

	    SERVER:
	    2 Sep 20:36:44 - [nodemon] starting `node test.js`
	    UDP Server listening on 192.168.2.112:2425
	    192.168.2.112:54782 - abcd
	    
	    192.168.2.112:54782 - efefafadfd

就是广播不行。找了一堆资料，感觉一定是某个特别基础的，但是很关键的概念，我不知道。

直到我看到了INADDR_ANY .

我去掉了bind那一段的HOST，改成

	server.bind(PORT);

Server Listening的部分，现在变成了0.0.0.0,然后广播消息也被快乐的打印出来：

	UDP Server listening on 0.0.0.0:2425
	192.168.2.115:2425 - 1:1441199361:mobile:lcjiPhone.local:18874368:

成了。

ref:

wireshark毕竟是图形界面，作为嗅探工具可以用，但是逼格不高。

在命令行的世界里面，有一个叫做tcpdump的东西，可以在mac，linux上跑。但是windows....总是这样，还好这次有选择，一个叫做WINDUMP 的玩意。

http://searchenterprisedesktop.techtarget.com/tip/WinDump-The-tcpdump-tool-for-Windows

听说，要嗅探包的话，netstat这个小家伙就有一个子命令可以用。
https://isc.sans.edu/forums/diary/No+Wireshark+No+TCPDump+No+Problem/19409/


对tcp应用的验证，可以用telnet。要是对udp做验证呢？答案是 netcat。
   



