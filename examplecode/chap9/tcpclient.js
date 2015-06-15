var net = require('net');

var client = new net.Socket();
client.setEncoding('utf8');

// connect to TCP server
client.connect ('8124','examples.burningbird.net', function () {
    console.log('connected to server');
});

// prepare for input from terminal
process.stdin.resume();

// when receive data, send to server
process.stdin.on('data', function (data) {
   client.write(data);
});

// when receive data back, print to console
client.on('data',function(data) {
    console.log(data);
});

// when server closed
client.on('close',function() {
    console.log('connection is closed');
}); 
