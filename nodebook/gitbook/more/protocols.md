## 更多协议

想要和他人协作，我必须有远程仓库，这样我才可以推送和拉取代码的变更。在上一节，我们已经通过一个共享仓库作为中介，以本地协议的通讯方式，达成两人（多人）的代码协作了。

git支持4种协议，包括本地协议、HTTP协议、Git协议、SSH协议。我们继续看看Git协议。

## Git 协议
通过Git协议来托管仓库是内置于git-daemon命令之内
    --base-path=. 指定基础目录，客户端连接指定的目录都相对于此目录来定位目录。当前命令行内的基础目录就是 ~/git 
    --enable=receive-
    --export-all 公开全部仓库
    `
    cd ~/git
    git clone git://localhost/repo.git repo_net                             v  
    git daemon --verbose --export-all --base-path=. --enable=receive-pack
## git 协议
## smart http
## ssh 协议
## 协议
## 授权方法
1. 文件
2. http
3. git
4. ssh
git支持多仓库协作的多种协议。包括：
PP
。。。
参数说明：
如果有其他用户知道你的主机地址，那么把 localhost 替代为你的主机地址，就6和你 吧可以克隆你的主机内的公开仓库了。
客户端可以来克隆此服务公开的仓库，比如repo.git ，到本地仓库（比如repo_net)：
我们已经试过文件型的了，接下来我们准备搭建一个git服务器，采用git协议。
执行 git-daemon，会启动一个监守程序，把当前目录内的（git）全部仓库公开出去。等待采用git协议来连接的客户端。