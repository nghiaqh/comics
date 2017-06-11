import app from './express-app'

const port = (process.env.PORT || 3000)
let server = app.listen(port)
console.log(`Listening at http://localhost:${port}`)

let currentApp = app

// Hot Module Reload
if (module.hot) {
 module.hot.accept('./express-app', () => {
  server.removeListener('request', currentApp)
  server.on('request', app)
  currentApp = app
 })
}
