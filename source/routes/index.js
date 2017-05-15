import { author } from '../components/author'

const routes = require('express').Router()

/* API */
routes.use('/api/author', author)

/* GET home page. */
routes.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'Home page' })
})

export { routes }
