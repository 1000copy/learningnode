var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('exampleDb', server);

// open database connection
db.open(function(err, db) {
  if(!err) {

     // access or create widgets collectoin
     db.collection('widgets',function(err,collection) {

        //update
        collection.findAndRemove({id:3}, [['id',1]],
             function(err, doc) {
           if (err) {
              console.log(err);
           } else {
              console.log(doc);
           }
           db.close();
       });
    });
   } 
});
