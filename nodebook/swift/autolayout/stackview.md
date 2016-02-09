  override func viewDidLoad() {
        super.viewDidLoad()
        a  = LangTableRowDelete()
        a!.frame = CGRectMake(0,200,300,200)
        self.view.addSubview(a!)
        let b = UIButton()
//        b.frame = CGRectMake(0,100,150,50)
        b.setTitle("edit", forState: .Normal)
        b.backgroundColor = UIColor.redColor()
//        self.view.addSubview(b)
        b.addTarget(self, action: "edit:", forControlEvents: .TouchDown)
        
        let c = UIButton()
//        c.frame = CGRectMake(160,100,150,50)
        c.setTitle("add", forState: .Normal)
        c.backgroundColor = UIColor.yellowColor()
//        self.view.addSubview(c)
        c.addTarget(self, action: "add:", forControlEvents: .TouchDown)
        
        let d = UIButton()
//        d.frame = CGRectMake(160,100,150,50)
        d.setTitle("update", forState: .Normal)
        d.backgroundColor = UIColor.blueColor()
//        self.view.addSubview(d)
        d.addTarget(self, action: "update:", forControlEvents: .TouchDown)

        let sv = UIStackView()
        
        sv.backgroundColor = UIColor.grayColor()
        sv.axis = UILayoutConstraintAxis.Horizontal
        sv.distribution = .EqualCentering;
        sv.alignment = .Center;
        sv.spacing = 10;
        sv.frame = CGRectMake(0,100,300,50)
        sv.addArrangedSubview(b)
        sv.addArrangedSubview(c)
        sv.addArrangedSubview(d)
        sv.translatesAutoresizingMaskIntoConstraints = true
        self.view.addSubview(sv)
        
    }
    func edit( b : UIButton!){
        a!.setEditing(true, animated: true)
    }
    func add( b : UIButton!){
        a!.add("new lang")
    }
    func update( b : UIButton!){
        a!.update(1, newlang: "new lang")
    }}