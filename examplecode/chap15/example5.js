var express = require('express')
  , flash = require('connect-flash')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , http = require('http');

var mysql = require('mysql');

var TWITTER_CONSUMER_KEY = "yourkey";
var TWITTER_CONSUMER_SECRET = "yoursecret";

var client = mysql.createClient({
   user : 'username',
   password : 'password'
});

client.query('USE nodetest2');

function findUser(id, callback) {
   var user;

   client.query('SELECT * FROM twitteruser WHERE id = ?',
              [id], function(err, result, fields) {
       if (err) return callback(err);
       user = result[0];
       console.log(user);
       return callback(null,user);
  });
};

function createUser(profile, token, tokenSecret, callback) {

   var qryString = 'INSERT INTO twitteruser ' +
                   '(id, name, screenname, location, description,' +
                   'url, img, token, tokensecret)' +
                   ' values (?,?,?,?,?,?,?,?,?)';
   client.query(qryString, [
             profile.id,
             profile.displayName,
             profile.username,
             profile._json.location,
             profile._json.description,
             profile._json.url,
             profile._json.profile_image_url,
             token,
             tokenSecret], function(err, result) {
                if (err) return callback(err);
                var user = {
                  id : profile.id,
                  name : profile.displayName,
                  screenname : profile.screen_name,
                  location : profile._json.location,
                  description: profile._json.description,
                  url : profile._json.url,
                  img : profile._json.profile_image_url,
                  token : token,
                  tokensecret : tokenSecret};
                  console.log(user);
                  return callback(null,user);
              });
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/twitter')
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   findUser(id, function(err, user) {
      done(err,user);
   });
});

passport.use(new TwitterStrategy(
       { consumerKey: TWITTER_CONSUMER_KEY,
         consumerSecret: TWITTER_CONSUMER_SECRET,
         callbackURL: "http://examples.burningbird.net:3000/auth/twitter/callback"},
       function(token, tokenSecret,profile,done) {
          findUser(profile.id, function(err,user) {
             console.log(user);
             if (err) return done(err);
             if (user) return done(null, user);
             createUser(profile, token, tokenSecret, function(err, user) {
               return done(err,user);
             });
          })
       })
);

var app = express();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
  res.render('index', { title: 'authenticate', user: req.user });
});

app.get('/admin', ensureAuthenticated, function(req, res){
  res.render('admin', { title: 'authenticate', user: req.user });
});

app.get('/auth', function(req,res) {
   res.render('auth', { title: 'authenticate' });
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
  });

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/admin');
  });

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");
