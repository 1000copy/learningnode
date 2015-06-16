var cheerio = require('cheerio');
var superagent = require('superagent');


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
    var titles = [];
    var dates = [];
    $('.item-show div.title a').each(function (idx, element) {     
         var $element = $(element);
        var title,href,d
        href = (element.attribs.href) 
        title =  (element.children[0].data.trim())   
        titles.push(title)             
    });
    $('.item-show div.date').each(function (idx, element) {
        // if (idx ==2 || idx ==1 ){
        if (true){
           d = (element.children[0].data.trim()) 
           if (d == "" ){
             d = joinData(element).trim()
           }
           dates.push(d)
         }
    })
    return {titles:titles,dates:dates}
}
function run(){
  var fs = require('fs')
    , filename = "douban.readed.html"
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filename);
    var a  = (hackhtml(data.trim()))
    console.log(a.length)
    console.log(a)
  });
}
// run()

function run(){
  var fs = require('fs')
    , filename = "douban.readed.html"
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filename);
    var a  = (hackhtml(data.trim()))
    console.log(a.length)
    console.log(a)
  });
}


function fetch(start){
  url = "http://book.douban.com/people/1830596/collect?sort=time&filter=all&mode=list&tags_sort=count&start="
  url += start

  superagent.get(url)
    .set("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36")
    .end(function (err, sres) {
      console.log("*")
      if (err) {
        return next(err);
      }
      console.log("-")      
      savehtml(sres.text)            
    });
  function savehtml(text){
    var fs = require('fs');
    fs.writeFile("douban."+start+".html",text, function(err) {
        if(err) {
            return console.log(err);
        }
        // console.log("The file was saved!");
        // callback()
    }); 
  }
}
function fetch_get_count(){
  // url = "http://book.douban.com/people/1830596/collect?sort=time&filter=all&mode=list&tags_sort=count&start="
  url = "http://book.douban.com/people/1830596/collect?sort=time&filter=all&mode=list&tags_sort=count&start="
  url += 0
  var book_count = 0
  superagent.get(url)
    .end(function (err, sres) {
      console.log("*")
      if (err) {
        return next(err);
      }
      console.log(sres.text)
      book_count = fetch_count(sres.text)      
        return book_count
      })    
}
function r(){
  var i = 0 
  var book_count = fetch_get_count()
  while ( i*30 <book_count){    
    console.log(i)
      fetch(30*i++)
    }
}
// r()
function run1(){
  var fs = require('fs')
    , filename = "douban.readed.html"
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    var a  = (fetch_count(data.trim()))
    // console.log(a.length)
    // console.log(a)
  });
}


function fetch_count(text){
  var $ = cheerio.load(text);
    var titles = [];
    var dates = [];
    $('html head title').each(function (idx, element) {     
        var $element = $(element);
        var title = $element[0].children[0].data
        return get_count(title)
    });
    
}
// console.log(get_count("1000copy读过的书(162)")) ---> 162
function get_count(title){
  console.log("title"+title)
  var r = new RegExp(/\(.*\)/)
  return +title.match(r)[0].slice(1,-1)
}
// r()
fetch(0)

// fetch_get_count()