var vm = require('vm');
var util = require('util');
var fs = require('fs');

fs.readFile('suspicious.js', 'utf8', function(err, data) {
  if (err) return console.log(err);

  try {

     console.log(data);
     var obj = { name: 'Shelley', domain: 'burningbird.net'};

     // compile script
     var script_obj = vm.createScript(data, 'test.vm');

     // run in new context
     script_obj.runInNewContext(obj);

     // inspect sandbox object
     console.log(util.inspect(obj));
  } catch(e) {
     console.log(e);
  }
});
