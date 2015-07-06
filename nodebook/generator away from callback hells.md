#译 用Generators解决callback金字塔

## what is generator

Generators算得上js的一个新概念函数。它看起来像是一个函数，但是可以暂停执行。从语法上看，有3点关注：

1. 函数名前有一个*
2. 函数内有yield
3. 调用时返回一个对象，对这个对象调用next才会继续执行


## 你的node支持generator了吗？

在node 0.11以上，对node必须加入--harmony 参数，即可支持：

        $ node --harmony
        > function *a(){}
        undefined
        >

看到undefined就说明支持了。如果不加参数，默认不支持。你会看到

        $ node
        > function *a(){}
        ...

###Generators in ES6

声明一个generator 是这样的：

        function* ticketGenerator() {}

如果想要 generator 提供一个值并暂停，那么需要使用yeild 关键字。yield 就像 return 一样返回一个值。和它不同的是，yield会暂停函数。

        function* ticketGenerator() {
          yield 1;
          yield 2;
          yield 3;
        }

我们做了一个迭代器，叫做 ticketGenerator. 我们可以和它要一个值，然后它返回1，然后暂停。依次返回2，3：

        var takeANumber = ticketGenerator();
        takeANumber.next(); 
        // > { value: 1, done: false }
        takeANumber.next(); 
        // > { value: 2, done: false }
        takeANumber.next(); 
        // > { value: 3, done: false }
        takeANumber.next(); 
        // > { value: undefined, done: true }

现在我们返回最大为3 ，不太有用.我们可以递增到无穷。无穷数列来了。

    function* ticketGenerator() {
      for(var i=0; true; i++) {
        yield i;
      }
    }
再来一遍：

    var takeANumber = ticketGenerator();
    console.log(takeANumber.next().value); //0
    console.log(takeANumber.next().value); //1
    console.log(takeANumber.next().value); //2
    console.log(takeANumber.next().value); //3
    console.log(takeANumber.next().value); //4

每次叠加，无穷枚举。这就有点意思了。

###干预yield返回值

除了可以枚举累加外， next() 还有第二种用法：如果你传递一个值给next，它会作为yield 语句的返回值。我们可以利用这个特性，把刚刚的无限数列做一次重置：

    function* ticketGenerator() {
      for(var i=0; true; i++) {
        var reset = yield i;
        if(reset) { i = -1; }
      }
    }

这样当我们调用next(true)的时候，i会等于-1，从而重设了i值到初始值。

无需困惑， yield i 会把i发到generator的调用next处，但是generator内部我们使用next提供的值（如果提供了的话）。

看看效果：

    var takeANumber = ticketGenerator();
    console.log(takeANumber.next().value); //0
    console.log(takeANumber.next().value); //1
    console.log(takeANumber.next().value); //2
    console.log(takeANumber.next(true).value); //0
    console.log(takeANumber.next().value); //1

这就是generator。古怪，有趣。接下来会继续分析它的应用，在解决callback hell方面。


###问题

拿一个案例开刀吧。我们来看一个delay函数，延迟一些时间，然后打印点文字：

    function delay(time, callback) {
      setTimeout(function () {
        callback("Slept for "+time);
      }, time);
    }
    
