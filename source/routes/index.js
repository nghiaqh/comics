import { authorAPI } from '../components/author'
import { bookAPI } from '../components/book'
import { importAPI } from '../components/import'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../app'

const routes = require('express').Router()

/* API */
routes.use('/api/author', authorAPI)
routes.use('/api/book', bookAPI)
routes.use('/api/import', importAPI)

/* GET home page. */
routes.get('/*', function (req, res, next) {
  let application = renderToString(<App />)
  let html = `<!doctype html>
    <html class="no-js" lang="">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Comics</title>
            <meta name="description" content="">
            <meta name="viewport"
            content="width=device-width,  initial-scale=1">
        </head>
        <body>
            <div id="root">${application}</div>
            <script src="/public/bundle.js"></script>
        </body>
    </html>`
  res.send(html)
  // res.render('index.jade', { title: 'Comics - Home page', application: application })
})

export { routes }
