var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('exampleDb', server);

// open database connection
db.open(function(err, db) {
  if(!err) {

     // access or create widgets collection
     db.collection('widgets', function(err, collection) {

       // remove all widgets documents
       collection.remove(null,{safe : true}, function(err, result) {
          if (!err) {
            console.log('result of remove ' + result);

            // create two records
            var widget1 = {title : 'First Great widget',
                         desc : 'greatest widget of all',
                         price : 14.99};
            var widget2 = {title : 'Second Great widget',
                         desc : 'second greatest widget of all',
                         price : 29.99};

            collection.insert(widget1);

            collection.insert(widget2, {safe : true}, function(err, result) {
               if(err) {
                  console.log(err);
               } else {
                  console.log(result);
                  
                  //close database
                  db.close();
               }
            });
          }
       });
     });
  }
});
