## Swift App 引入

每次碰到新的 GUI 编程体系时，我总是有一个Hello 应用。它总是这样的：

1. 首页
2. 首页上一个按钮，点击后弹出一个对话页，显示点什么

不管是Delphi、还是QT、C#，我都是这么干的。有了它的完成，就可以熟悉IDE，感觉下语言特点，过一下GUI独特的概念了。现在，我点Swift的名了。

首先，会有些操作工作。是的，烦人的事情总是无法完全避免：

1. 打开 xcode ，创建一个 Single View App 
2. 随便找个目录存放，随便取个名字（不过是练手，反正要删掉的）

xcode 会生成一组文件，我们首先关注的就是它生成的ViewController.swift ，打开后，把代码替换为：

	import UIKit
	
	class ViewController: UIViewController {
	
	    override func viewDidLoad() {
	        super.viewDidLoad()
	//        let button = UIButton(frame: CGRect(x: 10,y: 50,width: 200,height: 50))
	        let button = UIButton()
	        button.frame = CGRectMake(10,50,200,50)
	        self.view.addSubview(button)
	        button.backgroundColor = UIColor.blueColor()
	        button.setTitle("who am i ? ", forState: .Normal)
	        button.addTarget(self, action: "clickme:", forControlEvents: .TouchDown)
	    }
	    func clickme(sender:UIButton!){
	        let alert = UIAlertController(title: "Hi", message: "I am doudou", preferredStyle:.Alert)
	        // Closure
	        alert.addAction(UIAlertAction(title: "OK", style: .Default, handler: { (action: UIAlertAction!) in
	            print("OK")
	        }))
	        alert.addAction(UIAlertAction(title: "Cancel", style: .Default, handler:abcd))
	        presentViewController(alert, animated: true, completion: nil)
	    }
	    func abcd(action: UIAlertAction!) {
	         print("Cancel")
	    }
	}

点击执行，界面如我所愿。你也先运行下，感受下样子，然后接着看代码分析：

1. 第一行，导入UIKit。UIKit是iOS SDK中的一个框架。做界面的话，必须要包含它的。
2. 第二行中自定义类 ViewController，继承自 UIViewController 。UIViewController 被称为视图控制器，顾名思义，它负责和管理视图：视图内的事件代码在这里编写；视图的构建在这里进行。那么什么是视图？抛开概念不谈，Button就是一个视图，整个页面也是一个视图，视图可以嵌套，比如Button 嵌套在页面内，页面就是它的父视图，而Button就是页面的子视图。
3. 再看 viewDidLoad 方法。这个方法表明视图已经成功加载，告诉程序员这个事实的目的，是为了让程序员有机会初始化自己的代码。我们这里就是插入Button 。
4. 视图初始化。首先通过UIButton() 构造函数创建一个Button的实例，然后通过.frame 设置相对父视图的位置和大小、设置背景色、设置Button文字、以及添加目标事件。添加目标事件中比较特别的是名为action的参数，指定的方法名字必须后面跟着一个”：“。切记。
5. 事件处理。可以使用 UIAlertController 创建一个对话视图。UIAlertController.addAction 方法可以为UIAlertController添加按钮和按钮的Touch 事件。于是我们涉及到了闭包
6. 闭包。在handle参数内后面的两个花括号之间，涉及到一个叫做闭包的语法。

 { (action: UIAlertAction!) in
	            print("OK")
	        }

形如：

{ (paramter1,paramter2...) in statements }

效果类似这样的方法定义：

func foo (paramter1,paramter2){
  statements 
}

但是好处更多。比如：

1. 精简
2. 可以引用当前作用域内的变量 

实际上，为了更好的理解闭包，我的做法是对比。给 OK 按钮加入的handler是闭包的，而给Cancel 加入的handler 则使用普通方法。

现在，我们感受到了第一个app的模样。也浅尝辄止的学习了视图控制器、闭包、Swift类、Swift 方法定义、事件定义。我们也知道了UIKit是一个iOS的开发框架。

视图种类很多，完整的请GOOGLE: uikit user interface catalog 去查看官方文档。
框架的种类也很多，涵盖UI、Video、Image、Network等。完整的类别可以GOOGLE: iOS frameworks ,查看官方文档。

可以在这里下载现成的代码。位置： https://github.com/1000copy/appletech/blob/master/swift/nav/helloswift/doudou/ViewController.swift


