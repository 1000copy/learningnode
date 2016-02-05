
A cell object has various parts, which can change depending on the mode of the table view. Normally, most of a cell object is reserved for its content: text, image, or any other kind of distinctive identifier. Using the UITableViewCell class directly, you can create “off-the-shelf” cell objects in a range of predefined styles


## 现场生成图片

一般采用图片文件来创建UIImage实例。但是可以仅仅用代码方式做到。这样来验证问题会更加方便。

扩展：
    extension UIImage {
        class func imageWithColor(color: UIColor) -> UIImage {
            let rect = CGRectMake(0.0, 0.0, 10.0,10.0 )
            UIGraphicsBeginImageContext(rect.size)
            let context = UIGraphicsGetCurrentContext()
            
            CGContextSetFillColorWithColor(context, color.CGColor)
            CGContextFillRect(context, rect)
            
            let image = UIGraphicsGetImageFromCurrentImageContext()
            UIGraphicsEndImageContext()
            
            return image
        }
    }
使用如下代码即可动态产生一个10X10的红色块的图片：
    UIImage.imageWithColor(UIColor.redColor()）
## Cell Style

    UITableViewCellStyleDefault,
    UITableViewCellStyleValue1,
    UITableViewCellStyleValue2,
    UITableViewCellStyleSubtitle
## accessoryType

    
    case None // don't show any accessory view
    case DisclosureIndicator // regular chevron. doesn't track
    case DetailDisclosureButton // info button w/ chevron. tracks
    case Checkmark // checkmark. doesn't track
    case DetailButton // info button. tracks

## 设计的代码段，多个行分别选择不同的 Cell Style 和 accessoryType。可以查看在不同组合下的文字、图片的位置组合。

    class ViewController: UIViewController {
        var  a : LangTableViewController?
        override func viewDidLoad() {
            super.viewDidLoad()
            let v = UIScrollView()
            view.addSubview(v)
            v.frame = view.frame
            
            let a  = LangTableManyStyle()
            a.frame = CGRectMake(0,100,300,300)
            v.addSubview(a)
        }
    }
    class Row {
        var text : String = ""
        var text2 : String = ""
        var image : UIImage
        var access : UITableViewCellAccessoryType
        var style :  UITableViewCellStyle
        init( text : String ,text2:String ,image:UIImage,access:UITableViewCellAccessoryType,style :  UITableViewCellStyle){
            self.text = text
            self.text2 = text2
            self.image = image
            self.access = access
            self.style = style
        }
    }
    class LangTableManyStyle: UITableView,UITableViewDataSource{
        let arr = [
            Row(
                    text:"java",
                    text2:"old plain",
                    image:UIImage.imageWithColor(UIColor.redColor()),
                    access:UITableViewCellAccessoryType.Checkmark,
                    style: UITableViewCellStyle.Value1),
            Row(
                text:"ruby",
                text2:"new cool slow",
                image:UIImage.imageWithColor(UIColor.greenColor()),
                access:UITableViewCellAccessoryType.DetailButton,
                style: UITableViewCellStyle.Value2),
            Row(
                text:"swift",
                text2:"new cool quick ",
                image:UIImage.imageWithColor(UIColor.blueColor()),
                access:UITableViewCellAccessoryType.DetailDisclosureButton,
                style: UITableViewCellStyle.Subtitle)
        ]
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
            let a = UITableViewCell(style: arr[indexPath.row].style, reuseIdentifier: nil)
            a.textLabel?.text = arr[indexPath.row].text
            a.detailTextLabel?.text = arr[indexPath.row].text2
            a.imageView?.image = arr[indexPath.row].image
            a.accessoryType = arr[indexPath.row].access
            return a
        }

    }

