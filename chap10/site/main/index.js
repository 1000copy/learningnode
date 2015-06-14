
var redis = require('redis');

// home page
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


// stats
exports.stats = function(req, res){

   var client = redis.createClient();

   client.select(2);

   // Redis transaction to gather data
   client.multi()
   .smembers('ip')
   .hgetall('myurls')
   .exec(function(err, results) {
        var ips = results[0];
        var urls = results[1];
        console.log(Object.keys(urls).length);
        res.render('stats',{ title: 'Stats', ips : ips, urls : urls});
        client.quit();
   });
};
