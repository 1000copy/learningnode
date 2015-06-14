
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' }, function(err, stuff) {
     if (!err) {
        console.log(stuff);
        res.write(stuff);
        res.end();
     }
  });
};
