const Server = require('./server.js')
const port = (process.env.PORT || 3000)
const app = Server.app()

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.dev.config.js')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    serverSideRender: true,
    noInfo: true,
    publicPath: config[0].output.publicPath,
    stats: { colors: true }
  }))

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }))
}

app.listen(port)
console.log(`Listening at http://localhost:${port}`)
