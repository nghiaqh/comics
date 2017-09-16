import { Page } from '../Page'
const _ = require('lodash')

function createOne (req, res, next) {
  const page = new Page(
    req.body.number,
    req.body.src,
    req.params.bookId,
    req.body.chapterId)
  page.save().then(data => {
    page.id = data[0]
    res.status(200).json({ message: 'Created a new page', data: page })
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function getOne (req, res) {
  let p
  const id = req.params.pageId

  if (Number.isInteger(id * 1)) {
    p = Page.findById(id)
  } else {
    res.status(400).json({ message: 'Invalid page id' })
  }

  p.then(data => {
    if (_.isArray(data) && data.length === 0) {
      res.status(404).json({ message: 'No page with id ' + id })
    } else {
      const page = new Page(
        data[0].number,
        data[0].src,
        data[0].book_id,
        data[0].chapter_id)
      res.status(200).json({ page: page })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function deleteOne (req, res, next) {
  let p
  const id = req.params.pageId

  if (Number.isInteger(id * 1)) {
    p = Page.deleteById(id)
  } else {
    res.status(400).json({ message: 'Invalid page id' })
  }

  p.then(data => {
    if (data) {
      res.status(200).json({ message: 'Deleted page with id ' + id })
    } else {
      res.status(404).json({ message: 'No page with id ' + id })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function updateOne (req, res, next) {
  let p
  const bookId = req.params.bookId
  const id = req.params.pageId

  if (Number.isInteger(id * 1)) {
    p = Page.findById(id)
  } else {
    res.status(400).json({ message: 'Invalid page id' })
  }

  p.then(searchResult => {
    if (_.isArray(searchResult) && searchResult.length === 0) {
      res.status(404).json({ message: 'No page with id ' + id })
    } else {
      const page = new Page(
        data[0].number,
        data[0].src,
        data[0].book_id,
        data[0].chapter_id)

      // Update page properties
      // TODO: create a function for this task
      if (typeof req.body.number !== 'undefined') {
        page.number = req.body.number
      }

      if (typeof req.body.src !== 'undefined') {
        page.src = req.body.src
      }

      if (typeof req.body.bookId !== 'undefined') {
        page.bookId = req.body.bookId
      }

      if (typeof req.body.chapterId !== 'undefined') {
        page.chapterId = req.body.chapterId
      }

      // Save the modified book object to database
      page.save().then(isSaved => {
        if (isSaved) {
          res.status(200).json({
            message: 'Updated page id ' + id,
            data: page
          })
        }
      })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

export { createOne, getOne, deleteOne, updateOne }
