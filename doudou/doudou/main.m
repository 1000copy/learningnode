
#import <Foundation/Foundation.h>
// Pure Class
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
// NSDic
@interface DicTest : NSObject
{}
-(void) test;
-(void) test2;
-(void) test3;

@end
@implementation DicTest

-(void)test{
    // Literal syntax
    NSDictionary *inventory = @{
                                @"Mercedes-Benz SLK250" : [NSNumber numberWithInt:13],
                                @"Mercedes-Benz E350" : [NSNumber numberWithInt:22],
                                @"BMW M3 Coupe" : [NSNumber numberWithInt:19],
                                @"BMW X6" : [NSNumber numberWithInt:16],
                                };
    NSLog(@"%@", inventory);
    // Values and keys as arguments
    inventory = [NSDictionary dictionaryWithObjectsAndKeys:
                 [NSNumber numberWithInt:13], @"Mercedes-Benz SLK250",
                 [NSNumber numberWithInt:22], @"Mercedes-Benz E350",
                 [NSNumber numberWithInt:19], @"BMW M3 Coupe",
                 [NSNumber numberWithInt:16], @"BMW X6", nil];
    NSLog(@"%@", inventory);
    // Values and keys as arrays
    NSArray *models = @[@"Mercedes-Benz SLK250", @"Mercedes-Benz E350",
                        @"BMW M3 Coupe", @"BMW X6"];
    NSArray *stock = @[[NSNumber numberWithInt:13],
                       [NSNumber numberWithInt:22],
                       [NSNumber numberWithInt:19],
                       [NSNumber numberWithInt:16]];
    inventory = [NSDictionary dictionaryWithObjects:stock forKeys:models];
    NSLog(@"%@", inventory);
    NSLog(@"There are %@ X6's in stock", inventory[@"BMW X6"]);

    // 无法修改
//    inventory[@"BMW X6"] =42
//    NSLog(@"There are %@ X6's in stock", inventory[@"BMW X6"]);
    NSMutableDictionary *jobs = [NSMutableDictionary
                                 dictionaryWithDictionary:@{
                                                            @"Audi TT" : @"John",
                                                            @"Audi Quattro (Black)" : @"Mary",
                                                            @"Audi Quattro (Silver)" : @"Bill",
                                                            @"Audi A7" : @"Bill"
                                                            }];
    NSLog(@"%@", jobs);
    // Transfer an existing job to Mary
    [jobs setObject:@"Mary" forKey:@"Audi TT"];
    // Finish a job
    [jobs removeObjectForKey:@"Audi A7"];
    // Add a new job
    jobs[@"Audi R8 GT"] = @"Jack";
    NSLog(@"%@",jobs);
    // Number type value
    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
    [dic setObject:[NSNumber numberWithInt:2] forKey:@"two"];
    NSLog(@"%@",dic);
    // Array
    NSArray *words = @[@"Mercedes-Benz", @"BMW", @"Porsche",
                             @"Opel", @"Volkswagen", @"Audi"];
    [dic setObject:words forKey:@"doudou"];
    NSLog(@"%@",dic);
    // Mutable Array
    NSMutableArray *brokenCars = [NSMutableArray arrayWithObjects:
                                  @"Audi A6", @"BMW Z3",
                                  @"Audi Quattro", @"Audi TT", nil];
    [dic setObject:brokenCars forKey:@"cars"];
    NSLog(@"%@",dic);
    // Mutable Array ctor
    NSMutableArray *a =[[NSMutableArray alloc]init];
    [a addObject:@"Audi A6"];
    NSLog(@"%@",a);
    [a replaceObjectAtIndex:0 withObject:@"Audi Q5"];
    a[0] = @"q6";
    NSLog(@"%@",a);
    NSLog(@"%@",a[0]);
    for(NSString *s in a){
        NSLog(@"is:%@",s);
    }
    
//    [brokenCars release];
}
-(BOOL)isKey:(NSString*)searchedString{
    searchedString =  [searchedString stringByTrimmingCharactersInSet:
                       [NSCharacterSet whitespaceAndNewlineCharacterSet]];
    NSRange   searchedRange = NSMakeRange(0, [searchedString length]);
    NSString *pattern =@"^[a-zA-Z0-9]*$";
    NSError  *error = nil;
    
    NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern: pattern options:0 error:&error];
    NSArray* matches = [regex matchesInString:searchedString options:0 range: searchedRange];
//    NSLog(@"is:%ul",(unsigned int)[matches count]);
    return [matches count] >=1;
