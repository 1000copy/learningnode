var fs = require('fs'),
    async = require('async');

try {
   async.parallel({
      data1 : function (callback) {
         fs.readFile('./fruit/data1.txt', 'utf8', function(err, data){
              callback(err,data);
          });
      },
      data2 : function (callback) {
         fs.readFile('./fruit/data2.txt', 'utf8', function(err, data){
              callback(err,data);
          });
      },
      data3 : function readData3(callback) {
         fs.readFile('./fruit/data3.txt', 'utf8', function(err, data){
              callback(err,data);
          });
      },

    }, function (err, result) {
         if (err) throw err;
         console.log(result);
    });
} catch(err) {
   console.log(err);
}
