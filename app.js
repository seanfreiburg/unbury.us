const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

const routes = require('./routes/index');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disabled due to inline scripts in views
}));

// Compression middleware
app.use(compression());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Logging and parsing middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler - prints stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Start server
const debug = require('debug')('unbury.us');
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
  debug('Express server listening on port ' + server.address().port);
  console.log('Server running at http://localhost:' + port);
});
