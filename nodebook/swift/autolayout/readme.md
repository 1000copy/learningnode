自动布局技术就是基于约束的、描述性的的布局方法。

这个概念中的两个要点是：

1. 基于约束的
2. 描述性的

两者都是比较重要的，但是我们并不急着马上弄懂它。我们先从一个案例开始。

假设我们要在左下角放置一个按钮，和左边距为10，和下边距为10，那么，我们如何描述它的位置？

一种方法是我们自己计算按钮的frame 位置。这在iPhone 设备是固定尺寸的年代还是行得通的，因此我们只需要计算横屏和竖屏两种情况。现在不妨想想iPhone目前(iPhone 6s Plus)情况下的屏幕大小、分辨率（Retina)、横屏的组合情况。有点头大。

另外一种方法是我们只是使用约束来描述视图间的位置关系，而由 Autolayout 来计算对应的 frame。

自动布局方法（Autolayout）提供了一种表达两个视图的位置关系的公式。

    Item1.property1 = Multiplier *  Item2.Property2 + Constant 

每个公式就是一个约束，它了两个视图的位置关系。在本案例的特定情况下，我们可以把按钮的位置描述为按钮视图和它的父视图的位置关系。两者分别为Item1（Button） 和 Item2 （Parent
View)，他们的关系公式可以描述为：

在水平方向上

    Button.X = 1 * ParentView.X + 10
    
在垂直方向上

    Button.Bottom = 1 * ParenetView.Bottom - 10

## 通用代码实现

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

尽管看起来复杂，但是这样分解后，我们发现其实布局代码还是可读的。比如说：

    NSLayoutConstraint(item: newView, 
        attribute: NSLayoutAttribute.Left, 
        relatedBy: NSLayoutRelation.Equal, 
        toItem: view, 
        attribute: NSLayoutAttribute.Left, 
        multiplier: 1, 
        constant: 10)
就可以读作：
    视图 newView 的 X值等于 View 的X值乘1再加上10

## 代码可读性优化方法： VFL

因为通用的原因，以上的代码至少看起来还是比较复杂的。不过 Autolayout 也提供了一种被称为 Visual Format Language （缩写为 VFL ）的方式。以字符串的方式，尽可能比较形象的表达布局。还是以此按钮的布局为例，等价代码为：

    import UIKit

    class DemoAutoLayout : UIViewController{
        override func viewDidLoad() {
            super.viewDidLoad()
            
            let newView = UIButton()
            newView.setTitle("Demo", forState: .Normal)
            newView.backgroundColor = UIColor.redColor()
            newView.translatesAutoresizingMaskIntoConstraints = false
            view.addSubview(newView)
            
            let views = ["newView": newView]
            let horizontalConstraints = NSLayoutConstraint.constraintsWithVisualFormat("H:|-10-[newView]", options: NSLayoutFormatOptions.AlignAllLeft, metrics: nil, views: views)
            view.addConstraints(horizontalConstraints)
            let verticalConstraints = NSLayoutConstraint.constraintsWithVisualFormat("V:[newView]-10-|", options: NSLayoutFormatOptions.AlignAllCenterX, metrics: nil, views: views)
            view.addConstraints(verticalConstraints)
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
我们创建约束依然使用 NSLayoutConstraint 类。不过构造是使用函数 constraintsWithVisualFormat ，传入字符串就是 VFL 格式的。相比之下，VFL 是更为精简的、针对于布局的一个格式化字符串。我们还看第一个、水平方向的VFL：

    "H:|-10-[newView]"

H表示水平方向 
：表示布局开始
| 表示从父视图开始
- 表示下一个布局元素开始
10 表示此布局元素为一个10个点的空占位
[] 表示布局元素是一个视图，方括号内为视图名称。视图名称和真正的视图的对应关系必须在 NSLayoutConstraint.constraintsWithVisualFormat 的最后一个参数views 内以字典的形式提供。

就是说，此字符串的含义就是水平方向，从父视图开始，过10个点的位置放置一个名为 newView 的视图。或者简化为：水平方向上，视图newView的左边和父视图左边之间留空为10 。

相应的：

    V:[newView]-10-|

可以表示垂直方向上，newView的底边和父视图的底边之间的留空为 10。





