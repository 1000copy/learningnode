var Browser = require('zombie');
var assert = require('assert');

var browser = new Browser();

browser.visit('http://localhost:3000/login', function() {
   browser.
   fill('username', 'Sally').
   fill('password', 'apple').
   pressButton('Submit', function() {
      assert.equal(browser.location.pathname, '/admin');
  });
});
