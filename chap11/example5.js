var mysql = require('mysql');

var client = mysql.createClient({
   user: 'username',
   password: 'password'
  });

client.query('USE databasenm');

// create
client.query('INSERT INTO nodetest2 ' +
   'SET title = ?, text = ?, created = NOW()',
   ['A seventh item', 'This is a seventh item'], function(err, result) {
   if (err) {
     console.log(err);
   } else {
     var id = result.insertId;
     console.log(result.insertId);

     // update
     client.query('UPDATE nodetest2 SET ' +
         'title = ? WHERE ID = ?', ['New title', id], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result.affectedRows);

          // delete
          client.query('DELETE FROM nodetest2 WHERE id = ?',
            [id], function(err, result) {
            if(err) {
               console.log(err);
            } else {

               console.log(result.affectedRows);

               // named function rather than nested callback
               getData();
            }
          });
        }
     });
   }
});

// retrieve data
function getData() {
   client.query('SELECT * FROM nodetest2 ORDER BY id', function(err, result,fields) {
     if(err) {
       console.log(err);
     } else {
       console.log(result);
       console.log(fields);
     }
     client.end();
   });
}
