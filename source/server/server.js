const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const webpackDevConfig = require('../../webpack.dev.config.js')

const expressApp = express()
const { route } = require('./route')
const publicPath = express.static(path.join(__dirname, '../build/public'))

// view engine setup
// expressApp.set('views', path.join(__dirname, 'views'))
// expressApp.set('view engine', 'jade')
expressApp.use(bodyParser.json())
expressApp.use(bodyParser.urlencoded({ extended: true }))
expressApp.use(cookieParser())
expressApp.use('/public', publicPath)

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackDevConfig[0]);

  expressApp.use(webpackDevMiddleware(compiler, {
    // this tells the middleware where to send assets in memory, so
    // if you're seeing 404's for assets it's probably because this isn't
    // set correctly in this middleware
    publicPath: webpackDevConfig[0].output.publicPath,
    hot: true,
    noInfo: false
  }));

  expressApp.use(webpackHotMiddleware(compiler, {
    reload: true // reload page when webpack gets stuck
  }));
}

// Routes
expressApp.use('/', route)

// catch 404 and forward to error handler
expressApp.use(function (req, res, next) {
  const err = new Error('Page Not Found')
  err.status = 404
  next(err)
})

// development error handler
// will print stacktrace
if (expressApp.get('env') === 'development') {
  expressApp.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
  })
}

// production error handler
// no stacktraces leaked to user
expressApp.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

export default expressApp
