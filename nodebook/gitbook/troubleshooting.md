## 在使用git push 时，总是提示：

    warning: push.default is unset; its implicit value is changing in 
    Git 2.0 from 'matching' to 'simple'. To squelch this message 
    and maintain the current behavior after the default changes, use: 

      git config --global push.default matching

    To squelch this message and adopt the new behavior now, use: 

      git config --global push.default simple

这里提到的 push.default 配置的 matching和simple是怎么回事？

matching 表示推送全部本地分支到远端仓库，simple表示仅仅推送当前分支过去。本地分支应该仅仅用于本地开发和测试，而不必发送到远程仓库，这样的话，会减少不必要的远程仓库负担。推荐使用simple配置。


## Error: Permission to user/repo denied to user/other-repo

$git push
remote: Permission to 1000copy/learningnode.git denied to 1000blog.
fatal: unable to access 'https://github.com/1000copy/learningnode.git/': The requested URL returned error: 403


This error occurs because of collision of github user account's, which means maybe someone else had access his github account and by mistake saved his password with your github details.

Now every time you try to push into a repo the github faces collision.

So the solution is. if you are a mac user

Open your launchpad and search keychain access.
Now remove your github credentials from keychain account.
Push to your repo and add your account details.

当我打开keychain access应用，发现确实有一个账号叫做1000blog的，不知道多久以前建立blog的时候用过的。

delete！

BINGO!