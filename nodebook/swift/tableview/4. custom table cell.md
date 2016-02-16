## 定制的表格单元

    class ViewController: UIViewController {
        override func viewDidLoad() {
            super.viewDidLoad()
            let a  = LangTableCustom()
            a.frame = CGRectMake(0,100,300,100)
            self.view.addSubview(a)
        }
    }

    class LangTableCustomCell : UITableViewCell{
        var mainLabel : UILabel?
        required override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
            mainLabel = UILabel(frame:CGRectMake(0.0, 0.0, 220.0, 15.0))
            mainLabel!.backgroundColor = UIColor.redColor()
            super.init(style: style,reuseIdentifier: reuseIdentifier)
            self.contentView.addSubview(mainLabel!)
        }
        required init?(coder aDecoder: NSCoder) {
            super.init(coder:aDecoder)
        }
    }
    class LangTableCustom : UITableView,UITableViewDataSource{
        let arr = ["java"]
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
            let a = LangTableCustomCell(style: UITableViewCellStyle.Value1, reuseIdentifier: nil)
            a.mainLabel?.text = arr[indexPath.row]
            return a
        }
    }