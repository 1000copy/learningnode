var mysql = require('db-mysql');

// define database connection
var db = new mysql.Database({
    hostname: 'localhost',
    user: 'shelleyp_green',
    password: 'green#rules8',
    database: 'nodetest2'
});

// connect
db.connect();

db.on('error', function(error) {
  console.log("CONNECTION ERROR: " + error);
});

// database connected
db.on('ready', function(server) {

  // query using chained methods and nested callback
  this.query()
      .select('*')
      .from('nodetest2')
      .where('id = 1')
      .execute(function(error, rows, columns) {
        if (error) {
            return console.log('ERROR: ' + error);
        }
        console.log(rows);
        console.log(columns);
  });

  // query using direct query string and event
  var qry = this.query();

  qry.execute('select * from nodetest2 where id = 1');

  qry.on('success', function(rows, columns) {
    console.log(rows); // print out returned rows
    console.log(columns); // print out returns columns
  });
  qry.on('error', function(error) {
    console.log('Error: ' + error);
  });
});
