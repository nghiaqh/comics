const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const Book = require('./components/book/index')
const Chapter = require('./components/chapter/index')
const Picture = require('./components/picture/index')

module.exports = {
  app: function () {
    const app = express()
    const publicPath = express.static(path.join(__dirname, '../build'))

    // setup database
    const setup = require('./components/db/setup')
    setup.run()

    // view engine setup
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'jade')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use('/public', publicPath)

    // Routes
    app.use('/', require('./routes/index'))
    app.use('/api/books', Book.api)
    app.use('/api/chapters', Chapter.api)
    app.use('/api/pictures', Picture.api)

    app.use('/books', Book.router)

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

    return app
  }
}
