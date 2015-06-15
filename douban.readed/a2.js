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
           d = (element.children[0].data.trim()) 
           // 让往事随风而逝    2015-02-14 有个span，故而date取不出来。
           d = element.text()
           items.push({date:d})
    })
    return items
}

var fs = require('fs')
  , filename = "douban.readed.html"
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + filename);
  var a  = (hackhtml(data.trim()))
  console.log(a.length)
  console.log(a)
});
