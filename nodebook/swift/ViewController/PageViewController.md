## UIPageViewController

![pageviewcontroller](pageviewcontroller.png)

## 代码 
    import UIKit

    class VCBase: UIViewController
    {
        
        var label : UILabel?
        override func viewDidLoad()
        {
            super.viewDidLoad()
            
            label = UILabel(frame: CGRectMake(0, 0, view.frame.width, 200))
            label!.textAlignment = .Center
            view.addSubview(label!)
            view.backgroundColor = UIColor.whiteColor()
        }
    }

    class v1: VCBase
    {
        override func viewDidLoad()
        {
            super.viewDidLoad()
            label!.text = "#1"
        }
    }
    class v2: VCBase
    {
        override func viewDidLoad()
        {
            super.viewDidLoad()
            label!.text = "#2"
        }
    }

    class PageViewController :UIPageViewController,UIPageViewControllerDataSource{
        var vcs :[UIViewController]
        required init(){
            vcs = [v1(),v2()]
            super.init(transitionStyle: .Scroll, navigationOrientation: .Horizontal, options: nil)
        }
        required  init?(coder: NSCoder){
            fatalError()
        }
        override func viewDidLoad() {
            self.dataSource = self
            let startingViewController: UIViewController = vcs[0]
            let viewControllers = [startingViewController]
            setViewControllers(viewControllers, direction: .Forward, animated: false, completion: nil)
        }
        func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController?
        {
            let v = (viewController)
            let i = vcs.indexOf(v)! - 1
            if i < 0 {
                return nil
            }
            return vcs[i]
        }
        
        func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController?
        {
            let v = (viewController)
            let i = vcs.indexOf(v)! + 1
            if i > vcs.count - 1 {
                return nil
            }
            return vcs[i]
        }
        
        func presentationCountForPageViewController(pageViewController: UIPageViewController) -> Int
        {
            return vcs.count
        }
        
        func presentationIndexForPageViewController(pageViewController: UIPageViewController) -> Int
        {
            return 0
        }
        
    }


    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate
    {
                                
        var window: UIWindow?
        
        func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject : AnyObject]?) -> Bool {
            self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
            self.window!.rootViewController = PageViewController()
            self.window?.makeKeyAndVisible()
            return true

        }
    }
## 代码说明
