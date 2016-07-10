var gulp = require('gulp');
var jshint = require ('gulp-jshint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var jsFolders = ['routes/**/*.js', 'models/**/*.js', 'middlewares/**/*.js'];

// Lint
gulp.task('jshint', function() {
	return gulp.src(jsFolders)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Stylus
gulp.task('stylus', function() {
	return gulp.src('public/stylesheets/style.styl')
		.pipe(stylus({
			compress: true
		}))
		.pipe(gulp.dest('public/stylesheets'));
});

// Live Reload
var tinylr;
gulp.task('livereload', function() {
	tinylr = require('tiny-lr')();
	var port = 35729;
	tinylr.listen(port, function() {
		console.log('LiveReload is listening on %s ...', port);
	});
});

function notifyLiveReload(event) {
	var fileName = require('path').relative(__dirname, event.path);
	console.log('Change detected in: ', fileName);
	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

// Start express server
var port = normalizePort(process.env.PORT || '3000');
gulp.task('express', function() {
	var app = require('./app');
	app.set('port', port);

	var debug = require('debug')('mangareader:server');
	var http = require('http');
	var server = http.createServer(app);
	server.listen(port);
	server.on('error', onError);
	server.on('listening', function() {
		var addr = server.address();
		var bind = typeof addr === 'string'
			? 'pipe ' + addr
			: 'port ' + addr.port;
		debug('Listening on ' + bind);
		console.log('App is running at http://localhost:%s', addr.port);
	});
});

gulp.task('watch', function() {
	gulp.watch(jsFolders, ['jshint']);
	gulp.watch('public/stylesheets/**/*.styl', ['stylus']);
	gulp.watch('views/**/*.jade', notifyLiveReload);
	gulp.watch('public/stylesheets/*.css', notifyLiveReload);
});

gulp.task('default', ['express', 'livereload', 'watch']);


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