调用它也是常见代码：

    delay(1000, function(msg) {
      console.log(msg);
      delay(1200, function (msg) {
          console.log(msg);
        }
    })
    //...waits 1000ms
    // > "Slept for 1000"
    //...waits another 1200ms
    // > "Slept for 1200"
    
为了保证两次打印的次序，我们唯一的办法，就是通过callback来完成。

要是延迟多几次，比如12次，我们需要12次嵌套的callback，代码不段向右延伸。哇，回调金字塔。

###呼叫Generators

异步是node的灵魂。可是异步的麻烦在于callback，因为我饿每年需要等待完成通知，所以需要callback。

有了 generators,我们可以让代码等。无需callback。可以用generators 在每个异步调用进行中，在调用next()之前暂停执行。还记得yield/next 吗？这是generators的绝活。

###怎么弄？

我们首先得知道，我们要把异步调用暂停需要用到generator ，而不是典型的函数，所以加个星在函数前：

    function* myDelayedMessages() {
        /* delay 1000 ms and print the result */
        /* delay 1200 ms and print the result */
    }

加入delay调用。delay需要callback。这个callback需要调用generator.next(),以便继续代码。我们先放一个空的callback：

    function* myDelayedMessages() {
        console.log(delay(1000, function(){}));
        console.log(delay(1200, function(){}));
    }

现在代码依然是异步的。加入yield：

    function* myDelayedMessages() {
        console.log(yield delay(1000, function(){}));
        console.log(yield delay(1200, function(){}));
    }

又近了一步。但是需要有人告诉generator向前走，走起来。

关键概念在这里：当delay完成时，需要在它的callback内执行点东西，这些东西让generator向前走（调用next）

这个函数，且不管如何实现，我们知道它得叫做resume：

    function* myDelayedMessages(resume) {
        console.log(yield delay(1000, resume));
        console.log(yield delay(1200, resume));
    }

我们得把定义好的resume传递给 myDelayedMessages

###变魔术了...

如何实现resume，它又如何知道我们的generator?

给generator 函数加个外套，外套函数的功能就是启动generator，传递写好的resume，第一次拨动generator（调用next），等待resume被调用，在resume内继续拨动generator。这样generator就可以滚动起来了：

    function run(generatorFunction) {
        var generatorItr = generatorFunction(resume);
        function resume(callbackValue) {
            generatorItr.next(callbackValue);
        }
        generatorItr.next()
    }

有点烧脑。当年写作名噪一时的“goto statement considered harmful”的作者，看到此代码非得气死。这里没有一行goto，却跳来跳去的比有goto的还难。

注意哦，我们利用了next的第二个特性。resume 就是传递给callback 的函数，它因此接受了delay提供的值，resume传递这个值给 next, 故而 yield 语句返回了我们的异步函数的结果。异步函数的结果于是被console打印出来。就像“倒脱靴”。

代码整合起来：

    run(function* myDelayedMessages(resume) {
        console.log(yield delay(1000, resume));
        console.log(yield delay(1200, resume));
    })
    //...waits 1000ms
    // > "Slept for 1000"
    //...waits 1200ms
    // > "Slept for 1200"

就是这样。我们调用两次delay，按照次序执行，却没有callback的嵌套。如果要调用12次，也还是没有callback嵌套。如果你依然迷惑不解，我们再次分步来一遍》

 - run 以generator 为参数，并且内部创建了一个resume 函数
 - run 创建一个generator函数，传递resume给它
 - 然后run第一次调用next，启动了generator函数到yield
 - generator 遇到了第一个yield，并调用yield后的delay，然后暂停。
 - delay 在1000ms后完成，调用resume
 - resume 告诉generator 在走一步。并且传递delay的结果给run函数，由console 打印
 - generator 遇到第二个yield, 调用delay ，再次暂停
 - delay 在1200ms后完成，调用resume
 - resume 告诉generator 在走一步。并且传递delay的结果给run函数，由console 打印

###co 更好

上面谈到的做法，确实可以把异步改成同步了。可是并不太完美：比如resume显得比较突兀，在比如只能在callback返回一个值。不够通用。

这样的话，可以考虑TJ开发的co。连resume的声明和引用也省掉了。还是以delay为例:

        var co = require('co');
        function delay(time) {
          return function (callback){
            setTimeout(function () {//
              callback(null,"Slept for "+time);
            }, time);
          }
        }

        co(function *() {
          console.log(yield delay(1000))
          console.log(yield delay(1200))  
        })

为了和co适配，delay需要做些修改，去掉callback，返回一个带callback的函数，把计算结果通过callback传递出去。第一个参数依照node的规矩，留给err。

更绝。怪的不TJ被社区成为大神。

再来一个。readFile(file,callback），作为常见的异步函数如何修改？

        var co = require('co');
        function readFile(file){
          return function (callback ){
            var fs = require("fs")
            fs.readFile(file,callback)
          }
        }

        co(function *() {
          console.log(yield readFile("./app.js"))
        })

        //<Buffer 76 61 72 20 63 ... >



可是，readFile改造这样过工作，纯粹就是boilerplate ！所以，有人做了这样的工作。安装co-fs,就可以：

        co(function *() {
          var fs = require("co-fs")
          var js = yield fs.readFile('./app1.js', 'utf8')
          var files = yield fs.readdir('.')
          console.log(js,files)
        })

node.js真是玩梯云纵。以为已经很好了，还是有人在加入一把火。

所以，值得去npm看看，查找下co-打头的库，有1000+个，要不要独立出去:)：

        https://www.npmjs.com/search?q=co

###打个总结

成功。我们用generator替换了callback。我们这样做到的:

 - 创建一个run函数，以 generator 为参数, 并传递一个 resume 函数给它
 - 传递resume 函数，单步推动generator ，返回任何异步callback获得的值给run
 - 传递resume 作为异步调用callback . 这些异步函数一旦完成，就调用callback，因此就是调用resume。允许resume推动generator

generators替代“callback hell” 是否最佳是可争论的，但是这个练习可以帮助你理解到ES6的generators 和iterators 

原文：http://modernweb.com/2014/02/10/replacing-callbacks-with-es6-generators/
参考：

Harmony Generator, yield, ES6, co框架学习 - http://bg.biedalian.com/2013/12/21/harmony-generator.html
Koa, co and coruntine - Harmony - 前端乱炖 - http://www.html-js.com/article/1752
### fork me

fork me from :https://github.com/1000copy/learningnode/blob/master/nodebook/generator%20away%20from%20callback%20hells.md
