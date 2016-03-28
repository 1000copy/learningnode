
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