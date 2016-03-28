## 记忆github密码的方法

git 可以通过设置 credential.helper 值来使用不同的存储设施保存远端仓库的访问用户名和密码。

在windows系统上，把 credential.helper设置为  wincred 即可（要求版本为1.7.9以上）

    git config --global credential.helper

在 mac 系统上，可以这样做:

    git config --global credential.helper osxkeychain

## git config reset ?

vim ~/.gitconfig