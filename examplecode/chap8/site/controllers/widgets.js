var widgets = [
   { id : 1,
     name : "The Great Widget",
     price : 1000.00,
     desc: "A widget of great value"
   }
]

// index listing of widgets at /widgets/
exports.index = function(req, res) {
   res.render('widgets/index', {title : 'Widgets', widgets : widgets});
};

// display new widget form
exports.new = function(req, res) {
    console.log(req.url);
    var filePath = require('path').normalize(__dirname + "/../public/widgets/new.html");
    res.sendfile(filePath);
};

// add a widget
exports.create = function(req, res) {

  // generate widget id
  var indx = widgets.length + 1;

  // add widget
  widgets[widgets.length] =
   { id : indx,
     name : req.body.widgetname,
     price : parseFloat(req.body.widgetprice),
     desc : req.body.widgetdesc };

  //print out to console and confirm addition to user
  console.log(widgets[indx-1]);
  res.render('widgets/added', {title: 'Widget Added', widget : widgets[indx-1]});
};

// show a widget
exports.show = function(req, res) {
   var indx = parseInt(req.params.id) - 1;
   if (!widgets[indx])
      res.send('There is no widget with id of ' + req.params.id);
   else
      res.render('widgets/show', {title : 'Show Widget', widget : widgets[indx]});
};

// delete a widget
exports.destroy = function(req,res) {
   var indx = req.params.id - 1;
   delete widgets[indx];

   console.log('deleted ' + req.params.id);
   res.send('deleted ' + req.params.id);
};

// display edit form
exports.edit = function(req, res) {
   var indx = parseInt(req.params.id) - 1;
   res.render('widgets/edit', {title : 'Edit Widget', widget : widgets[indx]});
};

// update a widget
exports.update = function(req,res) {
  var indx = parseInt(req.params.id) - 1;
  widgets[indx] =
   { id : indx + 1,
     name : req.body.widgetname,
     price : parseFloat(req.body.widgetprice),
     desc : req.body.widgetdesc}
  console.log(widgets[indx]);
  res.render('widgets/added', {title: 'Widget Edited', widget : widgets[indx]})
};
