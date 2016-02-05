我们现在希望把一个列表显示在UITableView内。
这个列表为 ： ["swift","obj-c","ruby"]。我们来详细讨论做法

## 简单呈现


    class LangTable : UITableView,UITableViewDataSource{
        let arr = ["swift","obj-c","ruby"]
        override init(frame: CGRect, style: UITableViewStyle) {
            super.init(frame:frame,style:style)
            self.dataSource = self
            
        }
        required init?(coder aDecoder: NSCoder) {
            super.init(coder:aDecoder)
        }
        func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            return arr.count
        }
        
        func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            let a = UITableViewCell(style: .Default, reuseIdentifier: nil)
            a.textLabel?.text = String(arr[indexPath.row])
            return a
        }
    }


代码中需要理解的内容：
1. UITableViewDataSource协议，以及实现协议的方法
2. 两个构造函数的覆盖
3. required 标记的含义

调用这个类，把它显示在一个 UIViewController 内

    class ViewController: UIViewController {
        override func viewDidLoad() {
            super.viewDidLoad()
            let a  = LangTable()
            a.frame = CGRectMake(0,100,200,150)
            self.view.addSubview(a)
        }
    }

留意的点:
1. frame 属性
2. addSubview 方法

## 优化 dequeueReusableCellWithIdentifier


    class ViewController: UIViewController {
        override func viewDidLoad() {
            super.viewDidLoad()
            let a  = LangTable()
            a.frame = CGRectMake(0,100,200,150)
            self.view.addSubview(a)
        }
    }
    class LangTable : UITableView,UITableViewDataSource{
        let arr = ["swift","obj-c","ruby"]
        let MyIdentifier = "cell"
        override init(frame: CGRect, style: UITableViewStyle) {
            super.init(frame:frame,style:style)
            self.dataSource = self
            self.registerClass(UITableViewCell.self, forCellReuseIdentifier: MyIdentifier)
        }
        required init?(coder aDecoder: NSCoder) {
            super.init(coder:aDecoder)
        }
        func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            return arr.count
        }
        
        func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            let a = tableView.dequeueReusableCellWithIdentifier(MyIdentifier)!
            a.textLabel?.text = String(arr[indexPath.row])
            return a
        }
    }
## 使用 TableViewController的方式

UITableViewController，代码规整，两个VC分工合理，且不需要设置 dataSource，不必conforms to UITableViewDataSource 。因为UITableViewController已经做了。


    class LangTableViewController : UITableViewController{
        let arr = ["swift","obj-c","ruby"]
        let MyIdentifier = "cell"
        override func viewDidLoad() {
            super.viewDidLoad()
            tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: MyIdentifier)
        }
        override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            return arr.count
        }
        override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            let a = tableView.dequeueReusableCellWithIdentifier(MyIdentifier)
            a!.textLabel?.text = arr[indexPath.row]
            return a!
        }
    }
    class ViewController: UIViewController {
        var  a : LangTableViewController?
        override func viewDidLoad() {
            super.viewDidLoad()
            let a  = LangTableViewController()
            a.view.frame = CGRectMake(0,100,300,200)
            self.view.addSubview(a.view)
            self.addChildViewController(a)
        }
    }
addChildViewController 是比较别致的，令人费解的。如果不加入，当tap 表行时，所有的显示行会消失。

adds the specified view controller as a child of the current view controller.
This method creates a parent-child relationship between the current view controller and the object in the childController parameter. This relationship is necessary when embedding the child view controller’s view into the current view controller’s content. If the new child view controller is already the child of a container view controller, it is removed from that container before being added.
This method is only intended to be called by an implementation of a custom container view controller. If you override this method, you must call super in your implementation.


