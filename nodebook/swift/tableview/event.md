tableview events

使用 delegate 实现事件

## tap
1.
When users tap a row of a table view, usually something happens as a result. Another table view could slide into place, the row could display a checkmark, or some other action could be performed. The following sections describe how to respond to selections and how to make selections programmatically.

To handle most selections of rows, the table view’s delegate must implement the tableView:didSelectRowAtIndexPath: method.

要可以响应选择事件，需要我们的TableView实现一个叫做 UITableViewDelegate 的委托。做法：

1. 实现一个类，可以自己命名。我们这里命名为 LangTableHandleSelection
2. 实现 UITableViewDelegate 协议
3. 委托到 LangTableHandleSelection。 self.delegate = self
4. 实现方法 tableView:didSelectRowAtIndexPath:)

默认情况下，tap到行，就会做出选择，被选择行被高亮。不过这样未必好看。如果采用checkmark标记会更漂亮。在方法内，我们首先去掉当前的选择，取代为把 accessoryType = .Checkmark。如果已经是 .Checkmark 就设置为 .None

    class LangTableHandleSelection : UITableView,UITableViewDataSource,UITableViewDelegate{
        let arr = ["java","swift","js"]
        override init(frame: CGRect, style: UITableViewStyle) {
            super.init(frame:frame,style:style)
            self.dataSource = self
            self.delegate = self
            
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
        func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath){
            print("did select \(indexPath.row)")
            self.deselectRowAtIndexPath(indexPath, animated: false)
            if  self.cellForRowAtIndexPath(indexPath)?.accessoryType !=  .Checkmark{
                self.cellForRowAtIndexPath(indexPath)?.accessoryType = .Checkmark
            }else{
                self.cellForRowAtIndexPath(indexPath)?.accessoryType = .None
            }
        }
    }




2. 每个Cell 都可以在它的 accessory view 内放置控件,比如 UISwitch ，点击这个控件，可以如常的发出事件。

    class LangTableAccessView : UITableView,UITableViewDataSource{
        let arr = ["java","swift","js"]
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
            let s = UISwitch()
            s.frame = CGRectMake(0,0,20,20)
            s.addTarget(self, action: "action:", forControlEvents: .ValueChanged)
            s.on = true
            a.accessoryView = s
            return a
        }
        func action(sender : UISwitch!){
            print(sender.on)
        }
    }
3. 选择。单选
Selection management is a 0lso important with selection lists. There are two kinds of selection lists:

    class LangTableSingleSelection : UITableView,UITableViewDataSource,UITableViewDelegate{
        let arr = ["java","swift","js"]
        var ii = NSIndexPath (index:-1)
        var selected = false
        override init(frame: CGRect, style: UITableViewStyle) {
            super.init(frame:frame,style:style)
            self.dataSource = self
            self.delegate = self
            
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
        func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath){
            if !selected {
                selected = true
                ii = indexPath
                self.cellForRowAtIndexPath(indexPath)?.accessoryType = .Checkmark
            }else{
                self.cellForRowAtIndexPath(ii)?.accessoryType = .None
                self.cellForRowAtIndexPath(indexPath)?.accessoryType = .Checkmark
                ii = indexPath
            }
            self.deselectRowAtIndexPath(indexPath, animated: false)
        }
    }

4. 选择。多选

    class LangTableMultiSelection : UITableView,UITableViewDataSource,UITableViewDelegate{
        let arr = ["java","swift","js"]
        override init(frame: CGRect, style: UITableViewStyle) {
            super.init(frame:frame,style:style)
            self.dataSource = self
            self.delegate = self
            
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
        func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath){
            let r = self.cellForRowAtIndexPath(indexPath)!
            if r.accessoryType == .None {
                r.accessoryType = .Checkmark
            }else{
                r.accessoryType = .None
            }
            self.deselectRowAtIndexPath(indexPath, animated: false)
        }
    }

## delete
    class LangTableRowDelete : UITableView,UITableViewDataSource,UITableViewDelegate{
        var arr = NSMutableArray.init(array: ["java","swift","js"])
        override init(frame: CGRect, style: UITableViewStyle) {
            super.init(frame:frame,style:style)
            self.dataSource = self
            self.delegate = self
            
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
        func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
            if editingStyle ==  .Delete{
                arr.removeObjectAtIndex(indexPath.row) // http://stackoverflow.com/questions/21870680/invalid-update-invalid-number-of-rows-in-section-0
                self.deleteRowsAtIndexPaths([indexPath], withRowAnimation: UITableViewRowAnimation.Fade)
            }
        }
        
    }
    class ViewController: UIViewController {
        var a : UITableView?
        override func viewDidLoad() {
            super.viewDidLoad()
            a  = LangTableRowDelete()
            a!.frame = CGRectMake(0,200,300,200)
            self.view.addSubview(a!)
            let b = UIButton()
            b.frame = CGRectMake(0,100,300,50)
            b.setTitle("edit", forState: .Normal)
            b.backgroundColor = UIColor.redColor()
            self.view.addSubview(b)
            b.addTarget(self, action: "edit:", forControlEvents: .TouchDown)
        }
        func edit( b : UIButton!){
            a!.setEditing(true, animated: true)
        }
    }

## insert 


## reorder