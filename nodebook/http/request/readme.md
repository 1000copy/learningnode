目录

- [GET请求和HEAD请求](get+head.md)
- [POST请求](post.md)
- [OPTIONS请求](options.md)
- [PUT请求和DELETE请求](put+delete.md)
- [CONNECT请求](connect.md)

GET 表示我要请求一个由URI指定的在服务器上的资源。
POST表示我要更新一个由URI指定的资源
PUT表示我要创建一个由URI指定的资源
DELETE表示我要删除一个由URI指定的资源。
HEAD 和GET一样，但是仅仅返回指定资源响应的头部分，而不必返回响应主体
OPTIONS 查询目标资源支持method的清单。
TRACE 查询到目标资源经过的中间节点。用于测试。
CONNECT 建立一个到URI指定的服务器的隧道。 
