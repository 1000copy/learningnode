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



##分支 

branch 是git的精华所在。我们依然3行代码文件的场景，但是假设这次我们得到了新的要求，就是更新代码行数字为罗马数字，就是说

    line1
    line2
    line3

最终要改成

    lineI
    lineII
    lineIII
这个修改，我们也分多次提交，并且采用分支开发。

### 创建分支

    
首先，我们创建dev分支，然后切换到dev分支：

    $git checkout -b roma
    
git checkout命令加上-b参数表示创建并切换。此时我们的当前分支不再是master，而是 roma。可以执行命令验证。我们看到两个分支名称

    $ git branch
    * dev
      master

命令会列出所有分支，*号指示当前分支。

# 修改代码，并提交


修改文本文件内容，我准备使用sed命令。比如

    sed -i.bak  's/line1/lineI/' file1
    
就可以把Line1修改为lineI。对sed不熟悉的可以看附录，有介绍。

    sed -i.bak 's/line1/lineI/g' file1 && rm -rf *.bak
    $ git add file1
    $ git commit -m"roma 1" 

###再做1次修改和提交

    $ sed -i.bak 's/line2/lineII/g' file1 && rm -rf *.bak
    $ git add file1
    $ git commit -m"roma 2" 

###再做1次修改和提交

    $ sed -i.bak 's/line3/lineIII/g' file1 && rm -rf *.bak
    $ git add file1
    $ git commit -m"roma 3" 

    
## 现在，roma 分支的工作完成，我们对修改做了测试，很满意，所以我们决定合并此分支的修改到主线上。

于是我切换回master分支：

    $ git checkout master
查看下文件，果然文件还是阿拉伯数字版本的，roma 的修改没有影响到主分支：

    $ cat file1

    line1
    line2

现在，我们合并roma 分支到master ：

    $ git merge roma

git merge命令用于合并指定分支到当前分支。在查看

    $cat file1

输出内容

    lineI
    lineII
    lineIII

表明罗马数字版本已经合并到主线。

工作已经完成，就可以做些必要的清理了，以为 分支remo已经合并到主线，此分支就不必留，可以删除它。使用git branch -d branchname 可以删除。

    $ git branch -d roma
    
使用

    $ git branch

可以看到仅仅剩下master 了。

    * master


##解决冲突

我们刚刚做的分支开发，仅仅有一个分支就是roma 在修改，因此合并的时候是非常轻松的，只要采用最新修改即可。

可是如果我们在分支时，两个分支都在修改，那么就可能发生冲突。比如这两个分支修改同一行代码，那么在合并分支的时候，就会引发冲突。我们依然以那个3行的代码文件为案例，来看看冲突的发生和解决。

假设当前文件内容为

    line1
    line2

然后一个分支把line2修改为lineII，而主干开发把line2修改为Two。然后两者合并，发生冲突。冲突的解决是手工修改代码，采用roma 分支的修改，去掉冲突，重新提交。

我们重新创建一个仓库后，再执行如下命令以便修改和提交代码，并且创建和切换分支,在此分支上修改阿拉伯数字为罗马数字：

    $ echo line1 > file1
    $ echo line2 >> file1
    $ git add file1
    $ git commit -m"commit 1" 
    git checkout -b roma

    sed -i.bak "s/line2/lineII/g" file1 && rm -rf *.bak

    git add file1
    git commit -m"roma 1"

在主干分支修改数字为英文单词

    git checkout master

    sed -i.bak "s/line2/lineTwo/g" file1 && rm -rf *.bak

    git add file1
    git commit -m"commit 2"
    

##合并。冲突产生

    $ git merge roma
    
输出内容是这样的：

    Auto-merging file1
    CONFLICT (content): Merge conflict in file1
    Automatic merge failed; fix conflicts and then commit the result.
冲突发生了。现在我们执行命令：

   cat file1

内容是这样的：

    line1
    <<<<<<< HEAD
    lineTwo
    =======
    lineII
    >>>>>>> roma

虽然看起来有些乱，但是我们知道知道 “<<<<<<<” 字符串和 “>>>>>>> ”之间为冲突区，就好办多了。在冲突区内，总是有一连串的等号“=======”分为两个部分，等号字符串之上为当前分支的修改内容，之下为另外一个分支修改的内容，这里就是roma。两个修改行的对比就知道他们修改的差异。我们解决冲突的方式就是手工修改中这个冲突区，改成我们本来希望的样子。

这里我们可以采用roma分支的修改，把其他的内容删除，调整文件为：

    line1
    lineII

然后再提交：

    git commit -m "conflict solved"
    
于是，冲突就解决了。

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



## 附录：sed 介绍。

1. man sed
2. http://askubuntu.com/questions/490763/add-edit-line-text-in-file-without-open-editor-linux-command


我不准备使用编辑器去编辑，而是依然使用命令行来做这样演示，好处是语义化，只要看命令就知道在做什么，不需要啰嗦的去讲操作过程（点击菜单1，在弹出的对话框内填写，点击确定...）。这个命令是sed。语法是：


    sed -i 's/oldstring/newstring/g' filename

解释:

    sed = Stream EDitor
    -i = in-place (i.e. save back to the original file)
    The command string:

    s = the substitute command
    original = a regular expression describing the word to replace (or just the word itself)
    new = the text to replace it with
    g = global (i.e. replace all and not just the first occurrence)
    file.txt = the file name

比如说

    sed -i 's/line1/lineI/g' file1

就可以把第一行代码从Line1改成LineI。在OS X上命令需要稍作修改：

    sed -i.bak  's/line1/lineI/' file1
因为OS X 要求inplace修改文件必须指定备份文件的扩展名。
