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


