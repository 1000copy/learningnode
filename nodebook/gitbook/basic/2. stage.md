## 为何引入 stage ?

理想的一次提交（Commit）应该仅包含一个Feature或Bugfix。这样当需要解决bug，或者暂时回溯到某个版本的时候，才可以定位到你关心的代码，而不必理会和你不必关心的。这样的实践的反面是把多个feature和bugfix一股脑的放在一起提交，带来的问题是当你为了某个Bug或者feature而回溯到此Commit时，你发现你关心的修改和其他无关于你的修改都混合在一起，要分开是很困难的。因此，保持commit干净是重要的。

使用stage 可以把修改更好的细分为一个个的功能和bug修改，使得提交细化。

具体而言，stage可以让分批提交、分阶段提交成为可能。

1. 分批提交

比如修改了3个文件：file1,file2,file3。其中file1,file2是一个功能修改，file3是一个bugfix。那么：

git add file1,file2
git commit -m "feature 1"
git add file3
git commit -m "bugfix 2"

这样，就达成分批提交。

2. 分阶段提交

比如，修改了file，做了 git add file，对此文件做了一个快照； 然后继续修改。此时执行git commi 只会对第一次的快照进行递交，当前修改内容是不会提交的。


## 典型场景

之前演示的分批提交，仅仅演示到文件层面，而git提供了比文件还要细的颗粒度来做提交。就是说，哪怕是在一个文件内的多个修改也是可以分批提交的。最小的颗粒度，可以达到一行。git 称这样的修改为hunk

1. 开发功能A
2. 过程中发现有个小bug B，改动不大，顺手改掉
3. 功能完成了，先把B所属的修改集中起来，作为bugfix B，然后commit
4. 其他修改一起commit，作为feature A。

最后得到一个干净的历史。

echo line1 > file
echo line2 >>file
echo line3>> file
echo line4 >> file
git add file
git commit -m"init"

修改1 为了feature A

sed -i.bak 's/line1/lineI/g' file

修改2 为了Bug B 
sed -i.bak 's/line4/lineIIII/g' file

即使一个文件内的修改，也可以分开作为不同的commit。做法是使用git add -p 交互的提交，使用命令内提供的s选项，分解提交。

Stage this hunk [y,n,q,a,d,/,j,J,g,e,?]? s
Split into 2 hunks.
@@ -1,3 +1,3 @@
-line1
+lineI
 line2
 line3
// 仅仅提交第一个修改行，作为feature
Stage this hunk [y,n,q,a,d,/,j,J,g,e,?]? g 
 1:  -1,3 +1,3          -line1
 2:  -2,3 +2,3          -line4 

Stage this hunk [y,n,q,a,d,/,j,J,g,e,?]? g
  1:  -1,3 +1,3          -line1
  2:  -2,3 +2,3          -line4
go to which hunk? 1
@@ -1,3 +1,3 @@
-line1
+lineI
 line2
 line3
Stage this hunk [y,n,q,a,d,/,j,J,g,e,?]? y
@@ -2,3 +2,3 @@
 line2
 line3
-line4
+lineIIII
// 提交
$ git commit -m"feature A"
$git commit -m"bug b" 
$ git log git commit -m"bug b" 
[master 3e133e2] bug b
 1 file changed, 1 insertion(+), 1 deletion(-)


$ git log

commit 3e133e2afb029e6a7325d966710ab969e957f177
Author: 1000copy <1000copy@gmail.com>
Date:   Sun Mar 27 16:32:29 2016 +0800

    bug b

commit 122ec37d5c7f97870e494cb761fa7665a8b6b8cc
Author: 1000copy <1000copy@gmail.com>
Date:   Sun Mar 27 16:30:42 2016 +0800

    feature A

commit 402fb7220dda2c0e8d203ad1a56ae47d3dc27d2f
Author: 1000copy <1000copy@gmail.com>
Date:   Sun Mar 27 16:24:12 2016 +0800

    init

我们可以看到，一次修改确实变成了两次提交历史。

##实验：stage 概念的澄清


创建file2

    echo -en "line1\n" > file2 && cat file2 
    line1

添加

    $ git add file2
    $ git status -s
    M:   readme.txt

然后，再修改

    echo -en "line2\n" >> file2 && cat file2 
    line1
    line2

提交：

    $ git commit -m"stage testcase"
    [master d4f25b6] git tracks changes
     1 file changed, 1 insertion(+)

提交后，再看看状态

    $git status -s
    M:   file2

怎么还是修改状态? 第一个修改是提交到了暂存区，因此提交了，第二次修没有提交到暂存区，因此没有提交。

