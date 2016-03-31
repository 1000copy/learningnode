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



## 回到过去《需要实验验证》

某天，你的代码出现了bug，但是你不知道到底哪行代码惹出来的事儿，可是你之前的一个提交时对的。于是想回到那个提交看看代码的差别。那么可以使用git checkout <commit id>回到指定的版本。可以在指定的commit id出开出分支继续开发。commit id在哪里查询？使用 git log 。

当然，此时git总是提示你 

    HEAD detached at xxx

可以可以使用git checkout master ，重新回到主干，重新回到原来的开发点。

