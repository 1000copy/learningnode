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
