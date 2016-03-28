
## 回到过去《需要实验验证》

某天，你的代码出现了bug，但是你不知道到底哪行代码惹出来的事儿，可是你之前的一个提交时对的。于是想回到那个提交看看代码的差别。那么可以使用git checkout <commit id>回到指定的版本。可以在指定的commit id出开出分支继续开发。commit id在哪里查询？使用 git log 。

当然，此时git总是提示你 

    HEAD detached at xxx

可以可以使用git checkout master ，重新回到主干，重新回到原来的开发点。

