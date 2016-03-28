
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




###疑难

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


## 配置别名，会方便很多

    git config --global alias.co checkout
    git config --global alias.ci commit
    git config --global alias.st status
    git config --global alias.br branch
    git config --global alias.hist 'log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short'
    git config --global alias.type 'cat-file -t'
    git config --global alias.dump 'cat-file -p'

比如其中的hist，可以这样做。感受一下：

    git hist -2
    * e3265bb 2016-01-11 | add ok (HEAD -> master) [1000copy]
    * f38ef5a 2016-01-11 | add tag (origin/master, origin/HEAD) [1000copy]

现在，文件就从版本库中被删除了。



## 回到过去《需要实验验证》

某天，你的代码出现了bug，但是你不知道到底哪行代码惹出来的事儿，可是你之前的一个提交时对的。于是想回到那个提交看看代码的差别。那么可以使用git checkout <commit id>回到指定的版本。可以在指定的commit id出开出分支继续开发。commit id在哪里查询？使用 git log 。

当然，此时git总是提示你 

    HEAD detached at xxx

可以可以使用git checkout master ，重新回到主干，重新回到原来的开发点。

