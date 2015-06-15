var check = require('validator').check,
    sanitize = require('validator').sanitize;

var email = 'shelley@burningbird.net';
var email2 = 'this is a test';

var str = '<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>';
try {
   check(email).isEmail();
   check(email2).isEmail();
} catch (err) {
   console.log(err.message);
}

var newstr = sanitize(str).xss();
console.log(newstr);
