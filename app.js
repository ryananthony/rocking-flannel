
/**
 * Module dependencies.
 */

var express = require('express')
  , less = require('less')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , dutils = require('date-utils')
  , db = require('./local_modules/db/db');

var app = express();

var pub = __dirname + '/public';

//global.dutils = dutils
global.couch = db
// allow database available in other modules
//exports.couch = couch


//middleware for passing variables to routes
save_vars = function(req, res, next) {
  console.log(req.params)
  res.locals.params = req.params;
  next();
};

app.configure('development', function(){
  app.disable('view cache');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('less-middleware')({ src: pub }));
  app.use(express.favicon(pub + '/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1}));
});


// app.get('/', function(req, res, next){
//   console.log(req.body)
//   next()
// }, routes.index);

//Static Routes here
app.get('/', routes.index);
app.get('/band', function(req,res) {res.render('band')});
app.get('/music', function(req,res) {res.render('music')});
app.get('/video', function(req,res) {res.render('video')});
app.get('/shows', function(req,res) {res.render('shows')});
app.get('/photos', function(req,res) {res.render('photos')});

//CAN ONLY POST TO add_song ROUTE
app.post('/add_song', function(req, res, next){
  //console.log(req.body + req.ip)
  res.locals.submission = req.body
  res.locals.ip = req.ip
  next()
}, routes.add_song);

app.post('/vote', function(req, res, next){
  console.log(JSON.stringify(req.body) + ' ' + req.ip)
  res.locals = req.body
  res.locals.ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  next()
}, routes.vote);

app.get('/vote', routes.vote);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
