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
