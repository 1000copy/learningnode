var redis = require("redis"),
    http = require('http');

// create Redis client
var client = redis.createClient();

client.on('error', function (err) {
    console.log('Error ' + err);
});

// set database to 1
client.select(1);

var scoreServer = http.createServer();

// listen for incoming request
scoreServer.on('request', function (req, res) {

  console.time('test');

  req.addListener("end", function() {

     var obj = {
          member : 2366,
          game : 'debiggame',
          first_name : 'Sally',
          last_name : 'Smith',
          email : 'sally@smith.com',
          score : 50000 };

     // add or overwrite score
     client.hset(obj.member, "game", obj.game, redis.print);
     client.hset(obj.member, "first_name", obj.first_name, redis.print);
     client.hset(obj.member, "last_name", obj.last_name, redis.print);
     client.hset(obj.member, "email", obj.email, redis.print);
     client.hset(obj.member, "score", obj.score, redis.print);

     client.hvals(obj.member, function (err, replies) {
        if (err) {
           return console.error("error response - " + err);
        }

        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
          console.log("    " + i + ": " + reply);
        });
     });

     res.end(obj.member + ' set score of ' + obj.score);
     console.timeEnd('test');
   });
});

scoreServer.listen(8124);

// HTTP server closes, close client connection
scoreServer.on('close', function() {
   client.quit();
});

console.log('listening on 8124');
