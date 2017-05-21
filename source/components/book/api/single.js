const Book = require('../book')
const _ = require('lodash')

function createOne (req, res, next) {
  const book = new Book(req.body.title, req.body.description, req.body.coverPicture, req.body.seriesId)
  book.save().then(data => {
    book.id = data[0]
    res.status(200).json({ message: 'Created a new book', data: book })
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function getOne (req, res) {
  let p
  let s = 'id'
  const id = req.params.bookId

  if (Number.isInteger(id * 1)) {
    p = Book.findById(id)
  } else {
    p = Book.findByName(id)
    s = 'name'
  }

  p.then(data => {
    if (_.isArray(data) && data.length === 0) {
      res.status(404).json({ message: 'No book with ' + s + ' ' + id })
    } else {
      res.status(200).json({ data: data })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function deleteOne (req, res, next) {
  let p
  let s = 'id'
  const id = req.params.bookId

  if (Number.isInteger(id * 1)) {
    p = Book.deleteById(id)
  } else {
    p = Book.delete({ title: id })
    s = 'name'
  }

  p.then(data => {
    if (data) {
      res.status(200).json({ message: 'Deleted book with ' + s + ' ' + id })
    } else {
      res.status(404).json({ message: 'No book with ' + s + ' ' + id })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function updateOne (req, res, next) {
  let p
  let s = 'id'
  const id = req.params.bookId

  if (Number.isInteger(id * 1)) {
    p = Book.findById(id)
  } else {
    p = Book.findByName(id)
    s = 'name'
  }

  p.then(data => {
    if (!data) {
      res.status(404).json({ message: 'No book with ' + s + ' ' + id })
    } else {
      const book = new Book(data[0].title, data[0].description, data[0].coverPicture, data[0].series_id, data[0].book_id, data[0].number_of_chapters)
      if (typeof req.body.title !== 'undefined') {
        book.title = req.body.title
      }

      if (typeof req.body.description !== 'undefined') {
        book.description = req.body.description
      }

      if (typeof req.body.coverPicture !== 'undefined') {
        book.coverPicture = req.body.coverPicture
      }

      if (typeof req.body.seriesId !== 'undefined') {
        book.seriesId = req.body.seriesId
      }

      if (typeof req.body.numberOfChapters !== 'undefined') {
        book.numberOfChapters = req.body.numberOfChapters
      }

      book.save().then(data => {
        if (data) {
          res.status(200).json({
            message: 'Updated book id ' + id,
            data: book
          })
        }
      }).catch(err => {
        res.status(400).json({ message: err.message })
      })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

export { createOne, getOne, deleteOne, updateOne }
