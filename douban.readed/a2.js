var cheerio = require('cheerio');
var superagent = require('superagent');

function hackhtml(text){
  var $ = cheerio.load(text);
    var items = [];
    $('.item-show').each(function (idx, element) {
      if(true){
        var $element = $(element);
        // console.log($element)
        var title,href,d
        $('div.title a ',$element).each(function(idx,elem){
           title = (elem.attribs.href) 
           href =  (elem.children[0].data.trim())          
         })
        
        $('div.date',$element).each(function(idx,elem){
           d = (elem.children[0].data.trim()) 
         })
        items.push({title:title,href:href,date:d})
      }
    });
    return items
}

function joinData(element){
  var r  =''
  for(var i=0;i<element.children.length;i++){
    var c =  element.children[i]
    if (c.type =='text' ){      
        r += c.data
    }    
  }
  return r;  
}

function hackhtml(text){
  var $ = cheerio.load(text);
    var items = [];
    $('.item-show div.title a').each(function (idx, element) {     
         var $element = $(element);
        var title,href,d
        href = (element.attribs.href) 
        title =  (element.children[0].data.trim())   
        // items.push({title:title,href:href})             
        items.push({title:title})             
    });
    $('.item-show div.date').each(function (idx, element) {
        // if (idx ==2 || idx ==1 ){
        if (true){
           d = (element.children[0].data.trim()) 
           if (d == "" ){
             d = joinData(element).trim()
           }
           items.push({date:d})
         }
    })
    return items
}

var fs = require('fs')
  , filename = "douban.readed1.html"
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + filename);
  var a  = (hackhtml(data.trim()))
  console.log(a.length)
  console.log(a)
});
