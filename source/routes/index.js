import { author } from '../components/author/api'

const routes = require('express').Router()

/* API */
routes.use('/data/author', author)

/* GET home page. */
routes.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'Home page' })
})

export { routes }
