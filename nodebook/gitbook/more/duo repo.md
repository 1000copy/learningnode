## 多仓库

多仓库协作的最简单模式，就是两人协作。一个人一个仓库，它们可以经由一个共享仓库，彼此传递代码更新。为了简化问题，我们使用本地协议，在一台电脑上模拟两个用户和他们对应的两个仓库。

##实验环境

现在我们假设一个用户（User1）使用repo1，一个用户（User2）工作于repo2，它们有一个共享仓库repo，用户经过推送修改到此共享仓库，以便让另一个用户从此共享仓库拉取另外一个用户的修改。

我们首先创建一个有分支的仓库作为实验基础。首先建立并进入一个空目录。随后我们创建目录repo1作为原始仓库。并创建提交和两个分支。

    mkdir repo1
    cd repo1
    git init 
首先我们配置局部用户，仅仅用于repo1。

    git config  user.name "a"
    git config  user.email "a@whatever.com"

分支master，提交r1,r2 :

    echo line1 > file1
    git add .
    git commit -m"r1"

    echo line2 >> file1
    git commit -m"r2" -a

分支roma，提交rII,rII:

    git checkout -b roma

    echo lineI > file1
    git commit -m"rI" -a

    echo lineII >> file1
    git commit -m"rII" -a
切换分支到master，提交r3 
    git checkout  master

    echo line3 >> file1
    git commit -m"r3" -a

    git merge roma
手工合并
    echo line1 > file1 
    echo line2 >> file1
    echo line3 >> file1 
    echo lineI >> file1 
    echo lineII >> file1
提交m1，m2
    git commit -m"m1" -a
    echo line4 >> file1
    git commit -m"m2" -a

## 克隆一个共享仓库


    cd ..
    git clone --bare repo1 repo.git

这里的参数 --bare 指定克隆后的仓库仅仅用于共享，有了这个参数的主要差别就是克隆后的仓库是没有工作目录的。

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
    c066c05 rII
    0e39747 rI
    4a24cbb r2
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
