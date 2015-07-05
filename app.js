
var http = require("http");
  var url = require("url");

  var m ={}
  m["/form"] = form
  m["/upload"] = upload
  m[404] = h404

  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    var f = m[pathname]
    if(f)
      f(request, response)
    else  
      h404()
  }
  http.createServer(onRequest).listen(8080);
  function h404(request, response){
    if(response){
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
  }
  function upload(request, response){
      request.setEncoding("utf8");
      var postData
      var count = 0 
      request.addListener("data", function(postDataChunk) {
        console.log("postDataChunk.length:",postDataChunk.length);
        postData += postDataChunk;
        count++      
      });
      request.addListener("end", function() {
        console.log(count);
      });
  }
  function form(request, response){
    var body = 
      '<form action="/upload" method="post">'+
      '<textarea name="text" rows="20" cols="60"></textarea>'+
      '<input type="submit" value="Submit text" />'
      
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(body);
      response.end();
  }

function a(){var d  ="ls zoo -ARBC bin a b c".split(' ')
    var d  ="ls zoo -ARBC bin".split(' ')
    var argv = opt(d);
    console.dir(argv);
    console.log("hi,world")
    var assert = require("assert")
    assert.equal(true,false)
}
function opt(args) {
    
    var flags = { bools : {}, strings : {}, unknownFn: null };    
    
    var argv = { _ : [] };

    Object.keys(flags.bools).forEach(function (key) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    


    function argDefined(key, arg) {
        return (flags.allBools && /^--[^=]+$/.test(arg)) ||
            flags.strings[key] || flags.bools[key] || aliases[key];
    }

    function setArg (key, val, arg) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg) === false) return;
        }

        var value = !flags.strings[key] && isNumber(val)
            ? Number(val) : val
        ;
        setKey(argv, key.split('.'), value);
        
    }

    function setKey (obj, keys, value) {
        var o = obj;
        keys.slice(0,-1).forEach(function (key) {
            if (o[key] === undefined) o[key] = {};
            o = o[key];
        });

        var key = keys[keys.length - 1];
        if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
            o[key] = value;
        }
        else if (Array.isArray(o[key])) {
            o[key].push(value);
        }
        else {
            o[key] = [ o[key], value ];
        }
    }
    
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
         if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1).split('');
            
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
                var next = arg.slice(j+2);
                
                if (next === '-') {
                    setArg(letters[j], next, arg)
                    continue;
                }
                
                if (/[A-Za-z]/.test(letters[j])
                && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                
                if (letters[j+1] && letters[j+1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j+2), arg);
                    broken = true;
                    break;
                }
                else {
                    setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
                }
            }
            
            var key = arg.slice(-1)[0];
            if (!broken && key !== '-') {
               
                if (args[i+1] && /true|false/.test(args[i+1])) {
                    setArg(key, args[i+1] === 'true', arg);
                    i++;
                }
                else {
                    setArg(key, flags.strings[key] ? '' : true, arg);
                }
            }
        }
        else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(
                    flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
                );
            }
            
        }
    }
    
    
    
    
    return argv;
};

function hasKey (obj, keys) {
    var o = obj;
    keys.slice(0,-1).forEach(function (key) {
        o = (o[key] || {});
    });

    var key = keys[keys.length - 1];
    return key in o;
}

function isNumber (x) {
    if (typeof x === 'number') return true;
    if (/^0x[0-9a-f]+$/i.test(x)) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

