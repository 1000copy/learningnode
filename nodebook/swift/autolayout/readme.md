自动布局技术就是基于约束的、描述性的的定位方法。

这个概念中的两个要点是：

1. 基于约束的
2. 描述性的

两者都是比较重要的，但是我们并不急着马上弄懂它。我们假设我们要在左下角放置一个按钮，和左边距为10，和下边距为10，那么，我们如何描述它的位置？一种方法是我们自己计算按钮的frame 位置。另外一种方法是我们描述位置关系，由 Autolayout 来计算对应的 frame。

自动布局（Autolayout）确实提供了一种表达两个视图的关系的公式。根据这些约束，Autolayout可以计算出视图的 frame 。

    Item1.property1 = Multiplier *  Item2.Property2 + Constant 

每个公式就是一个约束，它约束了两个视图的位置关系。在本案例的特定情况下，我们可以把按钮的位置描述为按钮视图和它的父视图的位置关系。两者分别为Item1 和 Item2，他们的关系公式可以描述为：

在水平方向上

    Button.X = 1 * ParentView.X + 10
    
在垂直方向上

    Button.Bottom = 1 * ParenetView.Bottom - 10

使用代码的话，表达此公式可以使用类 NSLayoutConstraint：

    import UIKit

    class DemoAutoLayout : UIViewController{
        override func viewDidLoad() {
            super.viewDidLoad()
            
            let newView = UIButton()
            newView.setTitle("Demo", forState: .Normal)
            newView.backgroundColor = UIColor.redColor()
            newView.translatesAutoresizingMaskIntoConstraints = false
            view.addSubview(newView)
            
            view.addConstraint(NSLayoutConstraint(item: newView, attribute: NSLayoutAttribute.Left, relatedBy: NSLayoutRelation.Equal, toItem: view, attribute: NSLayoutAttribute.Left, multiplier: 1, constant: 10))

            view.addConstraint(NSLayoutConstraint(item: newView, attribute: NSLayoutAttribute.Bottom, relatedBy: NSLayoutRelation.Equal, toItem: view, attribute: NSLayoutAttribute.Bottom, multiplier: 1, constant: -10))

        }
    }
    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate {

        var window: UIWindow?


        func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
            self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
            // Override point for customization after application launch.
            self.window!.rootViewController = DemoAutoLayout()
            self.window!.backgroundColor = UIColor.whiteColor()
            self.window!.makeKeyAndVisible()
            return true
        }
    }

NSLayoutConstraint 构建函数中：

item: 对应 公式的Item1
attribute: 对应公式内的 Property1，值为 NSLayoutAttribute.Left ，表明是左脚点的X坐标
relatedBy: 对应于公式中的等号，值为NSLayoutRelation.Equal
toItem: 对于于公式中的Item2 ，值为 view,就是按钮的父视图
attribute: 对应公式中的Item1 ，值为 NSLayoutAttribute.Left, 表明是左脚点的X坐标
multiplier: 对应公式中的 Multiplier，值为1
constant: 对应于公式中的 Constant ，值为 10

每个创建的约束，可以通过 view.addConstraint ，添加进来，用于计算视图的位置。translatesAutoresizingMaskIntoConstraints 必须为 false，这样此视图才能够使用 Autolayout 计算位置。

这样的看起来复杂的代码，价值在于可以适配多种设备，并且体现设计者的意图。只要按此约束设置完毕，那么不管是 iPhone还是iPad，是横屏还是竖屏，这个按钮都可以准确的被放置在左下角的位置。如果使用 frame，那么我们就必须在不同的设备的不同旋转位置就得自己去计算不同的 frame 位置。上面这段代码是可以运行的，我们不妨使用不同的仿真器，并且旋转它，查看我们的布局意图是否可以如期望的被实施。



