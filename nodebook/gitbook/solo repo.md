## 配置
    git config --global user.name "Your Name"
    git config --global user.email "your_email@whatever.com"

## 场景描述

每一篇技术文字，都需要一个简单的例子。它得够简单到不会加大理解的难度，也要够复杂以便可以建立模型。我们从一个假设代码开始。文件名为file1，我会每次添加一行，然后提交，最终文件为三行：

    Line1
    Line2
    Line3

藉由此案例，我们可以把常用的git命令走一遍，并建立对git的认知模型。

我创建和修改文件，并且： 

1. 创建一个版本仓库（Repo）
2. 提交修改到仓库` 

有了 Repo 和提交，魔法就来了：

1. 当你文件修改错的时候，可以回溯之前的版本。
2. 可以知道几次修改之间的变化所在。

这就是版本管理的价值。现在，我们通过实验，验证我们的观点。

##创建repo

在文件系统内创建一个目录（命名为 pot ）。把它作为你的工作目录。

    $ mkdir pot  && cd pot 
    $ git init
    
git 会提示 Repo 已经建立（repository)。

现在，我们就涉及到了两个概念:一个是工作目录，一个是版本仓库（以后我们简称它为repo）。你看，版本管理系统涉及到的术语并不复杂。

执行命令

    $ls -A
    .git

在此目录内建立一个.git 隐藏目录，这就是repo了。此目录用来存储全部的版本文件。 

### 创建测试文件file1，查看状态

    echo line1 > file1 

    git status -s 
    ?? file1

?? file1表示此文件还没有加入版本管理，处于未跟踪状态。

### 添加到暂存区

就是挑选文件，以便随后的命令commit会使用这个stage内的文件，把它们提交到版本仓库内。

    $ git add file1
    $ git status -s 
    A file1
大写字母A标志为 added 的缩写。现在，我们知道 
可以知道file1 已经准备好提交了。


### 可以做撤销操作。把文件添加到暂存区这个操作做撤销

要是发现添加文件到暂存区是错误的，那么可以使用 `git rm --cached <file>` 来撤销这个操作。

    $ git rm --cache file1 

如果你确实做了撤销，那么重新再执行一次添加到暂存区，以便继续接下来的命令。

###提交到仓库

    $ git commit -m"commit 1" 

-m后面输入的是本次提交的说明
输出文字说明：1个文件被改动，插入了两行内容


### 看了repo有什么

$ git log 

输出信息是类似如此：

    commit b4dbd0e9981c840cbc0fc13d0c852b36331cdf29
    Author: 1000copy <1000copy@gmail.com>
    Date:   Sat Mar 12 21:49:30 2016 +0800

    commit 1

可以通过log子命令来查看repo内已经有的版本。这里显示目前已经有一个版本（commit）。版本标识为 d2fe108e92df8d827f6ec237db85693dbd6a1eab，作者是1000copy <1000copy@gmail.com>等等。

然而，在单机工作的人来说，看到这些实在太冗余了。作者常常是一致的，而日期往往不是那么常用。幸好git-log命令可以显示更加美好的输出。如

    $ git log --abbrev-commit --pretty=oneline
    b4dbd0e commit 1

选项  --pretty=oneline 指示对每一个提交以单行显示。选项 --abbrev-commit 指示缩写Commit的SHA-1值。这个值默认使用七个字符，不过有时为了避免 SHA-1 的歧义，会增加字符数。通常 8 到 10 个字符就已经足够在一个项目中避免 SHA-1 的歧义。使用这个缩写可以引用对应的Commit。比如，我想要查看commit 1的修改，可以

    $ git show b4dbd0e


###为了验证更多的概念和尝试更多的命令，我们继续修改文件file1

    echo line2 >> file1 

然后查看差异

    $ git diff

可以查看输出：

    diff --git a/file1 b/file1
    index a29bdeb..f8be7bb 100644
    --- a/file1
    +++ b/file1
    @@ -1 +1,2 @@
     line1
    +line2
    \ No newline at end of file

可以看到，我们加入了一个新行line2

## 添加和提交

    $ git add file1
    $ git commit -m"commit 2" 
    

## 我继续添加代码，再加入1行。然后我发现这行代码不该写或者写乱了（这是常有的事儿），我想要撤销此工作。那么我可以使用git checkout 命令

    $ echo line3 >> file2 
    $cat file1
    line1
    line2
    line3

    此时代码文件file1内有三行代码

    $ git checkout -- file1
    $ cat file2
    line1
    line2

    git checkout 之后，回复到前一个版本，依然是两行代码。




## 标签

git 标签用于版本标记，比如发出版本1.0 后就可以打个标签，这样以后如果需要1.0当时的代码，可以checkout它出来，修改此版本的bug就比较容易了。

## 打一个新标签 

$ git tag v1.0

可以执行
    $ git tag

输出从而查看标签清单。

    v1.0

假设我们继续修改文件，并且提交

    echo line3 >> file1
    git add file1
    git commit -m"commit 3" 

正在修改的不亦乐乎，但是此时有客户反馈说使用的1.0有错，你得获得1.0的代码来修改，以便解决bug。那么就可以修改bug，比如把line1 修改为lineI：

    git checkout tags/v1.0
    git checkout -b bugfix
    sed -i.bak 's/line1/lineI' file1
    git add file1
    git commit -m"bug fix"

对 v1.0 的 bug 修改在分支bugfix内。如果测试通过，你完全可能会考虑把此分支的修改成果合并到主干上，而不必在主干上重复修改此bug ，那么就可以使用合并。

    git merge bugfix    
现在对bugfix的修改也同时反映到master上：

    $ cat file1
    lineI
    lineII
    line3


## 回到过去《需要实验验证》

某天，你的代码出现了bug，但是你不知道到底哪行代码惹出来的事儿，可是你之前的一个提交时对的。于是想回到那个提交看看代码的差别。那么可以使用git checkout <commit id>回到指定的版本。可以在指定的commit id出开出分支继续开发。commit id在哪里查询？使用 git log 。

当然，此时git总是提示你 

    HEAD detached at xxx

可以可以使用git checkout master ，重新回到主干，重新回到原来的开发点。



