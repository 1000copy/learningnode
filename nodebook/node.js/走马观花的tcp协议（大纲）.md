Agenda

	三次握手，四次挥手
	node案例，代码分析
	wireshark，rawcap的包次序验证
	netstat的状态验证


TCP 的那些事儿（上） | 酷 壳 - CoolShell.cn - http://coolshell.cn/articles/11564.html

#wireshark 默认无法嗅探 loopback，但是rawCap 可以。生成的文件可以用wireshark阅读

http://www.netresec.com/?page=RawCap



# 想要显示port所属应用程序，只要加-b参数即可。

 -b            
显示在创建每个连接或侦听端口时涉及的可执行程序。
                
# TCP 连接关闭过程的四次挥手

数据传输结束后，通信的双方都可以释放连接，并停止发送数据。

现在假设现在客户端和服务端都处于ESTABLISHED状态。

    1、A向 B 发出连接释放报文FIN,进入FIN—WAIT-1（终止等待1）状态，等待B的确认。

    2、B 收到FIN报文后即发出ACK 确认收到此报文。进入CLOSE—WAIT 状态， A收到B的确认后，就进入了FIN—WAIT2 状态。等待B发出连接释放报文段
    
    3. 如果B已经没有要向A发送的数据了，就发送FIN 报文给A。这时B进入LAST—ACK（最后确认）状态，等待A的确认

    4、A收到B的FIN 报文后，必须对此发出ACK确认。A进入TIME—WAIT状态。这时候，TCP连接还没有释放掉，必须经过时间等待计时器设置的时间2MSL后，A才进入CLOSED状态，时间MSL叫做最长报文寿命，而B只要收到了A的确认后，就进入了CLOSED状态。
    
    二者都进入CLOSED状态后，连接就完全释放了。
    
     为什么A在TIME—WAIT状态必须等待2MSL时间呢？
     
    1、为了保证A发送的最后一个ACK报文段能够到达B。该ACK报文段很有可能丢失，因而使处于在LIST—ACK状态的B收不到对已发送的FIN+ACK报文段的确认，B可能会重传这个FIN+ACK报文段，而A就在这2MSL时间内收到这个重传的FIN+ACK报文段，接着A重传一次确认，重新启动2MSL计时器，最后A和B都进入CLOSED状态。如果A在TIME—WAIT状态不等待一段时间就直接释放连接，到CLOSED状态，那么久无法收到B重传的FIN+ACK报文段，也就不会再发送一次确认ACK报文段，B就无法正常进入CLOSED状态。
    2、防止已失效的请求连接出现在本连接中。在连接处于2MSL等待时，任何迟到的报文段将被丢弃，因为处于2MSL等待的、由该插口（插口是IP和端口对的意思，socket）定义的连接在这段时间内将不能被再用，这样就可以使下一个新的连接中不会出现这种旧的连接之前延迟的报文段。
    
    
# 做一个两栏式的状态图，使用 The DOT Language ，如何？

#MSL config

 Windows, you can change it through the registry:

; Set the TIME_WAIT delay to 30 seconds (0x1E)

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TCPIP\Parameters]
"TcpTimedWaitDelay"=dword:0000001E


So the TIME_WAIT time is generally set to double the packets maximum age. This value is the maximum age your packets will be allowed to get to before the network discards them.

That guarantees that, before you're allowed to create a connection with the same tuple, all the packets belonging to previous incarnations of that tuple will be dead.

That generally dictates the minimum value you should use. The maximum packet age is dictated by network properties, an example being that satellite lifetimes are higher than LAN lifetimes since the packets have much further to go.

When a TCP connections closes the port cannot be reused immediately afterwards because the Operating System has to wait for the duration of the TIME_WAIT interval (maximum segment lifetime, MSL).

The reason for waiting is that packets may arrive out of order or be retransmitted after the connection has been closed. CLOSE_WAIT indicates that the other side of the connection has closed the connection. TIME_WAIT indicates that this side has closed the connection. The connection is being kept around so that any delayed packets can be matched to the connection and handled appropriately.

Remember that TCP guarantees all data transmitted will be delivered, if at all possible. When you close a socket, the server goes into a TIME_WAIT state, just to be really sure that all the data has gone through. When a socket is closed, both sides agree by sending messages to each other that they will send no more data. This, it seemed to me was good enough, and after the handshaking is done, the socket should be closed. The problem is two-fold. First, there is no way to be sure that the last ack was communicated successfully. Second, there may be "wandering duplicates" left on the net that must be dealt with if they are delivered.

Now consider what happens if the last of those packets is dropped in the network. The client has done with the connection; it has no more data or control info to send, and never will have. But the server does not know whether the client received all the data correctly; that's what the last ACK segment is for. Now the server may or may not care whether the client got the data, but that is not an issue for TCP; TCP is a reliable rotocol, and must distinguish between an orderly connection close where all data is transferred, and a connection abort where data may or may not have been lost.


