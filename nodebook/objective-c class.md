作为程序员，我们很多人曾经和java，c#，c++之一有过美丽幽会——那温婉的月光，怀中的姑娘。。。

然后我看到了oc class 。“哎尼玛的这是谁啊，这么丑，这么怪，这么丑八怪”，一旦有了这样的想法，有人如果说oc class 简单，设计精良，我看他的眼神都满是FUD。

倘若放弃成见（这很难），高冷的去以新眼光看objective-c的话：嗯，客观的说，还是丑。不过，不那么怪了。细细看起来，有点皮实耐用呢。

本着粗糙结快速的原则，我希望学习class的时候，可以暂时不去管头文件，实现文件分离，MVC,消息传递，ARC之类的无关原则（你懂得我在说谁）。

我们通过xcode建立command line tool项目，粘贴如下代码到main.m ！就可以run！

    #import <Foundation/Foundation.h>
    
    @interface User : NSObject
    {
    @public
        NSString* name;
        int age ;
    }
    -(void)roadshow;
    @end
    
    @implementation User
    
    -(void) roadshow{
        NSLog(@"you are %@,age is :%d",name,age);//    NSLog(@"you are %s",name);
    }
    -(void)setName:(NSString*)n{
        self->name = n;
    }
    -(NSString*)name{
        return self->name;
    }
    @end
    
    int main(int argc, const char * argv[]) {
        @autoreleasepool {
            
            User *u =[[User alloc]init];
            u->name = @"qc";//u.name = @"qc"//u.name = "qc"
            u->age =3;
            [u roadshow];//u->roadshow
        }
        return 0;
    }
    
标注内都是坑，我亲身遇到的。
    调用方法是 [object method] ,不是 object.method,也不是object->method
    访问实例变量用"->",不是"."
    访问属性才用"."
函数声明前的-一度令人困惑且。其实很简单：
   - instance method   比如 init
   + class method ,比如 alloc
函数签名的类型用（）包起来，
    像这样：-(void)setName:(NSString*)n{}
    不能这样：void setName(NSString *n){}
类声明要用@interface end 包起来。没有class clz {}这样的关键字给你用
@interface内的{}内只能放成员变量。属性，方法不放这里，放到@interface end之内，{}之外。


把脑袋里面的线路重新搭建下，该关门的关门，该短路的短路，该飞线的飞线。就比如说，在@interface end内看到{}的完结，一般人就认为class该定义完了。可是，并没有。obj-c不是这样的。到@end 才算完。这里就需要飞线了：从@interface 开始，到@end结束，中间这一段就是一个类了；然后从{开始到}结束，这就是成员变量区了。剩下的都是属性方法。

这些代码一泡，oc的代码就咔咔咔的清爽了。剩下的就是些细枝末节的东西。你的大脑又重新塑造，接受了一个新妞。什么事也不需要必须关了灯才能做了。

你发现了美。





    
    
    
    