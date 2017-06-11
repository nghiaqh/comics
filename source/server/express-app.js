const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const webpackDevConfig = require('../../webpack.dev.config.js')

const app = express()
const { route } = require('./route')
const publicPath = express.static(path.join(__dirname, '../build/public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/public', publicPath)

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackDevConfig[0]);

  app.use(webpackDevMiddleware(compiler, {
    // this tells the middleware where to send assets in memory, so
    // if you're seeing 404's for assets it's probably because this isn't
    // set correctly in this middleware
    publicPath: webpackDevConfig[0].output.publicPath,
    hot: true,
    noInfo: false
  }));

  app.use(webpackHotMiddleware(compiler, {
    reload: true // reload page when webpack gets stuck
  }));
}

// Routes
app.use('/', route)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

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

export default app
