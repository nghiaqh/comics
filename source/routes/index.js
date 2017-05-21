import { authorAPI } from '../components/author'
import { bookAPI } from '../components/book'

const routes = require('express').Router()

/* API */
routes.use('/api/author', authorAPI)
routes.use('/api/book', bookAPI)

/* GET home page. */
routes.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'Home page' })
})

export { routes }
