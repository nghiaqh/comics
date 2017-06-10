import { authorAPI } from '../components/author'
import { bookAPI } from '../components/book'
import { importAPI } from '../components/import'

const routes = require('express').Router()

/* API */
routes.use('/api/author', authorAPI)
routes.use('/api/book', bookAPI)
routes.use('/api/import', importAPI)

/* GET home page. */
routes.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'Home page' })
})

export { routes }
