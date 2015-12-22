var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var db = require('monk')('localhost:27017/test');
var CronJob = require('cron').CronJob;
var crawler = require('./controllers/crawler');
var storePolls = require("./controllers/storePolls.js");

var routes = require('./routes/index');
var users = require('./routes/users');
var polls = require('./routes/polls');

var app = express();

app.set('port', process.env.PORT || 80);

console.log('Starting!');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    if (!req.db) {
      console.log('db empty');
    }
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/polls', polls);

var job = new CronJob({
  cronTime: '00 12 04 * * *',
  onTick: function() {
    crawler.pullData(function(data) {
      storePolls.store(data,db);
    });
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

app.get('/', function(req, res){
  console.log("going to slash");

  db.driver.admin.listDatabases(function(e, dbs){
    console.log(dbs);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
