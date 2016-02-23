## 现场生成图片

作为一套 app 开发 demo，我们常常需要使用图片来做装饰。一个方式是需要的时候找到合适的图片，另外一个方式，则是现场使用代码生成。由于本身以demo为主，并非使用的 app，故而达到演示效果即可，使用现场代码生成是可行的，也是比较方便的。

为此，我们需要做UIImage 做出扩展：

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

然后，就可以使用生成色块构成的图片。比如动态产生一个10X10的红色块的代码如下：

    UIImage.imageWithColor(UIColor.redColor()）

我们会在随后的验证代码的需要图片的地方使用此方法。