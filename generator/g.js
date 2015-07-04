function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
console.log(g.next()) // { value: 3, done: false }
console.log(g.next(2)) // { value: 2, done: true }
function b(){
	fs.readFile('./Index.html', function read(err, data) {
	    if (err) {
	        throw err;
	    }	    
	    processFile(data);   
	});
	function processFile(content) {
	    console.log(content);
	}
}
function b1(){
   var data = yield read('./Index.html')
   processFile(data)
}
function a(){
	var fs = require('fs');

	var writeStream = fs.createWriteStream('./log.txt',
	      {'flags' : 'a',
	       'encoding' : 'utf8',
	       'mode' : 0666});

	try {
	   // get list of files
	   fs.readdir('./data/', function(err, files) {

	      // for each file
	      files.forEach(function(name) {
	  
	         // check to see if object is file
	         fs.stat('./data/' + name, function(err, stats) {

	            if (err) throw err;

	            if (stats.isFile())

	               // modify contents
	               fs.readFile('./data/' + name,'utf8', function(err,data) {

	                  if (err) throw err;
	                  var adjData = data.replace(/somecompany\.com/g,'burningbird.net');

	                  // write to file
	                  fs.writeFile('./data/' + name, adjData, function(err) {

	                     if (err) throw err;

	                     // log write
	                     writeStream.write('changed ' + name + '\n', 'utf8', 
	                                                                 function(err) {
	                        if(err) throw err;
	                     });
	                  });
	               });
	         });
	      });
	   });
	} catch(err) {
	  console.error(err);
	}
}