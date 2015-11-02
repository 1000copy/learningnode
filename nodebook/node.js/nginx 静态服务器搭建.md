本文尽可能用命令（而不是文字）说话。且，本教程亲和windows。因为我的座驾就是windows。但是命令行用的cmder，因为使用命令的话我喜欢*nix的。下一个最大的cmder包，底下的命令都可以支持执行。

#先弄到 nginx ：

    $curl http://nginx.org/download/nginx-1.8.0.zip -O

#解压运行：

    $ unzip  nginx-1.8.0.zip
    $ cd nginx-1.8.0/
    $ nginx 

#查看效果：
    $ curl localhost
     
    <!DOCTYPE html>
    ...
    <h1>Welcome to nginx!</h1>
    ...
#创建一大文件50M，丢进html静态目录：

    $fsutil file createnew largedummy.bin 52428800
    $mv largedummy.bin nginx-1.8.0\html\
    $curl localhost/largdummy.bin -O

#下个大文件
    λ curl localhost/largedummy.bin -O
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
    100 50.0M  100 50.0M    0     0  22.8M      0  0:00:02  0:00:02 --:--:-- 22.8M    

现在，我们的nginx可以把nginx\html作为根目录，文件夹内部的一切静态文件都可以被下载。

----------------------------------------
#附送几条实用命令

##查看进程：

    λ ttasklist /fi "imagename eq nginx.exe"
    
    映像名称                       PID 会话名              会话#       内存使用
    ========================= ======== ================ =========== ============
    nginx.exe                     5216 Console                    1      6,316 K
    nginx.exe                     5416 Console                    1      6,012 K

##退出的方法：

    nginx -s stop 快速退出
    nginx -s quit 优雅退出

##重新装入配置文件：

    nginx -s reload 更换配置并启动新的工作进程