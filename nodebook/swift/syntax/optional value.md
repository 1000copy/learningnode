swift 语言有2个非常显眼并且特别的语法特性，分别是:

1. option value。表现为类型后或者变量后加入"?"
2. unwrapped。表现为类型后或者变量后加入"!"

这两个语法原因在以往的主流语言内是没有的。连起来放到稍大的程序内也是挺晕的。要说清楚它们，主要还是要对比没有引入此语法元素下，写的代码是怎么样；而有了它们后写代码有怎样的优化即可。

假设这样的伪代码场景：

	class person 
	{
	    var address: Address
	}
	class Address{
	  var street:string
	 }
	 var person: Person

 现在，我需要取得person对象所在的街道地址。怎么办？

因为每一个访问对象的属性都必须要考虑到它可能是nil，故而必须使用if首先判断nil，然后再去属性值。老办法就是
 
if person{
  if person.address {
     	let  s = person.address.street 
      }
   }

如果直接写 person.address.street 是不行的。因为nil的可能性，这段代码可能会抛出异常，或者直接崩溃。至少这样写是不安全的。

考虑到这样的代码其实非常多，以至于每次每个地方都需要使用if 保护，导致代码很冗余。现在有了swift的optional value，就可以简化了。

做法是，首先，你的变量声明加入? ,

	class person 
	{
	    var address: Address?
	}
	class Address{
	  var street:string
	 }
	 var person: Person?

然后，你的街道信息就可以这样来：

    let s = person?.address?.street 

加入? 的变量就是一个可选值（optional value)，语义上说，操作符?表示如果它所约束的变量为nil就停止执行并返回nil。因此如果person为nil，那么s等于nil，而不会导致运行时错误。依次类推。
不仅仅是取值，赋值也可以。我们看更多案例：


	person?.name = "doudou"              // 如果person不为nil，那么给name属性赋值，否则什么也不做。
	person?.congratulate()             //      如果person不为空，就调用  congratulate 方法，否则什么也不做。
	if var name = person?.name {  }     //这样的做法，叫做optional binding。这样如果person为nil，就不执行{}内的代码

懂了optional value,那么unwrapped 就容易了。没有加“?”的类型，就是必须有值的。如果你写这样的代码：

	class Person {
		var address: Address
	}

那么，它根本不对，因为编译不过去，提示：

????

你必须给address赋值，可以在当前变量声明处赋值，或者在构造函数内赋值。

????

那么如果，我编写了这样的函数使用了Person，等于是要求必须有值，那么Person?和它类型不匹配，如何传递进来。报错：

   func whatisyouradress(var person:Person)
   var p : Person?
   whatisyouraddress(p)

就是说，必须把Person?转为 Person类型。这就引入了unwrapped：可以在变量后附加一个!.

   func whatisyouradress(var person:Person){}
   var p : Person?
   whatisyouraddress(p!)

unwrapped 的过程就是转换一个可空类型为普通类型的过程。小心：如果转换过程失败，就是说可控类型的实际值是nil，那么代码直接停止运行。
