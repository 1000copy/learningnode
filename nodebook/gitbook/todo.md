1. 感觉http协议部分的内容，其中的目录安全好像可以不去做的。做了会更安全吗？需要在研究。

=====
从git看团队管理 8.41

我暂时忘掉SVN，为了Git而学习Git，以Linus的思维替代我的思维。然后我发现了如此深刻的人性洞察和简单的应对方法。linux的工作流使得git是显然必须的：

1. 自洽的、最少依赖的个人工作得到支持。1000多人的Linux开发团队是分布在世界各地的，使用git也就不必依赖中心服务器、不必需要很少的网络。就在自己的电脑上就有完整的仓库，可以做任何版本管理，除了分享代码。SVN显然是不合适的，因为单点故障大家甚至无法提交，更加无法开分支，这是无法忍受的。
2. 剔除害群之马很简单。如果Linus经过观察，发现有些程序员特别容易出漏子，那么封杀的办法就是不必拉取即可。实际上Linus就是这样干过。如果是SVN，就变成了撤销惹麻烦的开发者的账号或者限定他的访问范围，并且从仓库中移除麻烦的代码提交。就是说，封杀的方法在git而言，是不做某事即可，SVN是做一系列事情才可以。一正一反，大家可以体会一下。Linus喜欢前者，并且得心应手。这样的工作流程就避开了很多“政治”问题，让他的集成代码过程变得主动。
3. 可以使用信任网络。Linux太大了，不可能完全看完补丁代码的方式来识别信任，这个Linus曾经干过，最后的结果当然是放弃。如果发现有些程序员特别优秀，他只要选择拉取他们的实现。这些程序员也只是拉取他们信任的程序员的实现。这样的信任网络是可以层次化的，因此对应于1000多人的开发者来说，这样做确实可以通过分层的信任网络达成大规模的团队协作。如果是SVN，我不知道如何做可以更好
4.轻量的分支开销鼓励大量被使用。对于这样的团队，为了敏捷的迭代，如果有想法就分支（这样的开发隔离想法是很有价值的），那么在svn上分支是海量的并且全局的大家互相影响，因此是要命的。而对于Git总数当然是海量，但是每个人的分支都在自己的仓库内，不会影响到他人。且分支无需连接服务器，因此是飞速的。

所以，对于Linux团队来说，Git是必须的。特别是它的分布式，可以帮助建立信任网络，减少政治问题。它的设计，首先是关于人的，关于最佳的工作流程的、技术这是这些思想的完美载体。Linus不仅仅创建了Linux，也实际上管理着一个巨大的团队，做法就是用一套工具提供信任网络和少政治的工作流程，从而可以不管。说Linus是此团队的“仁君”，并非缪赞。想想混乱的现实世界，我确实对这个高手团队的管理方法感到敬佩。


## 开始一时提交不了，但是要求临时改bug 

echo something >f && cat  f & git add f  && git commit -m"something"
git checkout -b dev && echo WIP >> f && cat f
git stash
git checkout master && cat f
something
# 在buf001分支上，修复bug,提交
git checkout -b bug001 && echo buf001fix >> f && cat f && git commit -m"bugfix" -a
# 查看branch
$git branch
# 切换到master分支，完成合并(记得删除bug001分支）
$ git checkout master && git merge bug001 & cat f && git commit -m"merge bug001" -a 

$ git checkout dev && git stash pop && cat f
something
WIP


## 记忆github密码的方法

git 可以通过设置 credential.helper 值来使用不同的存储设施保存远端仓库的访问用户名和密码。

在windows系统上，把 credential.helper设置为  wincred 即可（要求版本为1.7.9以上）

    git config --global credential.helper

在 mac 系统上，可以这样做:

    git config --global credential.helper osxkeychain

## git config reset ?

vim ~/.gitconfig

## 在使用git push 时，总是提示：

    warning: push.default is unset; its implicit value is changing in 
    Git 2.0 from 'matching' to 'simple'. To squelch this message 
    and maintain the current behavior after the default changes, use: 

      git config --global push.default matching

    To squelch this message and adopt the new behavior now, use: 

      git config --global push.default simple

这里提到的 push.default 配置的 matching和simple是怎么回事？

matching 表示推送全部本地分支到远端仓库，simple表示仅仅推送当前分支过去。本地分支应该仅仅用于本地开发和测试，而不必发送到远程仓库，这样的话，会减少不必要的远程仓库负担。推荐使用simple配置。


==========带分支的仓库
然后我们为B 建立repo2作为工作目录和仓库。我们既然已经有了共享仓库，就可以直接从它克隆了。

    git clone repo.git repo2

然后，我们为repo2建立配置用户B

    cd repo2
    git config  user.name "b"
    git config  user.email "b@whatever.com"


我们切换到新目录，其查看内容
    cd repo2
    cat file1
输出：
    line1
    line2
    line3
    lineI
    lineII
    line4

说明工作目录的内容已经克隆过来。而仓库内的版本历史：

    git log --oneline
    7eca5ed m2
    44d1673 m1
    14fc453 r3
    c066c05 rIItodo
    0e39747 rItodo
    4a24cbb r2todo
    a66c6fe r1
说明版本历史是妥当的。

我们还可以查看远程仓库情况：
    git remote -v
    origin  /Users/lcjun/git/repo (fetch)
    origin  /Users/lcjun/git/repo (push)

输出说明，有一个名字为origin、位置在 /Users/lcjun/git/repo 的远程仓库，可以提取和推送。

以及分支情况如何？

     git branch
    * master
克隆出来的仓库，可以看到的只有一个分支。想要看到所有的分支可以加上-a参数:

     git branch -a
    * master
      remotes/origin/HEAD -> origin/master
      remotes/origin/master
      remotes/origin/roma
后面的三个分支，都是以remotes开头的，它们的含义就是指向了远程分支。此时，远程分支是可用的，只要checkout

    git checkout roma 
同样的分支命令，不需要加入-a，就可以看到roma分支，并且它已经成为当前分支：
    git branch
      master
    * roma


## 提交和传递修改到远程仓库

现在，我们让用户b做些修改并推送到共享仓库：

    echo line5 >> file1
    git commit -m"c1" -a
    git push 

## 拉取变化

用户A拉取变化

    git remote add origin /Users/lcjun/git/repo.git
    git pull origin master

    cat file1
    发现用户B的修改已经传递给用户A了。
