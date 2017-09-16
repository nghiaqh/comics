import { AuthorAPI } from './components/author'
import { BookAPI } from './components/book'
import { ImportAPI } from './components/import'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import ReactApp from '../client/ReactApp'

const route = require('express').Router()

/* API */
route.use('/api/author', AuthorAPI)
route.use('/api/book', BookAPI)
route.use('/api/import', ImportAPI)

route.get('*', function (req, res, next) {
  let style = ``
  if (process.env.NODE_ENV === 'production') {
    style = `<link rel="stylesheet" href="public/app.css">`
  }

  const context = {}
  let application = renderToString(
    <StaticRouter location={req.url} context={context}>
      <ReactApp/>
    </StaticRouter>
  )

  let html = `<!doctype html>
    <html class="no-js" lang="">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Comics</title>
            <meta name="description" content="">
            <meta name="viewport"
            content="width=device-width, initial-scale=1">
            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

            <!-- Optional theme -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

            ${style}
        </head>
        <body>
            <div id="app">${application}</div>
            <script src="/public/client.js"></script>
        </body>
    </html>`

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    })
    res.end()
  } else {
    res.send(html)
  }
})

export { route }
