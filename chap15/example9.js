var vm = require('vm');
var util = require('util');
var fs = require('fs');

fs.readFile('suspicious.js', 'utf8', function(err, data) {
  if (err) return console.log(err);

  try {

     var obj = { name: 'Shelley', domain: 'burningbird.net' };

     // compile script
     var script_obj = vm.createScript(data, 'test.vm');

     // create context
     var ctx = vm.createContext(obj);

     // run in new context
     script_obj.runInContext(ctx);

     // inspect object
     console.log(util.inspect(obj));


     // inspect context
     console.log(util.inspect(ctx));

  } catch(e) {
     console.log(e);
  }
});
