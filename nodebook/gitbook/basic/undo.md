## 撤销本地修改

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


#git reset 

git add <file> 之后，文件会被加入暂存区。去过想要撤销此暂存，可以使用git reset <file>。就是说，git reset  <file>是 git add  <file> 的反向操作。

#实验

echo line1 > file
git add file 
git status -s
可以看到输出
A  file
表示已经加入暂存区

此时我们如果需要撤销，可以
git reset file
git status -s
可以看到

?? file
表示文件再次回到未跟踪状态。撤销add的操作已经完成。
#实验，reset all

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
证明已经撤销


----------
然而，git推荐的add 撤销命令是
  git reset HEAD -- <file> 
略奇怪。HEAD是啥，“--” 是啥？
所以，我们回头去看reset子命令的语法形式：

git reset [mode] [<commit>] 
mode:  [--hard|soft|mixed|merge|keep]

此子命令的语义，是将当前的分支重设到指定的<commit>或者HEAD，并且根据[mode]有可能更新index和working directory。mode的取值可以是hard、soft、mixed、merged、keep。

第二个参数（HEAD)，可以指定任何Commit，如果不写，默认就是HEAD 。即最新的一次提交。我们之前的git reset file 就是省略了Commit的。git推荐些HEAD ,其可能是良苦用心，但我没有懂。

git reset 有是三种形式，其实为：

  git reset [-q] [<tree-ish>] [--] <paths>…​
  
This form resets the index entries for all <paths> to their state at <tree-ish>. (It does not affect the working tree or the current branch.)

-------------
What does tree-ish mean in Git?
http://stackoverflow.com/questions/4044368/what-does-tree-ish-mean-in-git


