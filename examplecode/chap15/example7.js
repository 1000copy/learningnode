var vm = require('vm');
var util = require('util');

var obj = { name: 'Shelley', domain: 'burningbird.net'};

// compile script
var script_obj = vm.createScript("var str = 'My name is ' + name + ' at ' + domain", 
                                  'test.vm');

// run in new context
script_obj.runInNewContext(obj);

// inspect sandbox object
console.log(util.inspect(obj));
