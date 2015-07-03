var co = require('co');
var fs = require('fs')

// function readFile (callback) {
//   fs.readFile('myfile.md', 'utf8', callback);
// }

function readFile(filename) {
  return function(callback) {
    fs.readFile(filename, 'utf8', callback);
  };
}
function a(){
  console.log(readFile('readme1.md' ,function(){
    console.log("file*");
  })())

  co(function *my() {
    console.log("file1");
    var file1 = yield readFile('readme1.md')();
    var file2 = yield readFile('readme2.md')();
   console.log("file2");
    console.log("111212");
    console.log(file2);
  })
}
function c(){
  function delay(time, callback) {
    setTimeout(function () {
      callback("Slept for "+time);
    }, time);
  }
  
  function run(generatorFunction) {
    var generatorItr = generatorFunction(resume);
    function resume(callbackValue) {
        generatorItr.next(callbackValue);
    }
    generatorItr.next()
  }
  run(function  *myDelayedMessages(resume) {
      console.log(yield delay(1000, resume));
      console.log(yield delay(2000, resume));
  })
}
a()