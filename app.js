var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('webhook-server:server');

var app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(logger('dev'));
app.use(bodyParser.json({type: 'application/cloudevents+json'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

/* Here we process the request to make a payload object. This payload object is emitted to
 * the UI and placed into a fixed template using io.sockets.
 * Please note the return line. That is required for when you register for a new webhook.
 * Event Gateway will send you a challenge (it will be a GET), and expects you to extract the
 * challenge string and send it back. Without this step. your webhook will fail to register.
*/
app.use('/webhook', function(req, res) {

  var payload = {
    headers : req.headers || {},
		params : req.params || {},
		query : req.query,
		path: req.path,
		protocol : req.protocol,
		method: req.method,
		body : req.body,
		time : new Date()
	};

  io.sockets.emit('webhookEvent:' + req.path.replace('/', ''), payload);
  io.sockets.emit('webhookEvent:all', payload);

  // handle the challenge
  return res.send(req.query.challenge);

});

io.on('connection', function (socket) {
  socket.emit('welcome', {});  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

module.exports = app;


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
