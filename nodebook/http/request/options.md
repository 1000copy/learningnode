#OPTIONS 

请求方法OPTIONS用来查询指定URL支持的方法。

请求案例：

OPTIONS /example HTTP/1.1

响应：

HTTP/1.1 OK
Allow:GET,POST,PUT,OPTIONS

如果对资源使用了它并不支持的请求方法，那么服务器会返回：HTTP 405 错误 – 方法不被允许 (Method not allowed)错误。