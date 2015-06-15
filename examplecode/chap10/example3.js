var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('exampleDb', server);

// open database connection
db.open(function(err, db) {
  if(!err) {

     // access or create widgets collection
     db.collection('widgets',function(err, collection) {

        //update
        collection.update({id:4},
          {$set : {title: 'Super Bad Widget'}},
             {safe: true}, function(err, result) {
           if (err) {
              console.log(err);
           } else {
              console.log(result);
              // query for updated record
              collection.findOne({id:4}, function(err, doc) {
                 if(!err) {
                    console.log(doc);
                 } 

                 //close database
                 db.close();
               });
            }
          });
       });
    }
});
