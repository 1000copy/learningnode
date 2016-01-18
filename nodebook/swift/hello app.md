## Swift App 引入

每次碰到新的 GUI 编程体系时，我总是有一个Hello 应用。它总是这样的：

1. 显示首页
2. 首页上一个按钮
3. 按钮事件后弹出一个对话页，显示点文字

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

点击执行，界面如我所愿。然后接着看代码分析：

1. 第一行，导入UIKit。UIKit是iOS SDK中的一个框架。做界面的话，必须要包含它的。
2. 第二行中自定义类 ViewController，继承自 UIViewController 。UIViewController 被称为视图控制器，顾名思义，它负责和管理视图：视图内的事件代码在这里编写；视图的构建在这里进行。那么什么是视图？抛开概念不谈，Button就是一个视图，整个页面也是一个视图，视图可以嵌套，比如Button 嵌套在页面内，页面就是它的父视图，而Button就是页面的子视图。
3. 再看 viewDidLoad 方法。这个方法表明视图已经成功加载，告诉程序员这个事实的目的，是为了让程序员有机会初始化自己的代码。我们这里就是插入Button 。
4. 视图初始化。首先通过UIButton() 构造函数创建一个Button的实例，然后通过.frame 设置相对父视图的位置和大小、设置背景色、设置Button文字、以及添加目标事件。添加目标事件中比较特别的是名为action的参数，指定的方法名字必须后面跟着一个”：“。切记。
5. 事件处理。可以使用 UIAlertController 创建一个对话视图。UIAlertController.addAction 方法可以为UIAlertController添加按钮和按钮的Touch 事件。于是我们涉及到了闭包
6. 闭包。在handle参数内后面的两个花括号之间，涉及到一个叫做闭包的语法。

	 { (action: UIAlertAction!) in
		            print("OK")    }

形如：

{ (paramter1,paramter2...) in statements }

效果类似这样的方法定义：

func foo (paramter1,paramter2){
  statements 
}

但是比普通函数有更多好处。比如：

- 精简
-  可以引用当前作用域内的变量

实际上，为了更好的理解闭包，我的做法是对比代码。给 OK 按钮加入的handler是闭包的，而给Cancel 加入的handler 则使用普通方法。

现在，我们感受到了第一个app的模样。也浅尝辄止的学习了视图控制器、闭包、Swift类、Swift 
方法定义、事件定义。我们也知道了UIKit是一个iOS的开发框架。
7. 留意 UIAlertAction!的“!”。这个符号放在类型后表示类型必须有值，否则停止运行。放置在变量后表示必须变量必须有值，否则停止运行,此过程被称为unwrapped。App内会大量使用这此语法特性。
7. 有时候“！”位置可以放置"?"，类型后放置？表示可以为nil，变量后放置？表示如果为nil，停止表达式求职，什么也不做。此语法被称为optional value。App内会大量使用此语法特性。

可以在这里下载现成的代码。位置： https://github.com/1000copy/appletech/blob/master/swift/nav/helloswift/doudou/ViewController.swift

## 两种创建UI的模式对比

回头看看xcode为我们生成的文件。除了ViewController.swift 之外，还有三个文件值得注意：

1.  AppDelegate.swift 。应用委托。再一次，委托是一个重要的概念。应用委托是应用的入口。代码首先执行到这里，可以在委托内重载启动代码application:didFinishLaunchingWithOptions: ，在这里做窗口初始化、变量初始化等工作。
2.  main.storyboard 。  主要故事版。点击此文件，在这里xcode可以提供功能，让界面的设计变得是可视化的。
3.  launch.storyboard 。启动故事版。启动后首先显示的一个页面，这个页面会随后自动消失，接着显示main.storyboard中定义的界面。

xcode 一口气给我们生成了两个 storyboard ，在官方文档中也推荐使用 storyboard  做 UI 设计。然而，我认为更好的方式是通过代码创建来。因为：

1. 代码在版本之间的重用性高。
2. 免得学习那些操作（点击、选菜单、选项等），并且这些操作在不同的版本升级通常都会变化。
3. 代码可以做到一切storyboard的工作。反之则不行。
4. 其实代码一点也不比典型的拖放控件的方式更麻烦。特别是有了 Autolayout 特性后。

所以，本书内我就是会这样做。

默认情况下，xcode 生成的代码模板使用的就是 storyboard。我们首先切断使用storyboard。打开helloswift 工程，打开AppDelegate.swift 文件，把启动方法替换为：


	 func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
	        self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
	        self.window!.rootViewController = ViewController()
	        self.window?.makeKeyAndVisible()
	        return true
	    }

就可以了。

然后，如果有洁癖，可以删除这两个默认创建的storyboard了。过程：

1.  在info.plist 去掉对storyboard 的关联。删除两个key ????。
2.  删除 main.storyboard 。  
3.  删除 launch.storyboard。

运行下试试。

##扩展

视图种类很多，完整的请GOOGLE: uikit user interface catalog 去查看官方文档。

框架的种类也很多，涵盖UI、Video、Image、Network等。我们也知道在iOS内，完整的类别可以GOOGLE: iOS frameworks ,查看官方文档。

我们使用到了TouchDown事件。同时还有更多的Touch事件。可以 GOOGLE: UIControl  Events

https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIControl_Class/index.html#//apple_ref/doc/constant_group/Control_Events




因为这篇文字的引发，要想把故事讲圆，就得把如下的话题列表做进一步展开：

1. 特别的语法特性
- 闭包
- unwrapped（解包）App内会大量使用这两个语法特性。可以让代码更加简洁和安全。
- optional value（可选值）
2. UIKit 重要视图介绍。很多很多内容。
- 容器类 NavigationController、PageController、TagController
- 视图类 Button 、Label、...
3. UIKit 事件介绍
4. ViewController ,MVC
5. Little and Completed App： Todo

而要真正的应用出炉，必然也需要的内容：

1. 网络
2. 本地存储
3. 设备事件
- 旋转
- 地理位置
- 震动
- 通知