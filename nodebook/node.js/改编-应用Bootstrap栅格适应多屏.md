### 我听说你想成为一个web程序员?


![clipboard.png](/img/bVmOHP)
https://www.pinterest.com/pin/226376318744399605/


### 护驾护驾

BOOTSTRAP 来了。

###什么是 Bootstrap

Bootstrap 可以用划分栅格的高逼格策略，你只需要几行 CSS 代码，就可以开发出响应式的Web 布局。Bootstrap 在背后默默的完成那些复杂的，有很多浏览器兼容性大坑的工作。 

###什么是栅格(Grid)

Bootstrap 固定的把 Web 页面分隔成12列，但是每一列的宽度则是有弹性的。可以根据屏幕分辨率和窗口大小而有所差别。

每个列可以设置如下前缀的class:

- col-xs 很小的屏幕;小于768px;如手机；
- col-sm 较小的屏幕;大于768px;如平板电脑；
- col-md 中等屏幕；大于992px；如桌面系统；
- col-lg 特大屏幕；大于1200px；比如大显示器或者电视机。

###用 Bootstrap 来适配桌面

口头上直接讲清楚栅格的概念并不容易。可是，我们可以谈谈例子。

桌面一般指的是台式机(Desktop)或者笔记本(Laptop)，它们的分辨率一般比较大，所以我们会选择col-md来布局。

我们来写代码实现桌面原型图，首先创建一个文件，叫做blog.html:

### 准备 

$ cd ~/projects && mkdir bootstrap-demo && cd $_
$ cat blog.html

    <!DOCTYPE html>
        <html lang="en">
          <body>
                <!-- Body content goes here -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
          </body>
    </html>

这里我们用 CDN 引入了Bootstrap 。

接下来，在上面的标记Body content goes here位置填入以下代码：

    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center">
                <h1>My First Bootstrap Blog</h1>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-4">
                <h3>Post Title 1</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4">
                <h3>Post Title 2</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4">
                <h3>Post Title 3</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4">
                <h3>Post Title 4</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4">
                <h3>Post Title 5</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4">
                <h3>Post Title 6</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
        </div>
    </div>

这里我们可以看到，Bootstrap 允许一行被分隔成12列，我们设定每列占宽为4，多余的列则被挤到下一行显示。

###平板电脑适配

平板电脑需要显示为2列，这样我们就需要用col-sm-6来设计这个页面，修改以上代码：

    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center">
                <h1>My First Bootstrap Blog</h1>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-4 col-sm-6">
                <h3>Post Title 1</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6">
                <h3>Post Title 2</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6">
                <h3>Post Title 3</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6">
                <h3>Post Title 4</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
                </div>
            <div class="col-md-4 col-sm-6">
                <h3>Post Title 5</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6">
                <h3>Post Title 6</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
        </div>
    </div>

通过拖动浏览器边框来改变窗口大小，可以看到页面布局会在三列和两列之间变化。

###手机适配

手机和平板电脑一样，可以横放(Landscape Mode)和竖放(Portrait Mode)。对玉分辨率较高的手机，横放会进入平板电脑的布局，我们就不再考虑这种情况。而竖放的手机，我们认为它的宽度小于768px，所以屏幕上只显示一列内容，占满了所有宽度，在这里我们用col-xs-12来布局。

修改上面平板电脑适配的代码：

    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center">
                <h1>My First Bootstrap Blog</h1>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-4 col-sm-6 col-xs-12">
                <h3>Post Title 1</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <h3>Post Title 2</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <h3>Post Title 3</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <h3>Post Title 4</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <h3>Post Title 5</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <h3>Post Title 6</h3>
                <p>Lorem ipsum dolor sit amet ... </p>
            </div>
        </div>
    </div>

可以用chrome模拟查看效果

###结论

只要掌握栅格系统的基本原理，它就可以帮你通过约束的12列模型，也一组适配于不同的显示屏的class，完成一个Responsive, Mobile First的网站。有章有法。

改编自：Bootstrap 响应式栅格 - George's Code Thoughts - http://codethoughts.info/bootstrap/2015/04/26/responsive-grid-layout-with-bootstrap/\