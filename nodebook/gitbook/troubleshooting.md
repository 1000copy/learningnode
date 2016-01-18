
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