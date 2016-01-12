##分支 

之前讲到的东西，svn也是一样。这里讲到的branch，则是git的优势所在。就是同样做分支，git更快。

###重新初始化

    cd .. && rm -rf repo && mkdir repo  && cd repo && git init
    echo -en "line1\n" > file1
    $ git add file1
    $ git commit -m"master commit" -a file1

首先，我们创建dev分支，然后切换到dev分支：

    git checkout -b dev
    Switched to a new branch 'dev'

git checkout命令加上-b参数表示创建并切换。

###查看当前分支

    $ git branch
    * dev
      master

命令会列出所有分支，*号指示当前分支。

###做个修改

    echo -en "line2" >> file1 && git add file1 && git commit -m "branch commit"
    [dev a8042b5] branch commit
     1 file changed, 2 insertions(+)

现在，dev分支的工作完成，我们就可以切换回master分支：

    $ git checkout master
    Switched to branch 'master'

### 查看

    cat file1
    line1

那个提交是在dev分支上，并不影响master分支。


合并工作成果

    $ git merge dev
    Updating d17efd8..fec145a
    Fast-forward
     readme.txt |    1 +
     1 file changed, 1 insertion(+)

git merge命令用于合并指定分支到当前分支。

    $cat file1
    line1

合并完成。

###删除dev分支

    $ git branch -d dev
    Deleted branch dev (was a8042b5).

###查看branch

    $ git branch
    * master

就只剩下master分支了

##解决冲突

###准备新的 feature1 分支

    $ git checkout -b feature1
    Switched to a new branch 'feature1'

##修改

    echo -en "line1" > file1

###提交：

    $ git add file1 && git commit -m "line1"
    [feature1 6ec678c] line1
     1 file changed, 1 insertion(+), 3 deletions(-)

###切换到master分支：

    $ git checkout master
    Switched to branch 'master'
    Your branch is ahead of 'origin/master' by 1 commit.


###修改 

    echo lineone > file1 && git commit -m "lineone" -a
    [master 2cf0051] lineone
     1 file changed, 1 insertion(+), 3 deletions(-)


##合并冲突了

    $ git merge feature1
    Auto-merging file1
    CONFLICT (content): Merge conflict in file1
    Automatic merge failed; fix conflicts and then commit the result.

###查看内容
    cat file1
    <<<<<<< HEAD
    lineone
    =======
    line1
    >>>>>>> feature1

###修改、再提交

    $  echo lineone > file1 && git add file1 && git commit -m "conflict solved"
    [master c98d7b9] conflict solved


