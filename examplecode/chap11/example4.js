var mysql = require('db-mysql');

// define database connection
var db = new mysql.Database({
    hostname: 'localhost',
    user: 'username',
    password: 'password',
    database: 'database'
});

// connect
db.connect();

db.on('error', function(error) {
   console.log("CONNECTION ERROR: " + error);
});

// database connected
db.on('ready', function(server) {

  // query using direct query string and nested callbacks
  var qry = this.query();
  qry.insert('nodetest2',['title','text','created'],
             ['Fourth Entry', 'Fourth entry in series', 'NOW()'])
     .execute(function(err,result) {
       if (err) {
        console.log(err);
       } else {
         console.log(result);

         var qry2 = db.query();
         qry2.update('nodetest2')
             .set({title: 'Better title'})
             .where('id = ?',[4])
             .execute(function(err, result) {
            if(err) {
               console.log(err);
            } else {
               console.log(result);
            }
         });
      }
    });
});
