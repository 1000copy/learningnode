
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


