import app from './express-app'

const port = (process.env.PORT || 3000)
let server = app.listen(port)
console.log(`Listening at http://localhost:${port}`)
