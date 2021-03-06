var express = require('express'); // imports framework into app
var path = require('path'); // path is a Node module for working with and handling paths
var logger = require('morgan'); // Express middleware for logging requests and responses
var bodyParser = require('body-parser'); // adds a body object to your request so that you can access POST parameters
var favicon = require('serve-favicon');
//var cookieParser = require('cookie-parser'); 
var change = 'I made a change';
// paths to routers
var index = require('./routes/index');
var data = require('./routes/data');

var app = express(); // initate app
app.use(express.static(path.join(__dirname, 'public'))); // tells app to use the /public directory

// view engine setup
app.set('views', path.join(__dirname, 'views')); // path.join() normalises all the arguments into a path string. _dirname = global and 'views' = file/folder name
app.set('view engine', 'pug'); // set the view engine to pug

app.use(logger('dev')); // logs the requests to the console
app.use(bodyParser.json()); // gives app the ability to parse JSON
app.use(bodyParser.urlencoded({ extended: false })); // allows app to read data from URLs
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(cookieParser()); // adds cookie object to all requests you get

// create routes from the above paths to the following jade pages 
app.use('/', index);
app.use('/', data);

//error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error');
  res.status(err.status || 500);
});

module.exports = app;
