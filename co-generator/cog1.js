function delay(time, callback) {
  setTimeout(function () {
    callback("Slept for "+time);
  }, time);
}

delay(1000,function(s){console.log(s)})