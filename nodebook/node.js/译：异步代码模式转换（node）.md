作为传统的同步多线程服务器的备选，异步事件IO被很多企业评估。异步意味着开发者需要学习新模式，忘掉老模式。转换模式时需要忍受严重的大脑重新搭线，说不定电击疗法对此改变有帮助。

##重布线

利用node工作，最基础的是需要理解异步编程模式。我准备把异步代码和同步代码放在一起，对比的方式来学习新模式。案例都使用了fs模块，因为它同时实现了同步和异步的两种风格的库函数。

##回调

在node中，callback函数是异步事件驱动编码的基本构造块。它是作为参数传递给异步io操作的函数。它们在io操作完成后会被调用。比如fs模块的readdir()就是一个异步io函数，它第一个参数为目录名，第二个参数是一个callback 。当readdir()执行完毕，得到结果后，会调用这个callback，把结果经由callback的参数，传递给callback回调内。

##依赖代码和独立代码

下面的案例要读取当前目录的文件清单，打印文件名称，读出当前进程id。

同步版本：

        var fs = require('fs'),
            filenames,
            i,
            processId;
        
        filenames = fs.readdirSync(".");
        for (i = 0; i < filenames.length; i++) {
            console.log(filenames[i]);
        }
        console.log("Ready.");
        
        processId = process.getuid();

异步版本：

        var fs = require('fs'),
            processId;
        
        fs.readdir(".", function (err, filenames) {
            var i;
            for (i = 0; i < filenames.length; i++) {
                console.log(filenames[i]);
            }
            console.log("Ready.");
        });
        
        processId = process.getuid();

同步版本案例中，代码等待 fs.readdirSync() I/O 完成。和我们日常的代码类似。

打印文件名的代码是依赖于fs.readdirSync()的结果的，而获取进程id则独立于此输出。因此它们在新的异步版本代码内需要放到不同位置。规则是把依赖代码放到callback内，把独立代码放到原来的位置不动。

##次序

同步代码的标准模式是线性的，几行代码需要一个接一个的顺序执行，因为每一个依赖于上一行的输出。如下案例中，代码首先修改文件访问模式（类似unix chmod 命令）、然后重命名文件、然后检查被命名文件是否为符号链接。显然如果代码不能按次序执行；或者文件在模式被修改前被重命名；或者检查符号链接代码在文件被命名前完成；这些都会导致错误。

同步：

        var fs = require('fs'),
            oldFilename,
            newFilename,
            isSymLink;
        
        oldFilename = "./processId.txt";
        newFilename = "./processIdOld.txt";
        
        fs.chmodSync(oldFilename, 777);
        fs.renameSync(oldFilename, newFilename);
        
        isSymLink = fs.lstatSync(newFilename).isSymbolicLink();

异步：

        var fs = require('fs'),
            oldFilename,
            newFilename;
        
        oldFilename = "./processId.txt";
        newFilename = "./processIdOld.txt";
        
        fs.chmod(oldFilename, 777, function (err) {   
            fs.rename(oldFilename, newFilename, function (err) {
                fs.lstat(newFilename, function (err, stats) {
                    var isSymLink = stats.isSymbolicLink();
                });
            });
        });

异步代码中，这个代码的执行次序被翻译为嵌套的callback。fs.lstat 回调被嵌套在fs.rename 回调内，fs.rename 回调被嵌入到fs.chmod()回调内

##并行 Parallelisation

异步编码特别适合io操作并发的场景：代码执行不会被io调用所阻塞。多个io操作可以并行启动。

如下案例：一个目录的全部文件大小会被累加得到一个总计。使用同步代码每次迭代都需要等待io操作返回单一文件的大小。异步代码则可以启动全部io操作，无需等待输出。当io操作中的一个完成，callback就会被调用一次，文件大小会被累加。

同步

        var fs = require('fs');
        
        function calculateByteSize() {
            var totalBytes = 0,
                i,
                filenames,
                stats;
            filenames = fs.readdirSync(".");
            for (i = 0; i < filenames.length; i ++) {
                stats = fs.statSync("./" + filenames[i]);
                totalBytes += stats.size;
            }
            console.log(totalBytes);
        }
        
        calculateByteSize();

异步

        var fs = require('fs');    
        var count = 0,
            totalBytes = 0;
        
        function calculateByteSize() {
            fs.readdir(".", function (err, filenames) {
                var i;
                count = filenames.length;
        
                for (i = 0; i < filenames.length; i++) {
                    fs.stat("./" + filenames[i], function (err, stats) {
                        totalBytes += stats.size;
                        count--;
                        if (count === 0) {
                            console.log(totalBytes);
                        }
                    });
                }
            });
        }
    
        calculateByteSize();
    
同步代码是直截了当的，无需解释。

异步版本代码采用嵌套callback来保证调用次序，前节也已经提及。

有趣的地方在 fs.stat的回调函数内。它采用文件计数count作为完成条件。变量count初始化为文件总数，每次callback调用就递减一次，一旦count等于0就说明全部io操作完成，合计文件大小被计算完毕。

异步代码案例中还有一个有趣的特征：它使用了闭包。闭包是一个函数，它嵌入在另外一个函数内，并且内部函数能够访问了外部函数内声明的变量，哪怕外部函数已经执行完成。fs.stat()的callback就是一个闭包，因为它访问了在fs.readdir 的callback内声明的count ,totalBytes 变量，哪怕这个callback早就已经执行完毕也可以访问。闭包有自己的上下文，在这个上下文内可以把它要访问的变量放置进来。没有闭包的话，这两个变量就必须设置为全局变量。因为fs.stat()的callback函数没有任何可以放置变量的上下文。calculateBiteSize() 函数早早的就执行完毕也不能放置上下文，唯有全局的上下文还在。闭包就在这个场景下来救场的。在这样的场合下，使用闭包就可以不必使用全局变量了。


##代码重用

可以抽取回调函数为单独函数，可以达到代码重用的效果。

下面的同步代码案例，展示了一个countFiles函数，它可以返回给定目录的文件数量。

同步：

        var fs = require('fs');
        
        var path1 = "./",
            path2 = ".././";
        
        function countFiles(path) {
            var filenames = fs.readdirSync(path);
            return filenames.length;
        }
        
        console.log(countFiles(path1) + " files in " + path1);
        console.log(countFiles(path2) + " files in " + path2);

异步：

        var fs = require('fs');
        
        var path1 = "./",
            path2 = ".././",
            logCount;
        
        function countFiles(path, callback) {
            fs.readdir(path, function (err, filenames) {
                callback(err, path, filenames.length);
            });
        }
        
        logCount = function (err, path, count) {
            console.log(count + " files in " + path);
        };
        
        countFiles(path1, logCount); 
        countFiles(path2, logCount);
    

替代fs.readdirSync()为异步版本的fs.readdir()带来的一个效应，就是本来在同步版本代码中的一个封闭的函数countFiles，现在也被迫变成一个带有callback参数的异步函数。因为调用countFiles的代码依赖这个函数的结果，而结果唯有等到fs.readdir()执行完毕。这就导致了countFiles的结构调整：不是console.log()调用countFiles,而是countFiles调用readdir(),后者完成后调用console.log 。

##结论

本文强调了异步编程的基本模式。转换到异步编程模式并不是微不足道的。恰恰相反，你需要一些时间去习惯它。复杂的提升带来的回报是并行开发的复杂度戏剧化的被改善了。

Node的异步IO事件驱动模型，再加上灵动、易用性的JavaScript，Node.js 有机会把在企业应用市场打下一个烙印，特别是当在涉及到高度并行的Web2.0应用的子领域内。

