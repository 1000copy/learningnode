## 协议

git支持多仓库协作的多种协议。包括：

1. 文件
2. http
3. git
4. ssh

我们已经试过文件型的了，接下来我们准备搭建一个git服务器，采用git协议。

## git 协议

执行 git-daemon，会启动一个监守程序，把当前目录内的（git）全部仓库公开出去。等待采用git协议来连接的客户端。

    cd ~/git
    git daemon --verbose --export-all --base-path=. --enable=receive-pack

参数说明：

    --export-all 公开全部仓库
    --base-path=. 指定基础目录，客户端连接指定的目录都相对于此目录来定位目录。当前命令行内的基础目录就是 ~/git 
    --enable=receive-pack，允许推送

客户端可以来克隆此服务公开的仓库，比如repo.git ，到本地仓库（比如repo_net)：
    
    git clone git://localhost/repo.git repo_net

如果有其他用户知道你的主机地址，那么把 localhost 替代为你的主机地址，就可以克隆你的主机内的公开仓库了。

## smart http
## ssh 协议