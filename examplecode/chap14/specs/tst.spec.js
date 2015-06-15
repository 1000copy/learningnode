var zombie = require('zombie');

describe('jasmine-node', function(){

    it("should respond with Hellow, World!", function(done) {
      zombie.visit("http://examples.burningbird.net:8124", 
                                           function(error, browser, status){
        expect(browser.text()).toEqual("Hello, World!\n");
        done();
      });
    });
});
