
========
大写字母A标志为added的缩写。

在查询状态是，A字母表示added。还有更多缩写：

    ' ' = unmodified
    M = modified
    A = added
    D = deleted
    R = renamed
    C = copied
    U = updated but unmerged

记忆这些字母的含义确实是一个记忆负担，但是熟练后可以大大降低眼球识别负担：只要一个字母就可以知道是什么状态。

现在，我们可以知道file1已经准备好提交了。

留意到一个重要的概念：stage。Git提交文件到仓库，不是直接提交，而是经由stage的。通过git-add把文件添加到stage。而git-commit提交的只能是已经处于stage状态的文件。


### 撤销操作

撤销操作可以把文件添加到暂存区这个操作撤销掉。使用 `git rm --cached <file>` 来撤销这个操作。

    $ git rm --cache file1 

如果你确实做了撤销，那么重新再执行一次添加到暂存区，以便继续接下来的命令。

#stash

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

1. 感觉http协议部分的内容，其中的目录安全好像可以不去做的。做了会更安全吗？需要在研究。

=====
从git看团队管理 8.41

我暂时忘掉SVN，为了Git而学习Git，以Linus的思维替代我的思维。然后我发现了如此深刻的人性洞察和简单的应对方法。linux的工作流使得git是显然必须的：

1. 自洽的、最少依赖的个人工作得到支持。1000多人的Linux开发团队是分布在世界各地的，使用git也就不必依赖中心服务器、不必需要很少的网络。就在自己的电脑上就有完整的仓库，可以做任何版本管理，除了分享代码。SVN显然是不合适的，因为单点故障大家甚至无法提交，更加无法开分支，这是无法忍受的。
2. 剔除害群之马很简单。如果Linus经过观察，发现有些程序员特别容易出漏子，那么封杀的办法就是不必拉取即可。实际上Linus就是这样干过。如果是SVN，就变成了撤销惹麻烦的开发者的账号或者限定他的访问范围，并且从仓库中移除麻烦的代码提交。就是说，封杀的方法在git而言，是不做某事即可，SVN是做一系列事情才可以。一正一反，大家可以体会一下。Linus喜欢前者，并且得心应手。这样的工作流程就避开了很多“政治”问题，让他的集成代码过程变得主动。
3. 可以使用信任网络。Linux太大了，不可能完全看完补丁代码的方式来识别信任，这个Linus曾经干过，最后的结果当然是放弃。如果发现有些程序员特别优秀，他只要选择拉取他们的实现。这些程序员也只是拉取他们信任的程序员的实现。这样的信任网络是可以层次化的，因此对应于1000多人的开发者来说，这样做确实可以通过分层的信任网络达成大规模的团队协作。如果是SVN，我不知道如何做可以更好
4.轻量的分支开销鼓励大量被使用。对于这样的团队，为了敏捷的迭代，如果有想法就分支（这样的开发隔离想法是很有价值的），那么在svn上分支是海量的并且全局的大家互相影响，因此是要命的。而对于Git总数当然是海量，但是每个人的分支都在自己的仓库内，不会影响到他人。且分支无需连接服务器，因此是飞速的。

所以，对于Linux团队来说，Git是必须的。特别是它的分布式，可以帮助建立信任网络，减少政治问题。它的设计，首先是关于人的，关于最佳的工作流程的、技术这是这些思想的完美载体。Linus不仅仅创建了Linux，也实际上管理着一个巨大的团队，做法就是用一套工具提供信任网络和少政治的工作流程，从而可以不管。说Linus是此团队的“仁君”，并非缪赞。想想混乱的现实世界，我确实对这个高手团队的管理方法感到敬佩。





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


