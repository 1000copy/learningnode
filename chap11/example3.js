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

  qry.execute('insert into nodetest2 (title, text,created) values(?,?,NOW())',
              ['Fourth Entry','Fourth entry in series'], function(err,result) {
      if (err) {
        console.log(err);
      } else {
         console.log(result);

         var qry2 = db.query();
         qry2.execute('update nodetest2 set title = ? where id = ?',
                    ['Better title',4], function(err,result) {
            if(err) {
               console.log(err);
            } else {
               console.log(result);
               var qry3 = db.query();
               qry3.execute('delete from nodetest2 where id = ?',[4],
                     function(err, result) {
                  if(err) {
                     console.log(err);
                  } else {
                     console.log(result);
                  }
               });
            }
         });
      }
    });
});
