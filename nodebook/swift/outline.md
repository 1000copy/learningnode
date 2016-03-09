## size class programatically

reading

    Auto Layout 101
    https://www.weheartswift.com/auto-layout-101/
    Introduction to Auto Layout
    http://www.appcoda.com/introduction-auto-layout/

autosize masks

    You are no doubt familiar with autosizing masks – also known as the “springs and struts” model. The autosizing mask determines what happens to a view when its superview changes size. 



    iOS 8 introduces the active property on NSLayoutConstraint. It allows you to activate or deactivate a constraint. There are also methods to activate/deactivate multiple constraints.

    + (void)activateConstraints:(NSArray *)constraints
    + (void)deactivateConstraints:(NSArray *)constraints
    Keep your constraints in arrays when creating them programmatically.
    Create an array for each of the layouts you need.
    Activate/Deactivate whatever set of constraints you need from within willTransitionToTraitCollection

type of  Layout contraints

    There are several types of constraints:

    size constraints – ex. an image should have a width of 200
    alignment constraints – a label should be centred vertically on the screen
    spacing constraints – space between two labels or between a view and the margin of the screen

What’s the purpose of constraints?

    In the end by solving the given set of constraints, Auto Layout will determine the frame for each view in your screen. So each view should have a constraints that will help determine its width, height, x and y position. There are a few exceptions but we are going to get into them later.

http://stackoverflow.com/questions/26363057/set-autolayout-size-class-programatically


网络 -本地存储 - 设备事件- 旋转- 地理位置- 震动- 通知 - iAD

TASK : iOS 内置的app：时间  。一个很好的练习题目
TASK : Little and Completed App： Todo

# 布局

GOOGLE: Centering a view in a super view with visual format language using Auto Layout in iOS/Swift
GOOGLE: Centering view with visual format NSLayoutConstraints



