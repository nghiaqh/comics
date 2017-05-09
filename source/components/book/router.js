// /* jslint node: true */
// 'use strict'
// const express = require('express')
// const router = express.Router()
// const Book = require('./book')
// const schemas = require('../database/schemas')
// const path = require('path')
//
// /* GET all books */
// router.get('/', function (req, res, next) {
//   const page = req.query.page || 0
//   const conditions = {}
//
//   if (!isNaN(parseInt(req.query.series)) && parseInt(req.query.series) > 0) {
//     conditions.seriesId = req.query.series
//   }
//
//   Book.getAll(page, conditions, function (err, result) {
//     if (err !== null) {
//       res.status(400)
//       next()
//     } else {
//       console.log(result)
//       res.render(path.join(__dirname, './templates/books.jade'), result)
//     }
//   })
// })
//
// router.get('/add', function (req, res, next) {
//   const item = schemas.book
//   const data = {
//     seoTitle: 'Add a new book',
//     seoDescription: 'Add a new book',
//     item: item
//   }
//
//   res.render(path.join(__dirname, '/templates/edit-form.jade'), data)
// })
//
// router.get('/:bookId', function (req, res, next) {
//   Book.findById(req.params.bookId, function (err, item) {
//     if (err !== null) {
//       res.status(400)
//       next()
//     } else {
//       const data = {
//         seoTitle: item.title,
//         seoDescription: item.description.substr(0, 164),
//         item: item
//       }
//
//       res.render(path.join(__dirname, '/templates/book.jade'), data)
//     }
//   })
// })
//
// router.get('/:bookId/edit', function (req, res, next) {
//   Book.findById(req.params.bookId, function (err, item) {
//     if (err !== null) {
//       res.status(400)
//       next()
//     } else {
//       const data = {
//         seoTitle: item.title,
//         seoDescription: item.description.substr(0, 164),
//         item: item
//       }
//
//       res.render(path.join(__dirname, '/templates/edit-form.jade'), data)
//     }
//   })
// })
//
// module.exports = router
