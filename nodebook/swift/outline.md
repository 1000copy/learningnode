因为这篇文字的引发，要想把故事讲圆，就得把如下的话题列表做进一步展开：

1. 特别的语法特性
- 闭包
- unwrapped（解包）App内会大量使用这两个语法特性。可以让代码更加简洁和安全。
- optional value（可选值）
2. UIKit控制器
   NavigationController、PageController、TagController、TableViewController
3. UIKit 重要视图介绍。很多很多内容。
- 视图类 Button 、Label、...
4. UIKit 事件介绍
5. Little and Completed App： Todo

而要真正的应用出炉，必然也需要的内容：

1. 网络
2. 本地存储
3. 设备事件
- 旋转
- 地理位置
- 震动
- 通知
 ？？？？

 ##扩展

视图种类很多，完整的请GOOGLE: uikit user interface catalog 去查看官方文档。

框架的种类也很多，涵盖UI、Video、Image、Network等。我们也知道在iOS内，完整的类别可以GOOGLE: iOS frameworks ,查看官方文档。

我们使用到了TouchDown事件。同时还有更多的Touch事件。可以 GOOGLE: UIControl  Events

https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIControl_Class/index.html#//apple_ref/doc/constant_group/Control_Events


##TableViewCell 内的控件事件如何捕获？

##iOS 内置的app：时间  。一个很好的练习题目

#TASK
## DEMO : PageViewController
coded
##DEMO: TabViewController
http://stackoverflow.com/questions/26850411/how-add-tabs-programmatically-in-uitabbarcontroller-with-swift
##DEMO:TableViewController
##DEMO: NavigationController
如何手打布局TableViewCell内的多个控件
如何手打 tableview
如何手打 Custom Table View Cell


##Combined View Controller Interfaces
## 布局
## 视图和视图控制器
## 视图一览
button,textview,tableview 
## (内容型）视图控制器一览
viewcontroller 
## （容器型）视图控制器
page,tabbar,navigation
## 特别的语法
闭包
nil操作优化！，？

swift arc

http://www.tutorialspoint.com/swift/swift_automatic_reference_counting.htm

strong ,weak ,unowned :

http://www.jianshu.com/p/d61a0a2220f0


# 布局

GOOGLE: Centering a view in a super view with visual format language using Auto Layout in iOS/Swift
GOOGLE: Centering view with visual format NSLayoutConstraints

# 官方文档
GOOGLE: About Events in iOS
GOOGLE: Start Developing iOS Apps (Swift) 
GOOGLE : Presenting a View Controller
GOOGLE :  UIViewController Class Reference
GOOGLE: view controller programming guide for ios
GOOGLE: uikit user interface catalog
GOOGLE: view controller catalog for ios
GOOGLE:UIKit Framework Reference
GOOGLE：NavigationController
GOOGLE：TabViewController
GOOGLE: Visual Format Language

样子： https://developer.apple.com/library/ios/documentation/WindowsViews/Conceptual/ViewControllerCatalog/Art/tabbar_controllerviews.jpg

GOOGLE：PageViewController 
http://www.appcoda.com/uipageviewcontroller-tutorial-intro/
GOOGLE：Table View Programming Guide for iOS.
GOOGLE： UITableViewCell Class Reference


http://www.appcoda.com/uipageviewcontroller-tutorial-intro/


http://swiftiostutorials.com/ios-tutorial-using-uipageviewcontroller-create-content-slider-objective-cswift/
#Blog

ONEV CAT http://project.onevcat.com/

# STACKOVERFLOW

Creating a navigationController programatically (Swift)
How to create a button programmatically?

#GITHUB 

https://github.com/ipader/SwiftGuide

#BOOK 

Swift与Cocoa框架开发
精通iOS开发（第7版） 
Swift 编程语言指南（非官方译本）

#SITE

GOOGLE: Learning Swift: Optional Types - don't panic
GOOGLE: A Closer Look at Table View Cells 
GOOGLE: SWIFT | Adding constraints programmatically
GOOGLE: Understanding Auto Layout 2016-01-07
 
#Adaptive UI

horizontally regular environment
horizontally compact environment

Gone are the early days of the App Store where there was just one iPhone for developers to target. Now there are original and widescreen iPhones, iPhone and iPads, in portrait or landscape, with standard and Retina displays. 

GOOGLE:Adaptive UI in iOS 8: Explained
#问题1 

troubleshooting for imageview设置了tapclick，但是总也不能激发事件。
解决方法：
In the Attributes inspector, find the field labeled Interaction and select the User Interaction Enabled checkbox.