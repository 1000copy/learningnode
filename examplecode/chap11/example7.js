var mysql = require('mysql');
var queues = require('mysql-queues');

// connect to database
var client = mysql.createClient({
   user: 'username',
   password: 'password'
   });

client.query('USE databasenm');

//associated queues with query
// using debug
queues(client, true);

// create transaction
var trans = client.startTransaction();
// do insert
trans.query('INSERT INTO nodetest2 (title, text, created) ' +
          'values(?,?,NOW())',
          ['Title for 8', 'Text for 8'], function(err,info) {

   if (err) {
      trans.rollback();
   } else {
     console.log(info);

     // update
     trans.query('UPDATE nodetest2 SET title = ? WHERE title = ?',
            ['Better Title for 8','Title for 8'], function(err,info) {
        if(err) {
           trans.rollback();
        } else {
           console.log(info);
           trans.commit();
        }
      });
    }
});
trans.execute();

// select won't work until transaction finished
client.query('SELECT * FROM nodetest2 ORDER BY ID', function(err, result, fields) {
    if (err) {
      console.log(err);
    } else {

      // should show all records, including newest
      console.log(result);
      client.end();
    }
});
