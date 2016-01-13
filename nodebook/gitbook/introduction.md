## 配置
    git config --global user.name "Your Name"
    git config --global user.email "your_email@whatever.com"

## 实验：Git 引入 

现在我要写代码了。假设文件名为file1，内容经过多次修改，最终为三行（当然，我们只是演示git，所以文件很简单即可）：

Line1
Line2
Line3

那么我会去建立目录，创建文件，编辑修改。这些和一般的文件创建没有区别。

但是使用git，就需要多几步：

1. 创建一个版本仓库
2. 提交修改到仓库

好处是：

1. 当你文件修改错的时候，可以回溯之前的版本。
2. 可以知道几次修改之间的变化所在。

这就是版本管理的价值。现在，我们通过实验，验证我们的观点。

###创建repo

在文件系统内创建一个目录，repo。把它作为你的工作目录(work space)。

    $ mkdir repo  && cd repo && git init
    Initialized empty Git repository in /Users/lcjun/repo/.git/

意料之中，git说仓库已经建立（repository)。一个命令完成,我们就涉及到了两个概念:一个是工作目录，一个是版本仓库（以后我们简称它为repo）。你看，版本管理系统涉及到的术语并不复杂。

### 验证 repo

    $ls -A
    .git

在此目录内建立一个.git 隐藏目录，这就是repo了。此目录用来存储全部的版本文件。有了它，魔法开始。

###创建测试文件file1


    echo -en "line1" > file1 && cat file1
    line1

### 查看状态

    git status -s 
    ?? file1

?? file1表示此文件还没有加入版本管理，处于未跟踪状态。

### 添加到stage

这里做的工作，就是挑选文件，把它放到stage(驿站)内，随后的命令commit会使用这个stage内的文件，把它们提交到版本仓库内。

    $ git add file1

    或者

    $ git stage file1


### 查看状态

        $ git status -s 
        A file1

可以知道file1 已经加入stage（大写字母A标志为 added 的缩写）。


### 从stage移除

    $ git rm --cache file1 移除指定文件
    $ git reset 全部移除

A表示加入到stage，可以提交


###提交到仓库

    $ git commit -m"line1" -s
    [master (root-commit) fe2a6b9] line1
     1 file changed, 1 insertions(+)
     create mode 100644 file1

-m后面输入的是本次提交的说明
输出文字说明：1个文件被改动，插入了两行内容

### 看了repo有什么

$ git log
commit d2fe108e92df8d827f6ec237db85693dbd6a1eab
Author: liu chuan jun <1000copy@gmail.com>
Date:   Tue Jan 12 10:07:42 2016 +0800

    all
可以通过log子命令来查看repo内已经有的版本。这里显示目前已经有一个版本（commit）。版本标识为 d2fe108e92df8d827f6ec237db85693dbd6a1eab，作者是liu chuan jun <1000copy@gmail.com>等等。


### 来点概念

一个速成的git 仓库已经构建：repo已经创建、文件版本已被跟踪，版本已经可供查询。现在我们来点抽象的概念。计算机怪杰的命令表象下，肯定必须有思想啊。

留意到一个重要的概念：stage。git提交文件到仓库，不是直接提交，而是经由stage的。通过git add或者git stage把文件添加到stage。而git commit 提交的只能是已经处于stage的文件。

这个stage就像购物车，你拿到商品不是直接结订单，而是经由购物车，挑挑选选，然后去结账。 stage也是。本来是有驿站，或者驿站马车的意思。当然，它还叫index，还叫cache，使用一个新的词表达新的概念，使用stage比index和cached强，后两者过于含糊。由此可见，在计算机怪杰的心中，此处也是一片混乱，怎么方便怎么来的：）。无论如何，翻译成“暂存”是不科学的。驿站都要好很多。

有了stage，当然可以更容易的挑挑拣拣。你可以轻轻松松的完成这样的挑拣过程：

    我这次修改了file1,file2,file3，把它们全部加入stage进来(git add .)；哦，对了，file3尽管修改了，但是和file1，file2不同，前者是解决一个bug，后者是提供一个feature。这样的话，我为了以后查阅方便，应该分两次提交，把file3拿出来(git rm --cached file3)，把1,2作为feature big deal 提交，然后把file3拿进来(git add file3),提交为bug 001 。Congratulation ！搞定。 

这就是stage的价值。所以，git是鼓励你使用stage的。

然而，作为电脑怪杰，一切主张都可变通，一切规范都是障眼法。如果你知道你在做什么，他就不拦着你。它也会支持你忽略stage，直接commit。代价也不高就是加一个 -a 参数。只要你的文件是已经被跟踪的，就可以这样做，一步搞定。

前面提到在查询状态是，A字母表示added。还有更多缩写：

    ' ' = unmodified
    M = modified
    A = added
    D = deleted
    R = renamed
    C = copied
    U = updated but unmerged

这些魔术字母经过一段时间的使用后，内化为大脑的一个画面。于是，可以大大降低怪杰们的眼球识别负担，不必看单词，只要一个字母就可以知道是什么状态。

### 实验：把add和commit合并一步

修改文件

    echo -en "\nline2" >> file1 && cat file1
    line1
    line2
    
提交
    $ git commit -m"line2"  -a
    [master 239b523] line2
     1 file changed, 2 insertions(+), 1 deletion(-)

如果想要把add和commit合二为一，可以在commit命令后加入-a选项。


## 查看版本间差异

###再次修改

    echo -en "\nline3" >> file1 && cat file1

    line1
    line2
    line3
    

###查看情况

    $ git status -s
     M file1

被修改过了。

###查看差异

    $ git diff
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

    $ git add file2
    $ git status -s
    M:   readme.txt

##然后，再修改

    echo -en "line2\n" >> file2 && cat file2 
    line1
    line2

##提交：

    $ git commit -m"stage testcase"
    [master d4f25b6] git tracks changes
     1 file changed, 1 insertion(+)

## 提交后，再看看状态

    $git status -s
    M:   file2

怎么还是修改状态? 第一个修改是提交到了暂存区，因此提交了，第二次修没有提交到暂存区，因此没有提交。

## 为了方便，可以合并添加和和提交

    $ git commit -m"one step" -a
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
    $ git add file3
    $ git commit -m "add file3"

     1 file changed, 1 insertion(+)
     create mode 100644 file3

    $ $ git rm file3
    $ git commit -m "remove file3"
    [master d17efd8] remove file3
     1 file changed, 1 deletion(-)
     delete mode 100644 file3
 
    ls 

<<<<<<< HEAD
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
## 打一个新标签 

$ git tag v1.0
$ git tag
v1.0

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
