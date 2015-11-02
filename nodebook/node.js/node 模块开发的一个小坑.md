
导出函数时，你可以

     module.exports.foo = function (){}
        
也可以

    exports.foo = function (){}

后者可以少打几个字。对于追求简洁的人来说，这个小特性还是比较招人爱。

你可以设置整个module.exports 为一个函数

    module.exports = function (){}

可是，你却不可以这样：
    
    exports = function (){}
    
想知道原因的话，得假想每个module在装入时，有这样的一段代码

    var module = new Module(...);
    var exports = module.exports;

是v8在一个js文件内插入两个对象：exports ， module.exports，并让exports指向module.exports,这样，对exports属性的任何添加和修改，都会导致module.exports的添加和修改。

可是两者并非完全等效。因为对整个对象赋值的话，效果和我们期望的就不一样了。exports会指向我们的函数，而不再和module.exports有任何关系。然后真正会被V8导出的是module.exports，而不是exports。所以，exports的方式，根本不能整体导出一个没有放到属性中的函数。

真是恼人的不一致。

为此，有些人想到的方法，就是干脆连等：

    module.exports = exports = foo = function () {...}

这样的boilerplate ,常常可以在模块开发代码中看到，有点古怪，却自有它的道理:

		1. 可以导出此函数
		2. 随后可以用foo，或者exports引用函数

如果是引出多个函数，那么用exports更优，因为简洁：

		exports.foo = function(){}
		exports.bar = function(){}

