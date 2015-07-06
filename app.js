var co = require('co');


function delay(time) {
  return function (callback){
    setTimeout(function () {//
      callback(null,"Slept for "+time);
    }, time);
  }
}


function add(x, y) {
  return function(callback) {
    callback(null, x + y);
  };
}

function readFile(file){
  return function (callback ){
    // callback(null,"data")
    var fs = require("fs")
    fs.readFile(file, function(err,data){
      callback(null,data)
    })
  }
}

function readFile(file){
  return function (callback ){
    var fs = require("fs")
    fs.readFile(file,callback)
  }
}

co(function *() {
  var fs = require("co-fs")
  var json = yield fs.readFile('./app1.js', 'utf8')
  var files = yield fs.readdir('.')
  console.log(json,files)
})
return
var fs = require("fs")
// var content;
// // First I want to read the file
// fs.readFile('./app.js', function read(err, data) {
//     if (err) {
//         throw err;
//     }    
//     processFile(data);  
// });

// function processFile(data) {
//     console.log(data.slice(0,10));
// }



function run(generatorFunction) {
  // console.log("--------------------------------1")
    var generatorItr = generatorFunction(resume);
    function resume(err,data) {
      if(err)
        throw err
      else
        generatorItr.next(data);
    }
    generatorItr.next()
}
run(function* myDelayedMessages(resume) {
  var d =yield fs.readFile("./app1.js", resume)
  console.log(d.toString().slice(0,10));
}) 
// return 
// function delay(time, callback) {
//   setTimeout(function () {
//     callback("Slept for "+time);
//   }, time);
// }


// // delay(1000, function(msg) {
// //   console.log(msg);
// //   delay(1200, function (msg) {
// //       console.log(msg);
// //     })
// // }) 

// setTimeout(function(){console.log("first")})

// function* myDelayedMessages(resume) {
//     console.log(yield delay(1000, resume));
//     console.log(yield delay(1200, resume));
// }
// function run(generatorFunction) {
//     var generatorItr = generatorFunction(resume);
//     function resume(callbackValue) {
//         generatorItr.next(callbackValue);
//     }
//     generatorItr.next()
// }

// run(function* myDelayedMessages(resume) {
//     console.log(yield delay(1000, resume));
//     console.log(yield delay(1200, resume));
// }) 
