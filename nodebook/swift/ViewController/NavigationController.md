## UINavigationController

UINavigationController 是一个特殊的视图控制器，实现了层次化内容的导航。一本书就是一个层次化导航的案例。它可以从章到节到段落，层层递进，也可以反向过来，层层退出。

UINavigationController 会在UI上方占据一个条形区域，此条形区域被称为导航条（Navigation Bar）,它被保留用于显示当前层次UI的title，以及导航按钮。UINavigationController 类提供两个方法用于层次导航：

1. pushViewController(animated: )用于向下导航
2. popViewControllerAnimated(animated:)用于向上导航。

每一个层次可以使用一个定制的ViewController 来管理显示内容。

我们将编写一个演示目的的app，以便进一步厘清以上内容。界面截图的首页如下：

![navigationcontroll](navigationcontroll.png)

创建了swift 的Single Page App 后，打开 AppDelegate.swift ,删除全部原有代码，替换为一下代码，即可执行查看效果。

## 代码

    import UIKit

    class Level1: UIViewController {
        override func viewDidLoad() {
            super.viewDidLoad()
            navigationItem.title = "Level 1"
            let btn = UIButton()
            btn.frame = CGRectMake(10,100,100,100)
            btn.setTitle("Push", forState: .Normal)
            btn.addTarget(self, action: "drill:", forControlEvents: .TouchDown)
            self.view.addSubview(btn)
        }
        func drill(sender: UIButton!){
            self.navigationController!.pushViewController(Level2(), animated: true)
        }
    }

    class Level2: UIViewController {
        override func viewDidLoad() {
            super.viewDidLoad()
            navigationItem.title = "Level 2"
            let btn = UIButton()
            btn.frame = CGRectMake(10,100,100,100)
            btn.setTitle("Pop", forState: .Normal)
            self.view.addSubview(btn)
            btn.addTarget(self, action: "pop:", forControlEvents: .TouchDown)
        }
        func pop(sender: UIButton!){
            self.navigationController!.popViewControllerAnimated(true)
        }
    }


    class Nav : UINavigationController{
        override func viewDidLoad() {
            super.viewDidLoad()
            let  p = Level1()
            viewControllers = [p]
        }
    }
    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate {
        static var Delegate:AppDelegate{
            return UIApplication.sharedApplication().delegate as! AppDelegate
        }
        var nav :Nav?
        var window: UIWindow?
        func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
            self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
            nav = Nav()
            self.window!.rootViewController = nav
            self.window?.makeKeyAndVisible()
            return true
        }
    }

## 代码说明

1. 在类 AppDelegate 内，设置 self.window!.rootViewController  为 Nav 的实例。
2. Nav 继承自 UINavigationController ，此类正是我们代码要演示的主题，即 UINavigationController的使用。它的 viewDidLoad 方法内，载入第一层的 ViewController ，就是Level1 类，一个继承自 UIViewController 的类。
3. Level1 类视图内有一个按钮，点击此按钮，会使用  UINavigationController 提供的 pushViewController(animated: ) 载入类 Level2 的实例，作为第二层导航的 ViewController。
4. Level2 类视图内有一个按钮，可以点击此按钮，执行 UINavigationController 提供的 popViewController(animated: ) ，退回到上一层导航。默认情况下，我们可以看到第二层导航视图的左上角有一个文字为 “<Level1” 的按钮，点击它一样可以退回到上一层，它是由 UINavigationController 默认添加的。
5. 每个层级的导航 ViewController 都可以设置导航的title。通过修改  navigationItem.title 即可完成。此title显示于导航条的中间位置。





