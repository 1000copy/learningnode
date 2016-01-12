## 记忆github密码的方法

git 可以通过设置 credential.helper 值来使用不同的存储设施保存远端仓库的访问用户名和密码。

在windows系统上，把 credential.helper设置为  wincred 即可（要求版本为1.7.9以上）

	git config --global credential.helper

在 mac 系统上，可以这样做:

	git config --global credential.helper osxkeychain

我使用的git来自这里：  https://git-for-windows.github.io/ 。本来之前使用的cmder自带的git版本也是> 1.7.9 的，但是就是无法保存，总是在我push的时候提示我输入凭据。此问题未解决。

## git config reset ?

vim ~/.gitconfig

## troubleshooting

## 在使用git push 时，总是提示：

	warning: push.default is unset; its implicit value is changing in 
	Git 2.0 from 'matching' to 'simple'. To squelch this message 
	and maintain the current behavior after the default changes, use: 

	  git config --global push.default matching

	To squelch this message and adopt the new behavior now, use: 

	  git config --global push.default simple

这里提到的 push.default 配置的 matching和simple是怎么回事？

matching 表示推送全部本地分支到远端仓库，simple表示仅仅推送当前分支过去。本地分支应该仅仅用于本地开发和测试，而不必发送到远程仓库，这样的话，会减少不必要的远程仓库负担。推荐使用simple配置。


http://stackoverflow.com/questions/13148066/warning-push-default-is-unset-its-implicit-value-is-changing-in-git-2-0 

