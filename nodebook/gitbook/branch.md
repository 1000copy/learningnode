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

两个分支修改同一行代码，那么在合并分支的时候，就会引发冲突。

修改文本文件内容，我准备使用sed命令。比如

    sed -i.bak  's/line1/lineI/' file1
就可以把Line1修改为lineI。对sed不熟悉的可以看附录，有介绍。


###准备新的 feature1 分支

    $ git checkout -b feature1
    Switched to a new branch 'feature1'

##修改

    echo -en "line1" > file1

###提交：

    $ git add file1 && git commit -m "line1"
    
###切换到master分支。修改文件内容，提交：

    $ git checkout master


    $ echo lineone > file1 && git commit -m "lineone" -a
    

##合并。冲突产生

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