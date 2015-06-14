var soda = require('soda');

var browser = soda.createSauceClient({
    'url': 'http://examples.burningbird.net:3000/'
  , 'username': 'yourusername'
  , 'access-key': 'your access key'
  , 'os': 'Linux'
  , 'browser': 'firefox'
  , 'browser-version': '3.'
  , 'max-duration': 300 // 5 minutes
});

// Log commands as they are fired
browser.on('command', function(cmd, args){
  console.log(' \x1b[33m%s\x1b[0m: %s', cmd, args.join(', '));
});

browser
  .chain
  .session()
  .setTimeout(8000)
  .open('/login')
  .waitForPageToLoad(5000)
  .type('username', 'Sally')
  .type('password', 'badpassword')
  .clickAndWait('//input[@value="Submit"]')
  .assertTextPresent('Invalid password')
  .end(function(err){
    browser.setContext('sauce:job-info={"passed": ' + (err === null) + '}', function(){
      browser.testComplete(function(){
        console.log(browser.jobUrl);
        console.log(browser.videoUrl);
        console.log(browser.logUrl);
        if (err) throw err;
      });
    });
  });  
