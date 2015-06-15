var Canvas = require('canvas');
var fs = require('fs');

  // new canvas and context
  var canvas = new Canvas(350,350);
  var ctx = canvas.getContext('2d');

  // create filled rectangle with shadow
  // save context for later restore
  ctx.save();
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 5;
  ctx.shadowColor='rgba(0,0,0,0.4)';

  ctx.fillStyle = '#fff';
  ctx.fillRect(30,30,300,300);

  // done with shadow
  ctx.restore();
  ctx.strokeRect(30,30,300,300);

  // MDN example: pretty graphic, inserted offset into
  // previously created square
  ctx.translate(125,125);
  for (i=1;i<6;i++){
    ctx.save();
    ctx.fillStyle = 'rgb('+(51*i)+','+(255-51*i)+',255)';
    for (j=0;j<i*6;j++){
    ctx.rotate(Math.PI*2/(i*6));
    ctx.beginPath();
    ctx.arc(0,i*12.5,5,0,Math.PI*2,true);
    ctx.fill();
    }
    ctx.restore();
  }
  // stream to PNG file
  var out = fs.createWriteStream(__dirname + '/shadow.png');
  var stream = canvas.createPNGStream();

  stream.on('data', function(chunk){
    out.write(chunk);
  });

  stream.on('end', function(){
    console.log('saved png');
  });
