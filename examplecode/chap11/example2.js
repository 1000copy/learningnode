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

  // query using direct query string and event
  var qry = this.query();

  qry.execute('insert into nodetest2 (title, text,created) values(?,?,NOW())',
              ['Third Entry','Third entry in series']);

  qry.on('success', function(result) {
    console.log(result);
  });

  qry.on('error', function(error) {
    console.log('Error: ' + error);
  });
});