So, if that last packet is dropped, the server will retransmit it (it is, after all, an unacknowledged segment) and will expect to see a suitable ACK segment in reply. If the client went straight to CLOSED, the only possible response to that retransmit would be a RST, which would indicate to the server that data had been lost, when in fact it had not been.
(Bear in mind that the server's FIN segment may, additionally, contain data.)




监听 ipmsg 的消息的方法：

    udp.port eq 2425
    https://code.google.com/p/linuxsigscut2/wiki/IpMsgProtocol
    feiq 发的消息看着古怪，
    1_lbt6_0#131#F46D04EE2666#1221#0#0#4001#9:1440897450:Guiyun:DEV6-GUIYUN-PC:0: 
    在本来的ipmsg的version位置是一堆乱七八糟的。
    可是利用atoi的特性这些东西返回的是1，从而让ipmsg认为version区的内容就是1，从而实现和ipmsg兼容。
    更多的ipmsg不管的东西，可以有feiq加入自己的特征。
    
    atoi的代码；
            int __cdecl _ttoi(const _TCHAR *String)
        {
            UINT Value = 0, Digit;
            _TCHAR c;
        
            while ((c = *String++) != _EOS) {
        
                if (c >= '0' && c <= '9')
                    Digit = (UINT) (c - '0');
                else
                    break;
        
                Value = (Value * 10) + Digit;
            }
        
            return Value;
        }
    
如何让netstat的pid帮助，以应用程序为组织线索来看连接和端口占用状态？

1. command line :

The following command will show what network traffic is in use at the port level:

    Netstat -a -n -o
2. api

You need to use GetTcpTable2 in order to get the corresponding PID associated as well.

typedef struct _MIB_TCPROW2 {
  DWORD                        dwState;
  DWORD                        dwLocalAddr;
  DWORD                        dwLocalPort;
  DWORD                        dwRemoteAddr;
  DWORD                        dwRemotePort;
  DWORD                        dwOwningPid;
  TCP_CONNECTION_OFFLOAD_STATE dwOffloadState;
} MIB_TCPROW2, *PMIB_TCPROW2;
dwOwningPid
3. process name from id 

tasklist | findstr　"id"

CLOSE_WAIT means your program is still running, and hasn't closed the socket (and the kernel is waiting for it to do so). Add -p to netstat to get the pid, and then kill it more forcefully (with SIGKILL if needed). That should get rid of your CLOSE_WAIT sockets. You can also use ps to find the pid.

SO_REUSEADDR is for servers and TIME_WAIT sockets, so doesn't apply here.





socket end ,close,destroy:

###end 
socket.end([data][, encoding])#
Half-closes the socket. i.e., it sends a FIN packet. It is possible the server will still send some data.

If data is specified, it is equivalent to calling socket.write(data, encoding) followed by socket.end().

###destroy

socket.destroy()#
Ensures that no more I/O activity happens on this socket. Only necessary in case of errors (parse error or so).

###Event: 'close'#

Emitted once the socket is fully closed. 

Event: 'end'#
Emitted when the other end of the socket sends a FIN packet.

By default (allowHalfOpen == false) the socket will destroy its file descriptor once it has written out its pending write queue. However, by setting allowHalfOpen == true the socket will not automatically end() its side allowing the user to write arbitrary amounts of data, with the caveat that the user is required to end() their side now.




#问题：

1. connection:upgrade使用场景
2. 正常关闭 ，半关闭
这些内容是tcp的范畴。
有些东西还是得c语音才说的清楚

Beej's 网络编程指南 - http://oss.org.cn/ossdocs/gnu/linux/is.html

Beej's Guide to Network Programming - http://beej.us/guide/bgnet/output/html/singlepage/bgnet.html#closedown

c - close vs shutdown socket? - Stack Overflow

This is explained in Beej's networking guide.  shutdown is a flexible way to block communication in one or both directions. When the second parameter is SHUT_RDWR, it will block both sending and receiving (like close). However, close is the way to actually destroy a socket.

With shutdown, you will still be able to receive pending data the peer already sent (thanks to Joey Adams for noting this).

http权威指南的 链接管理部分，95页到111页都是半懂不懂。

Persistent Connection Behavior of Popular Browsers - http://pages.cs.wisc.edu/~cao/papers/persistent-connection.html

You can call request.connection.destroy() in the response callback. That will close the request connection.

It will also end your process since there is nothing left to do, the end result is the same as calling process.exit() right there.

    net.createServer([options][, connectionListener])#
    
    options is an object with the following defaults:
    
    {
      allowHalfOpen: false,
      pauseOnConnect: false
    }
    If allowHalfOpen is true, then the socket won't automatically send a FIN packet when the other end of the socket sends a FIN packet. The socket becomes non-readable, but still writable. You should call the end() method explicitly. See 'end' event for more information.

    Event: 'end'#
    Emitted when the other end of the socket sends a FIN packet.
    
    By default (allowHalfOpen == false) the socket will destroy its file descriptor once it has written out its pending write queue. However, by setting allowHalfOpen == true the socket will not automatically end() its side allowing the user to write arbitrary amounts of data, with the caveat that the user is required to end() their side now.


In node.js, it is possible to have a half-open socket. This means that the socket can become read or write only without closing the whole socket. An example for this:

var net = require("net");
net.createServer({allowHalfOpen:true},function(c){
    c.on("data",function(d){
        console.log(d+"");
    });
    c.on("end",function(){
        console.log("ended");
        c.end("thx");
    });
}).listen(888);

var c = net.connect(888,function(){
    c.end("hi");
    c.on("data",function(d){
        console.log(d+"");
    });
    c.on("end",function(){
        console.log("ended");
    });
});
Output:

hi
ended
thx
ended
Is there a way in C# to close only one direction of the socket? Also, is there a way to know if a socket is readable but not writable and vice versa?
