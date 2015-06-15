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
            // create four records
            var widget1 = {id: 1, title : 'First Great widget',
                         desc : 'greatest widget of all',
                         price : 14.99, type: 'A'};
            var widget2 = {id: 2, title : 'Second Great widget',
                         desc : 'second greatest widget of all',
                         price : 29.99, type: 'A'};
            var widget3 = {id: 3, title: 'third widget', desc: 'third widget',
                        price : 45.00, type: 'B'};
            var widget4 = {id: 4, title: 'fourth widget', desc: 'fourth widget',
                        price: 60.00, type: 'B'};

            collection.insert([widget1,widget2,widget3,widget4], {safe : true},
                                                    function(err, result) {
               if(err) {
                  console.log(err);
               } else {

                 // return all documents
                 collection.find().toArray(function(err, docs) {
                    console.log(docs);

                    //close database
                    db.close();
                 });
               }
            });
          }
       });
     });
  }
});
