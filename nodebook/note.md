极简的 NodeJS npm 模块开发


如何完成一个NPM模块？

动手实验，照着弄，完了就懂了。

因为过程中要常常用到命令行，所以，顺手推荐下cmder ，给windows的用户替代cmd。有了它日子会幸福很多。

### 再来一个helloworld，反正世界上已经很多。

    mkdir hellopack
    cd hellopack
    λ type con: >hello.js

    exports.hello = function ( name ) {
        return  "Hello " + name ;
    }
    ^Z

### 创建打包文件

    λ type con: >package.json
    {
            "name": "hello",
            "version": "0.0.1",
            "main": "hello.js"
    }

    ^Z

### 测试安装

    cd ..
    npm install packdemo/
    λ ls node_modules\hello
    hello.js package.json 

  说明：npm install 就是拷贝目录到node_module 的一个目录。当然package.json 做了些耐人寻味的修改

    diff hellopack\package.json node_modules\hello\package.json

    1,5c1,11
    <  {
    <     "name": "hello",
    <     "version": "0.0.1",
    <     "main": "hello.js"
    <   }
    \ No newline at end of file
    ---
    > {
    >   "name": "hello",
    >   "version": "0.0.1",
    >   "main": "hello.js",
    >   "readme": "ERROR: No README data found!",
    >   "_id": "hello@0.0.1",
    >   "scripts": {},
    >   "_shasum": "0d23e155b4a222c8f8496b9c01c9cb9403d1fe2c",
    >   "_from": "packdemo",
    >   "_resolved": "file:packdemo"
    > }


  注意: 目录的名字就是package.json内的name，而不是你的开发目录名。

  而js文件则是照着拷贝：

    diff node_modules\hello\hello.js packdemo\hello.js
    (无输出)

  
### 验证包安装。留意直接写包名即可，不需要指定位置

    λ node
    > var a = require("hello")
    undefined
    > a
    { hello: [Function] }
    > a.hello(1)
    'Hello 1'

  

### 发布到npm  - 注册帐号

    λ npm adduser
    Username: name 
    Password:
    Email: mail@gmail.com

### 发布到npm  - 发布

    cd hello
    npm publish 

### 发布成功了吗？
  
   https://www.npmjs.com/search?q=hello

  有啊，还很多。