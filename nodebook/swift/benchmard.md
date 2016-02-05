## 简单的benchmark

###一个类实现，可以用来做代码的性能测试

    class ParkBenchTimer {
        
        let startTime:CFAbsoluteTime
        var endTime:CFAbsoluteTime?
        
        init() {
            startTime = CFAbsoluteTimeGetCurrent()
        }
        
        func stop() -> CFAbsoluteTime {
            endTime = CFAbsoluteTimeGetCurrent()
            
            return duration!
        }
        
        var duration:CFAbsoluteTime? {
            if let endTime = endTime {
                return endTime - startTime
            } else {
                return nil
            }
        }
    }

###用法案例。用来测试tableview中使用 dequeueReusableCellWithIdentifier之后带来的效率提升

    let bcount  = 10000// 1.21s
    func benchmark () -> UITableViewCell{
        let MyIdentifier = "cell1234"
        let a = UITableView()
        var cell = UITableViewCell()
        a.registerClass(UITableViewCell.self, forCellReuseIdentifier: MyIdentifier)
        for _ in 1...bcount{
            cell = a.dequeueReusableCellWithIdentifier(MyIdentifier)!
            
        }
        return cell
    }
    // 1.66s ,简直差不多。
    func benchmark1 () -> UITableViewCell{
        var cell = UITableViewCell()
        for _ in 1...bcount{
            cell = UITableViewCell(style: .Default, reuseIdentifier: nil)
        }
        return cell
    }
    
