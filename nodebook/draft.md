<<<<<<< HEAD
#请求方法CONNECT

请求方法CONNECT用于客户端和代理服务器（proxy server）之间，而不是客户端和服务器之间。

CONNECT 方法指示代理服务器和指定的服务器建立加密的（TLS）连接。


CONNECT www.example.com:443 HTTP/1.1
Host: www.example.com:443

代理服务器随即连接目的服务器（这里是www.example.com:443），如果成功就返回客户端：

200 OK 

站在代理服务器的视角看
1. 客户端到代理服务器的连接保持打开
2. 从客户端来的数据包会被直接转发到服务器
3. 从服务器来的数据会被直接转发得对应的客户端。

这就形成了一个透明的代理服务器。客户端将会利用这个透明通道，升级这个连接为TLS连接，做TLS握手等。代理服务器在握手过程中，完全不做任何事（除了单纯的转发之外）。整个连接的过程，好像就是客户端和终端服务器之间发生的一样。



=======
目录

[介绍](introduction.md)
[术语](term.md)
[一点历史](history.md)
[请求](request/)
[响应](request/)
>>>>>>> origin/master
