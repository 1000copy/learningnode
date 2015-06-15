var util = require('util');

function first() {
  var self = this;
  this.name = 'first';
  this.test = function() {
    console.log(self.name);
   };
}

first.prototype.output = function() {
   console.log(this.name);
}

function second() {
  second.super_.call(this);
  this.name = 'second';
}
util.inherits(second,first);

var two = new second();

function third(func) {
   this.name = 'third';
   this.callMethod = func;
}

var three = new third(two.test);

// all three should output "second"
two.output();
two.test();
three.callMethod();
