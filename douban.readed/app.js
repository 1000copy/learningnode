var cheerio = require('cheerio');
var superagent = require('superagent');

function hackhtml(text){
  var $ = cheerio.load(text);
    var items = [];
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element);
      items.push({
        title: $element.attr('title'),
        href: $element.attr('href')
      });
    });
    return items
}

function hackhtml(text){
  var $ = cheerio.load(text);
    var items = [];
    $('.title a').each(function (idx, element) {
      var $element = $(element);
      items.push({
        title: $element.text().trim(),
        href: $element.attr('href')
      });
    });
    return items
}

function gettitle(element){
  return element.firstChild.firstChild.text();  
}

function hackhtml(text){
  var $ = cheerio.load(text);
    var items = [];
    $('.item-show').each(function (idx, element) {
      if (idx ==1){
        var $element = $(element);
        // console.log(element.children)
        for(var i=0;i<element.children.length;i++){
          var c =  element.children[i]
          if (c.type =='tag' && c.name =='div' && c.attribs.class == 'title')
          for(var j=0;j< c.children.length;j++){
            var d = c.children[j]
            if (d.type =='tag' && d.name =='a' ){
              console.log(d.children[0].data)            
              console.log(d.attribs.href)
          }
            // console.log(d)
          }
          // items.push({
          //   title: c.children[0].name
          //   // href: $element.attr('href')
          // });       
        }
      }
    });
    return items
}

function hackhtml(text){
  var $ = cheerio.load(text);
    var items = [];
    $('.item-show').each(function (idx, element) {
      // if (idx ==1){
      if (true){
        var $element = $(element);
        var c = childBy2(element,'div','title')
        var d = childBy1(c,'a')
        // console.log(d.children[0].data.trim())            
        // console.log(d.attribs.href.trim())                 
        var e = childBy2(element,'div','date')
        // console.log(d)
        // console.log(joinData(e).trim())
        items.push({
          title:d.children[0].data.trim(),
          href:d.attribs.href.trim(),
          date:joinData(e).trim()
        })
      }
    });
    return items
}

function joinData(element){
  var r  =''
  for(var i=0;i<element.children.length;i++){
    var c =  element.children[i]
    if (c.type =='text' ){
      // console.log(c)
        r += c.data
    }    
  }
  return r;
  // return undefined
}


function childBy2(element,tag,class1){
  for(var i=0;i<element.children.length;i++){
    var c =  element.children[i]
    if (c.type =='tag' && c.name ==tag && c.attribs.class == class1)
        return c    
  }
  return undefined
}
function childBy1(element,tag){
  for(var i=0;i<element.children.length;i++){
    var c =  element.children[i]
    if (c.type =='tag' && c.name ==tag )
        return c    
  }
  return undefined
}
url = 'https://cnodejs.org/'
url = "http://book.douban.com/people/1830596/collect?sort=time&start=159&filter=all&mode=list&tags_sort=count"
superagent.get(url)
  .end(function (err, sres) {
    if (err) {
      return next(err);
    }
    console.log (hackhtml(sres.text))    
  });


// superagent.get('https://cnodejs.org/')
//   .end(function (err, sres) {
//     if (err) {
//       return next(err);
//     }
//     console.log (hackhtml(sres.text))    
//   });