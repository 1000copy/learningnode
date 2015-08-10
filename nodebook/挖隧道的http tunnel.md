
呀。晴天霹雳。某机构只允许 80/443端口进出了！

此时，如果我需要telnet到外网一台服务器，使用正常的Telnet肯定是不可能了。把telnetd的端口改为80通常也是不行的。这样的封锁，通常会启用了协议过滤，一看你的这是封包就不是http的，也不会放行的。


## what is http tunnel  ?

不过既然http可用，就在http内挖一个隧道吧。这个技术叫做http Tunnel。

举例如下: 

1. A主机系统在防火墙之内。
2. B主机系统在防火墙之外。 
3. 防火墙。只允许80/443端口的进出.  

准备如下：

1. 在A机上运行一个 Tunnel Client端，让它侦听本机端口作为 tunnel port ，如1234。 
2. 在B机上运行一个tunnel Server，在80端口上监听
3. telnet到本机的Tunnel port上

准备完成。

根据刚才的设置, 数据流程大概是:

    [telnet.exe:任意端口] ---> [tunnel client.exe:1234] ---->[Firewall]---->[tunnel server.exe:80]---->[telnet Server.exe:23]
    
按照流程图: 

telnet.exe:           直接访问 tunnel client.exe 的 1234 端口
tunnel client.exe     把数据打包为http格式，发送给 tunnuel server.exe:80 ( 走的http端口了, 防火墙无异议 ) 
Firewall              只允许 80 端口的数据进出.
tunnel server.exe     解压http内装的tcp data，并转发给telnet 的服务进程, 并可以接收 telnet 服务进程的数据
telnetd               把要发送的数据转给 tunnel server.exe，由它编码数据为http封包，回送给到 tunnel client

这里的tunnel软件，有不少选择。其中包括gnu httptunnel 。可以查询命令了解具体使用


##how to setup gnu http tunnel ?


首先得有一台B机（在Firewall外）作为Tunnel server 。上面得有SSH服务(端口22）。
其次，得有一台A机（在Firewall内）。

找到一个叫做 gnu http tunnel 软件。

1. 用 HTTP Tunnel 搞定Tunnel Server 服务器：在80启动一个http 服务，双向连接转发本地22端口到80
    
    hts --forward-port localhost:22 80


2. 搞定工作机：将Tunnel ServerIP上的80端口映射到本地900端口上

    htc --forward-port 900 自家公网IP:80


如此这般后，现在"telnet localhost 900",就等于 "telnet 自家公网IP 22 了"。

http-tunnel是一个完全透明的通道，直接将你的连接forward给目标服务端口，因此当你连接tunnel的本地侦听端口时，就相当于直接连接到目标服务端口。


##动态隧道

上面的做法叫做静态隧道：缺点是只能访问某一个指定的 telnetd 服务器，要访问其他的服务器还得按同样的方法再建立一条隧道。

既然hts可以将连接forward给 telnetd ，那让它forward给一个 SOCKS5 服务，就可以实现动态的tunnel，可以连接任意服务了。这就是动态隧道。

我们建立这样的连接：
 
    htc                    > http proxy             > hts                > SOCKS5 server
    (localhost:8888)        (proxyhost:3128)       (tunnelserver:80)     (socks5server:1080)
 
命令照第静态tunnel改改就行。

这样就相当于在localhost:8888运行了一个SOCKS5服务，设置一下你的网络程序(Outlook,NetAnt,FlashGet,QQ......)，让他们通过SOCK5访问网络，就OK了。
 
## 利用http CONNECT命令。

大多数http proxy支持CONNECT命令，本意是为了通过Connect支持外部服务器的443(https)端口。

可以利用DesProxy来建立一个tunnel client。在tunnel server 上运行一个SOCKS5,端口改为443 就行。连接如下：
 
desproxy            > http proxy             > SOCKS5 server
(localhost:8888)    (proxyhost:3128)         (tunnelserver:443)
 
desproxy命令的用法：

    desproxy remote_host remote_port proxy_host proxy_port local_port

在这里remot_host,remote_port就是tunnelserver:443，proxy_host,proxy_port是porxyhost:3128，local_port就是8888。

同样，我们在localhost:8888得到了一个可以访问外部的SOCK5服务。

注意:

1. 必须把SOCKS5运行在443端口，如果运行在其他端口的话，CONNECT请求会被http proxy拒绝。
2. 由于http CONNECT 建立的是tcp连接（而不是http），因此不是http通道，原理的hts 软件不再需要。

 
## 利用SSH + CONNECT。

利用ssh客户端(或者PuTTY)可以在本地建立一个SOCKS5服务，而且PuTTY也直接支持http proxy。使用ssh的连接如下：

    PuTTY(或plink)            > http  proxy              > ssh server
    (localhost:8888)         (proxyhost:3128)            (tunnelserver:443->22)

配置步骤：

1. 首先我们要让ssh server在443端口侦听。ssh默认端口是22。

2. 让Putty在本地端口提供一个socks5服务，并配置proxy到ssh server。
2.1 在PuTTY建立一个new session，填上ssh服务器的ip和port；在"Connection->Proxy"页，填上http proxy的ip和port
2.2 在"SSH -> Tunnels"页，"Source port"填本地的端口，在这里我们用8888"，Destination"选"Dynamic"，按"Add"将这个forward port加上。

配置完成后，用PuTTY登陆上ssh。用netstat -an可以看到PuTTY已经在localhost:8888侦听了：这是一个SOCKS5服务。

这一做法，最大的好处是ssh的数据连接是加密的。

改编自

1. HTTP代理原理以及HTTP隧道技术_丁蟹_新浪博客 - http://blog.sina.com.cn/s/blog_9db44b83010180k2.html
2. HTTP Tunnel的应用实例 - 老兔 - 博客园 - http://www.cnblogs.com/wengzhiwen/archive/2009/08/26/http_tunnel.html
Database Everywhere @ ShenJS by Evan You - http://slides.com/evanyou/shenjs#/
改编自： HTTP Tunnel使用的几种使用（经典） - - ITeye技术网站 - http://zhangqi007.iteye.com/blog/1838103
改编自：Http隧道(tunnel)技术与Proxy – Legend(谭海燕)的专栏 - http://www.fenesky.com/blog/2014/07/25/how-http-tunnel-works.html