//    NSLog(@"is:%lu",[matches count]);
//    for (NSTextCheckingResult* match in matches) {
//        NSString* matchText = [searchedString substringWithRange:[match range]];
//        NSLog(@"match: %@", matchText);
//    }

}
// is alpha
-(void)test2{
    NSLog(@"is:%@",@"-");
    NSString *searchedString = @"doudou \n";
    NSLog([self isKey:searchedString]?@"YES":@"NO");
    searchedString = @"豆豆\n";
    NSLog([self isKey:searchedString]?@"YES":@"NO");
}
//File
-(void)test3{
    NSLog(@"is:%@",@"-");
    NSString *searchedString = @"doudou \n";
    NSLog([self isKey:searchedString]?@"YES":@"NO");
    searchedString = @"豆豆\n";
    NSLog([self isKey:searchedString]?@"YES":@"NO");
}
// string split
-(void)test4{
    NSLog(@"is:%@",@"-");
    NSString *str =@"a\n阿啊\nai\n碍呆\n唉挨矮哀爱";
//    NSMutableString *ccc =[NSMutableString alloc];
    NSString *ccc =@"";
    NSString *current =@"";
    NSString *lastkey=@"";
    NSString *lastvalue=@"";
    NSString *currentkey=@"";
//    NSString *str1=@"a阿啊\nai碍呆唉挨矮哀爱";
    NSArray* lines = [str componentsSeparatedByCharactersInSet:[NSCharacterSet newlineCharacterSet]];
//    NSLog(@"is:%@",lines);
    for(NSString *line in lines){

        if ([self isKey:line]){
            currentkey = line;
            if ([lastkey length]!=0){
               ccc = [ccc  stringByAppendingString:[NSString stringWithFormat:@"%@ %@\n",lastkey,lastvalue]];
            }
            lastkey = currentkey ;
        }else {
            lastvalue = [lastvalue stringByAppendingString:line];
        }
    }
    if ([lastkey length]!=0){
//        ccc = [ccc  stringByAppendingString:lastkey];
//        ccc = [ccc  stringByAppendingString:@" "];
//        ccc = [ccc  stringByAppendingString:lastvalue];
//        ccc = [ccc  stringByAppendingString:@"\n"];
        ccc = [ccc  stringByAppendingString:[NSString stringWithFormat:@"%@ %@\n",lastkey,lastvalue]];
    }

    NSLog(@"is:%@",ccc);
}
-(NSString*)wash:(NSString*)str{
    NSString *ccc =@"";
    NSString *lastkey=@"";
    NSString *lastvalue=@"";
    NSString *currentkey=@"";
    NSArray* lines = [str componentsSeparatedByCharactersInSet:[NSCharacterSet newlineCharacterSet]];
    for(NSString *line in lines){
        
        if ([self isKey:line]){
            currentkey = line;
            if ([lastkey length]!=0){
                ccc = [ccc  stringByAppendingString:[NSString stringWithFormat:@"%@ %@\n",lastkey,lastvalue]];
            }
            lastkey = currentkey ;
            lastvalue =@"";
        }else {
            lastvalue = [lastvalue stringByAppendingString:line];
        }
    }
    if ([lastkey length]!=0){
        ccc = [ccc  stringByAppendingString:[NSString stringWithFormat:@"%@ %@\n",lastkey,lastvalue]];
    }
    return ccc;
}
-(void)test6{
    NSLog(@"is:%@",[self wash: @"a\n阿啊\nai\n碍呆\n唉挨矮哀爱"]);
}

-(void)test7{
    NSString *path =@"/Users/lcjun/github/learningnode/nodebook/pinyin.txt";
    NSString *content = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    NSLog(@"is:%@",[self wash: content]);
}

-(void)test5{
    NSLog(@"is:%@",@"-");
    NSString *str =@"1";
    str =[str stringByAppendingString:str];
    NSLog(@"is:%@",str);
    NSLog(@"is:%@",[NSString stringWithFormat:@"%@/%@/%@", str,str,str]);
    
}
-(void)test8{
//    NSString *str = @"a 阿啊\nai 碍呆唉挨矮哀爱";
    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
    dic[@"a"]=@"阿啊";
    dic[@"ai"]=@"碍呆唉挨矮哀爱";
    NSLog(@"is:%@",dic[@"ai"]);
    NSLog(@"is:%@",dic[@"b"]?@"HASVALUE":@"EMPTY");
}

@end
int main(int argc, const char * argv[]) {
    @autoreleasepool {
        
//        User *u =[[User alloc]init];
//        u->name = @"qc";//u.name = @"qc"//u.name = "qc"
//        u->age =3;
//        [u roadshow];//u->roadshow
        // Dic
        DicTest * d = [[DicTest alloc]init];
//        [d test];
        [d test8];
    }
    return 0;
}