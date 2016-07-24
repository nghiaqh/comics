var gulp = require('gulp');
var gutil = require('gulp-util');
var fork = require('child_process').fork;
var jshint = require ('gulp-jshint');
var stylus = require('gulp-stylus');
var tinyLr = require('tiny-lr');
var async = require('async');

var dirs = {
	app: {
		template: [
			'views/{,*/}*.jade',
		],
		js: [
			'routes/{,*/}*.js',
			'components/{,*/}*.js',
			'helpers/{,*/}*.js',
			'middlewares/{,*/}*.js',
			'app.js'
		],
		css: [
			'components/{,*/}*.styl'
		]
	},
	public: [
		'public/javascripts/{,*/}*.js',
		'public/stylesheets/{,*/}*.css',
		'public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
	]
};

// Lint
gulp.task('jshint', function() {
	return gulp.src(dirs.app.js)
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

var livereload = {
	instance: null,

	port: 35729,

	start: function(callback) {
		livereload.instance = tinyLr();

		livereload.instance.listen(livereload.port, callback);
	},

	changed: function(event, callback) {
		var filepath = event.path;

		livereload.instance.changed({
			body: {
				files: [ filepath ]
			}
		});

		if (callback) callback();
	}
};

var app = {
	instance: {},

	path: './bin/www',

	env: { NODE_ENV: 'development', port: 3000 },

	start: function(callback) {
		process.execArgv.push('--harmony');

		app.instance = fork(app.path, {silent: true, env: app.env});
		app.instance.stdout.pipe(process.stdout);
		app.instance.stderr.pipe(process.stderr);

		gutil.log(gutil.colors.cyan('Starting'), 'express server (PID:', app.instance.pid, ')');

		if(callback) callback();
	},

	stop: function(callback) {
		if (app.instance.connected) {
			app.instance.on('exit', function() {
				gutil.log(gutil.colors.red('Stopping'), 'express server (PID:', app.instance.pid, ')');
				if (callback) callback();
			});
			return app.instance.kill('SIGINT');
		}

		if (callback) callback();
	},

	restart: function(event) {
		async.series([
			app.stop,
			app.start,
			function(event, callback) {
				livereload.changed(event, callback);
			}
		]);
	}
};


gulp.task('server', function(callback) {
	async.series([
		app.start,
		livereload.start
	], callback);
});


gulp.task('watch', function() {
	gulp.watch(dirs.app.js, ['jshint', app.restart]);
	gulp.watch('public/stylesheets/style.styl', ['stylus']);
	gulp.watch(dirs.public, livereload.changed);
});


gulp.task('default', ['server', 'watch']);
