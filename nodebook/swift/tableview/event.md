tableview events

使用 delegate 实现事件

## tap
1.
When users tap a row of a table view, usually something happens as a result. Another table view could slide into place, the row could display a checkmark, or some other action could be performed. The following sections describe how to respond to selections and how to make selections programmatically.

要可以响应选择事件，需要我们的TableView实现一个叫做 UITableViewDelegate 的委托。做法：

1. 实现一个类，可以自己命名。我们这里命名为 LangTableHandleSelection
2. 实现 UITableViewDelegate 协议
3. 委托到 LangTableHandleSelection。 self.delegate = self
4. 实现方法 tableView:didSelectRowAtIndexPath:)

在方法内，我们首先去掉当前的选择，取代为把 accessoryType = .Checkmark。如果已经是 .Checkmark 就设置为 .None

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


To handle most selections of rows, the table view’s delegate must implement the tableView:didSelectRowAtIndexPath: method.
2.
A row can also have a control object as its accessory view, such as a switch or a slider. This control object functions as it would in any other context: Manipulating the object in the proper way results in an action message being sent to a target object
3.
Selection management is also important with selection lists. There are two kinds of selection lists:

Exclusive lists where only one row is permitted the checkmark
Inclusive lists where more than one row can have a checkmark


## edit
## reorder