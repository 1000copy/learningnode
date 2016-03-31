#撤销

我们所有对仓库、暂存（缓存）的修改，都是可以撤销的。就是说，本地的修改是可以撤销的；添加到暂存区的文件是可以撤销的；到仓库的提交时可以撤销的。因为我们可能犯错，比如文件改乱了希望重来、加入了本来该下一组功能的文件到暂存区等等。

# 撤销本地修改

丢弃本地（工作目录）的修改，可以使用git-checkout 命令。

我们加入一个文件到git内。留意每个git-init之前，都需要保证创建并进入一个空的目录。
    git init 
    echo line1 > file1
    git add file1
    git commit -m"initial"
提交后，再次修改：
    echo line2>> file1
使用：
    $git status -s
    M file1
可以验证已经修改。

随即发现这个修改是不必要的，或者改乱了，总之想要丢弃修改，重头再来，那么

    git checkout -- file1

使用“--”，是为了避免歧义，此符号的存在，只是之后的参数都是文件。对于git-checkout而言，如果没有此符号，后面的参数可以解释为分支名称，这是我们不希望的。

或者使用

    git checkout -- .

指示丢弃整个目录的所有修改。需要注意的是，这里的“." 指示为整个目录，是递归的。git add 命令内的“." 也是如此。我们可以通过实验验证此效果。

    git init 
    echo line1 > file1
    echo line1 > file2
    mkdir d1
    echo line1 > d1/file11
    git add .

然后可以通过 git status -s 发现输出为：

    A  d1/file11
    A  file1
    A  file2

说明"." 参数确实是可以加入当前目录内文件、以及递归当前目录内的所有目录内的文件的。
然后我们提交：
 
    git commit -m"init"
 
随后我们继续修改文件

    echo line2 >> file1
    echo line2 >> d1/file11

我们再次发现这个修改是不必要的，或者改乱了，总之想要丢弃修改，重头再来，那么

    git checkout -- .

执行  git status -s，发现没有任何输出，说明我们已经舍弃完成。


# 撤销加入缓存

git add file 之后，文件会被加入暂存区。想要撤销此暂存，可以使用git reset file。就是说，git reset file 是 git add file 的反向操作。

我们依然(一次又一次)的从文本行文件开始：

    echo line1 > file
    git add file 
    git status -s

可以看到输出
    A  file

表示文件已经加入暂存区。

此时我们如果需要撤销这个操作，只要如此：
    git reset file

使用 git status -s 可以看到

    ?? file
表示文件再次回到未跟踪状态。撤销add的操作已经完成。

如果有多个文件加入了暂存区，可以使用git reset（不指定文件参数）一次全部撤销：

    echo line1>file1
    echo line1>file2
    git add file1 file2
    git status -s

可以看到两个文件加入暂存区。

    A  file1
    A  file2

然后，我可以撤销全部文件的加入暂存区操作
    git reset
    git status -s

输出：
    ?? file1
    ?? file2
证明已经撤销。

# 撤销最近提交

即使文件已经提交到仓库也是可以撤销的。我们依然使用实验来验证。

我们还是使用文本行文件来说明问题：

    git init
    echo line1 > file1
    git add .
    git commit -m"r1" 
    echo line2 >> file1
    git commit -m"r2" -a
    echo line3 >> file1
    git commit -m"r3" -a

此时仓库内的file1内容为

    line1
    line2
    line3
我们可以使用命令来查看最后一个提交：
    git log --abbrev-commit --pretty=oneline -1
git log 命令之前我们使用过，这次的不同是多了一个-1参数，指定仅仅显示最近一次Commit。
输出类似：

    802e22b r3

此时我发现我犯了一个错误，提交的Line3是不合适的，我当然可以修改文件再次提交，但是我不希望此修改计入历史。此时，可以使用：

    git reset head^    
就可以把提交撤销。我们可以输入命令 git log --abbrev-commit --pretty=oneline -1 ，输出：

    8ae1a43 r2
说明第三次提交已经被撤销。而本地文件保持不变。你可以通过

    git diff

了解仓库内文件和本地文件的差异：

    @@ -1,2 +1,3 @@
     line1
     line2
    +line3

正如我们的期望，我们添加了line3，还没有提交。你可以修改后再次提交。

#总结

除了撤销本地修改使用git-checkout 之外，我们撤销加入暂存区、撤销提交都是使用git-reset子命令。git-reset 是一个强大的、容易令人困惑的命令。我们会专门介绍。




