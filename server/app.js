var path = require('path')
var express = require('express')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpack = require('webpack')
var webpackConfig = require('../webpack.config')

var app = express()
var compiler = webpack(webpackConfig)

// setup database
var setup = require('./components/db/setup')
setup.run()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, '../public')))

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/' // Same as `output.publicPath` in most cases.
}))

// Routes
app.use('/', require('./routes/index'))

var Book = require('./components/book/index')
var Chapter = require('./components/chapter/index')
var Picture = require('./components/picture/index')

app.use('/api/books', Book.api)
app.use('/api/chapters', Chapter.api)
app.use('/api/pictures', Picture.api)

app.use('/books', Book.router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
