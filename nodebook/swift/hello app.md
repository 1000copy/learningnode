## Swift App 引入

每次碰到新的 GUI 编程体系时，我总是会从编写一个 Hello 应用开始。它总是这个模样的：

1. 显示首页
2. 首页上一个按钮
3. 按钮事件后弹出一个对话页，显示点文字

完成后我就可以熟悉下IDE，感觉下语言特点，过一下GUI独特的概念了。现在，我点Swift的名了。

首先，会有些操作工作。是的，烦人的事情总是无法完全避免：

1. 打开 xcode ,点击左下角的 Create a new xcode project
2. 在首页（Choose a template for your new project) 选择创建一个 Single View Application
3. 第二页（Choose options for your new project )内的 Product Name 随便给个名字（看你喜爱就好），其他都用默认值，但是记得Language一定选择Swift，并且去掉勾选 Core Data。
4. 第三页 选择一个目录存放你的工程。这个你自己决定，反正我给出的代码，你玩够了都可以删除的。 

完成。

整个创建过程是比较啰嗦的，幸运的是我们只需要学习这一次。因此本书之后任何的一个案例无任何特殊说明的话，都是使用一样的创建过程。

xcode 会生成一组文件，我们首先关注的就是它生成的 ViewController.swift 。打开此文件，把代码替换为：

	import UIKit
	
	class ViewController: UIViewController {
	
	    override func viewDidLoad() {
	        super.viewDidLoad()
	        let button = UIButton()
	        button.frame = CGRectMake(10,50,200,50)
	        self.view.addSubview(button)
	        button.backgroundColor = UIColor.blueColor()
	        button.setTitle("who am i ? ", forState: .Normal)
	        button.addTarget(self, action: "clickme:", forControlEvents: .TouchDown)
	    }
	    func clickme(sender:UIButton!){
	        let alert = UIAlertController(title: "Hi", message: "I am message", preferredStyle:.Alert)
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

## 回顾

回头看看xcode为我们生成的文件。除了ViewController.swift 之外，还有三个文件值得注意：

1.  AppDelegate.swift 。应用委托。委托是一个重要的概念。应用委托是应用的入口。代码首先执行到这里，可以在委托内重载启动代码application:didFinishLaunchingWithOptions: ，在这里做窗口初始化、变量初始化等工作。
2.  main.storyboard 。  主要故事版。点击此文件，在这里xcode可以提供功能，让界面的设计变得是可视化的。
3.  launch.storyboard 。启动故事版。启动后首先显示的一个页面，这个页面会随后自动消失，接着显示main.storyboard中定义的界面。
4. info.plist 。是 Information Property List Files 的缩写，一个文本文件，内置基本配置信息。可以用来使用 Main storyboard file base name 来指定主要故事版的文件名称。

xcode 一口气给我们生成了两个 storyboard ，在官方文档中也推荐使用 storyboard  做 UI 设计。看得出来 ，可视化设计是iOS开发的推荐方案。

##两种创建UI的模式对比

然而，我认为更好的方式是通过代码创建来。因为：

1. 代码在版本之间的重用性高。
2. 免得学习那些操作（点击、选菜单、选项等），并且这些操作在不同的版本升级通常都会变化。
3. 代码可以做到一切storyboard的工作。反之则不行。
4. 其实代码一点也不比典型的拖放控件的方式更麻烦。特别是有了 Autolayout 特性后。

所以，本书内我就是会这样做。大部分情况下，我都会使用之前提到的创建工程过程，完成操作后，直接从ViewController.swift 开始我们的代码编写过程。

## 根除 storyboard 

因此，我一般并不管 storyboard 。我不在乎它们的存在，也不会因为它们的存在而使用它们，我只是忽略它们。

但是如果你有洁癖，可能根本不想容忍一个并不起到实际作用的元素存在于自己的工程中的话，那么，这也是可以做到的：

1.  在info.plist 去掉对storyboard 的关联。删除两个key 名字为 ：Main story board file base name ,Launch screen interface file base name 的条目。
2.  删除 main.storyboard 文件。  
3.  删除 launch.storyboard 文件。
3.  自己创建 ViewController 。
打开helloswift 工程，打开AppDelegate.swift 文件，把启动方法替换为：

	 func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
	        self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
	        self.window!.rootViewController = ViewController()
	        self.window?.makeKeyAndVisible()
	        return true
	    }

也就是说，如下的代码作为 appdelegate.swift 内容，在执行效果上等同于使用 xcode 的 Single Page Application 生成的一组代码文件的效果：

	
	import UIKit

	class ViewController : UIViewController {
	    override func viewDidLoad() {
	        super.viewDidLoad()
	    }
	}

	@UIApplicationMain
	class AppDelegate: UIResponder, UIApplicationDelegate {
	    var window: UIWindow?
	    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
	        self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
	        self.window!.rootViewController = ViewController()
	        self.window?.makeKeyAndVisible()
	        return true
	    }
	}

可以自己对比下自动生成的代码，和纯粹使用代码的方式，哪种风格是你更加喜欢的。


