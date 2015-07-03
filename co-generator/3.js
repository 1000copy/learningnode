function co(generator) {
  return function(fn) {
    var gen = generator();
    function next(err, result) {
        if(err){
            return fn(err);
        }
        var step = gen.next(result);
        if (!step.done) {
            step.value(next);
        } else {
            fn(null, step.value);
        }
    }
    next();
   }
}

function readFile(filename) {
    return function(callback) {
        require('fs').readFile(filename, 'utf8', callback);
    };
}

co(function * () {
    var file1 = yield readFile('cog.js');
    var file2 = yield readFile('cog1.js');

    console.log(file1.slice(0,100));
    console.log(file2.slice(0,100));
    return 'done';
})(function(err, result) {
    console.log(result)
});