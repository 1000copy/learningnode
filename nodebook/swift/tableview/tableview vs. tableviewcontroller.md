Populating a UITableView inside of a UIViewController is no different than populating a UITableView inside of a UITableViewController. You just have to make sure you implement the required datasource and delegate methods. You also need to be sure to assign the UIViewController as the delegate and the datasource for that UITableView.

If you want objects other than the table, then you should us a UIViewController. In fact, I rarely use the UITableViewController any more just in case I need to add other objects.

I always use UITableView. I never use UITableViewController.

Using UITableViewController is confusing. Each controller is supposed to do one screen except container controllers.

Well, UITableViewController is a controller and most of the time, a tableView is simply not the only thing there.It provides some conveniences, but you never really need it

A TableViewController is a ViewController with a TableView built in. This will have the delegate methods needed already declared and setup. This VC is already a TableView delegate and datasource. It cannot be resized. Upside is ease of use, downside is very limited flexibility.

A TableView is just that a TableView (subclass of UIView). It can be added to a ViewController and resized, used alongside another view based object, etc. The upside is the flexibility, the downside is that you have to setup the delegate and datasource methods yourself (in my opinion, well worth the time to get the flexibility).

UITableViewController sounds great, right?  Less code is good… of course!  Well not if less code means you put the shackles on and can’t do something more advanced later on.

What if you want to add a toolbar to your view? 



What if you want to have a transparent background so that you can have a custom image show through, similar to the way I did with Pocket Tabs?

Well it turns out that you can’t.  Not easily anyway.  If you add a toolbar as a subview of a table view, then your toolbar will scroll with the content.  That’s not good.

Also if you try to get clever and re-parent the view controller class to point to a different UIView (one that has a toolbar & background image set properly) then the UITableViewController complains.