## 实验：引入

创建repo，添加文件到暂存区，提交暂存区文件到repo。

涉及对象：

仓库（repo），暂存（stage），工作区（work space）

###创建repo

    mkdir repo  && cd repo && git init
    Initialized empty Git repository in /Users/lcjun/repo/.git/

### 验证

    $ls -A
    .git

多了一个.git的目录，提示表明仓库已经创建。它的物理存在形式是.git目录，此目录由git命令维护，全部版本信息都存储于此。
ls的 -A 指明所有文件包括隐藏文件。但是不显示特殊目录 “.”,“..”

###创建测试文件file1


    echo -en "line1" > file1 && cat file1
    line1

### 查看状态

    git status -s 
    ?? file1

?? file1表示此文件还没有加入版本管理，处于未跟踪状态。

### 添加到stage

    git add file1

### 查看状态

        git status -s 
        A file1

A表示加入到stage，可以提交


###提交到仓库

    git commit -m"line1" -s
    [master (root-commit) fe2a6b9] line1
     1 file changed, 1 insertions(+)
     create mode 100644 file1

-m后面输入的是本次提交的说明
输出文字说明：1个文件被改动，插入了两行内容

### 修改文件，然后再次提交

修改文件

    echo -en "\nline2" >> file1 && cat file1
    line1
    line2
    
提交
    git commit -m"line2"  -a
    [master 239b523] line2
     1 file changed, 2 insertions(+), 1 deletion(-)

如果想要把add和commit合二为一，可以在commit命令后加入-a选项。


## 再次修改

    echo -en "\nline3" >> file1 && cat file1

    line1
    line2
    line3
    

###查看情况

    $ git status -s
     M file1

被修改过了。

###查看具体差异

    git diff
    diff --git a/file1 b/file1
    index 83db48f..84275f9 100644
    --- a/file1
    +++ b/file1
    @@ -1,2 +1,3 @@
     line1
    -line2
    \ No newline at end of file
    +line2
    +line3
    \ No newline at end of file


 
可以看到，我们加入了一个新行line3


##实验：stage 概念的澄清


## 创建file2

    echo -en "line1\n" > file2 && cat file2 
    line1

##添加

    git add file2
    git status -s
    M:   readme.txt

##然后，再修改

    echo -en "line2\n" >> file2 && cat file2 
    line1
    line2

##提交：

    git commit -m"stage testcase"
    [master d4f25b6] git tracks changes
     1 file changed, 1 insertion(+)

## 提交后，再看看状态

    $git status -s
    M:   file2

怎么还是修改状态? 第一个修改是提交到了暂存区，因此提交了，第二次修没有提交到暂存区，因此没有提交。

## 为了方便，可以合并添加和和提交

    git commit -m"one step" -a
    [master c8bb42a] one step
     1 file changed, 1 insertion(+)

-a 等于先执行add命令，然后commit

##撤销修改

##添加行

    $ echo line3>> file2 && cat file2
    line1
    line2
    line3

    $ git checkout -- file2

把readme.txt文件在工作区的修改全部撤销，这里有两种情况：
一种是readme.txt自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；
一种是readme.txt已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。
总之，就是让这个文件回到最近一次git commit或git add时的状态。

##验证

    $ cat file2
    line1
    line2

文件内容果然复原了。

##删除文件 

先添加一个新文件test.txt到Git并且提交：

    echo something >>file3
    git add file3
    git commit -m "add file3"

     1 file changed, 1 insertion(+)
     create mode 100644 file3

    $ git rm file3
    $ git commit -m "remove file3"
    [master d17efd8] remove file3
     1 file changed, 1 deletion(-)
     delete mode 100644 file3
 
    ls 

现在，文件就从版本库中被删除了。

##分支
###重新初始化

    cd .. && rm -rf repo && mkdir repo  && cd repo && git init
    echo -en "line1\n" > file1
    git add file1
    git commit -m"master commit" -a file1

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

###疑难

为何Git不能一次被文件提交，而需要分两步（add，commit）？

因为commit可以一次提交很多文件，所以你可以多次add不同的文件，就是为了选择文件时可以更加灵活。比如：

    $ git add file1.txt
    $ git add file2.txt file3.txt
    $ git commit -m "add 3 files."
