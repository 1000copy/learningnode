var assert = require('assert');
var util = require('util');

// isArraya
try {
assert.throws(
  function() {
    throw new Error("Wrong value");
  },
  /something/
  ,
  "Wasn't expected error"
  )
} catch(e) {
  console.log(e.message);
}
