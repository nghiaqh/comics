import { authorAPI } from './components/author'
import { bookAPI } from './components/book'
import { importAPI } from './components/import'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../client/react-app'

const route = require('express').Router()

/* API */
route.use('/api/author', authorAPI)
route.use('/api/book', bookAPI)
route.use('/api/import', importAPI)

route.get('*', function (req, res, next) {
  let application = renderToString(<App />)
  let html = `<!doctype html>
    <html class="no-js" lang="">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Comics</title>
            <meta name="description" content="">
            <meta name="viewport"
            content="width=device-width, initial-scale=1">
        </head>
        <body>
            <div id="root">${application}</div>
            <script src="/public/client.js"></script>
        </body>
    </html>`
  res.send(html)
})

export { route }
