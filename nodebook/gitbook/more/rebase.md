## rebase 

git-rebase 命令可以把一个分支的提交移动到另外一个分支上。实际上，这样做也会发生合并，合并内容的效果等同于两个分支的合并(git-merge)。但是提交历史是不同的——因为，被rebase的分支历史就消失了，合并到指定的分支上。

## 构建实验环境

我们在master分支上做两次提交，然后创建并切换到roma分支，随后做两次提交，在切换回到master分支，做一次提交。

    git init 
    echo line1 > file1
    git add .
    git commit -m"r1"

	echo line2 >> file1
    git commit -m"r2" -a
    
    git checkout -b roma

    echo lineI > file1
    git commit -m"rI" -a

	echo lineII >> file1
    git commit -m"rII" -a

	git checkout  master

	echo line3 >> file1
    git commit -m"r3" -a

于是我们现在有了两个分支。我们现在来看rebase的效果。我们可以通过查看历史验证此结果：

    $ git log --oneline
    8913f15 r3
    7f3ad18 r2
    61a0a4f r1
    
    $ git checkout roma
    Switched to branch 'roma'
    
    Shawshank:git rita$ git log --oneline
    71cfc01 rII
    88270a2 rI
    7f3ad18 r2
    61a0a4f r1

执行：
    git checkout master
    git rebase roma


把当前分支 master 给 rebase 到 roma 上。此命令的提示信息极为冗长，不过目前我们只要关心其中一行：

    CONFLICT (content): Merge conflict in file1

我们依然遇到了冲突，当然冲突总是长成这幅样子：

    $cat file1
    <<<<<<< d2036f1e48274bceac1ee7d3f508ab17531c8a99
    lineI
    lineII
    =======
    line1
    line2
    line3
    >>>>>>> r3

现在我们解决冲突（为了方便我们直接写入合并后的新内容）:

    echo lineI   > file1
    echo lineII >> file1
    echo line1  >> file1
    echo line2  >> file1 
    echo line3  >> file1

然后加入此改变并继续rebase。
    git add file1
    git rebase --continue
    

这样，整个rebase 的过程完成。现在我们再来查看历史：

    git log --oneline
    80dfb59 r3
    d2036f1 rII
    353b3e8 rI
    f840aaf r2
    fb2453d r1

消息为r3的提交原来的父提交是r2，而现在，它的父提交变成了rII。就是说r3的父提交被改变了。这就是rebase的来历（或许叫reparent？算了，拿它理解问题是可以的，但是，还是让我们不要再添加术语的混乱了）。

当rebase两个分支的代码成果时，我们也会遇到合并代码的情况，这和git-merge是类似的。不同的是merge的历史会出现一个提交有多个父提交的情况，让历史提交显得有些混乱，特别是分支比较多的时候。git rebase会把的两个分支的历史变成一条单线，这样的历史是很多程序员喜欢的。









