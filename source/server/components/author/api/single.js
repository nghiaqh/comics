import { Author } from '../author'
const _ = require('lodash')

function createOne (req, res, next) {
  const author = new Author(req.body.name, req.body.bio, req.body.photo)
  author.save().then(data => {
    author.id = data[0]
    res.status(200).json({ message: 'Created a new author', data: author })
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function getOne (req, res) {
  let p
  let s = 'id'
  const id = req.params.authorId

  if (Number.isInteger(id * 1)) {
    p = Author.findById(id)
  } else {
    p = Author.findByName(id)
    s = 'name'
  }

  p.then(data => {
    if (_.isArray(data) && data.length === 0) {
      res.status(404).json({ message: 'No author with ' + s + ' ' + id })
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
  const id = req.params.authorId

  if (Number.isInteger(id * 1)) {
    p = Author.deleteById(id)
  } else {
    p = Author.delete({ name: id })
    s = 'name'
  }

  p.then(data => {
    if (data) {
      res.status(200).json({ message: 'Deleted author with ' + s + ' ' + id })
    } else {
      res.status(404).json({ message: 'No author with ' + s + ' ' + id })
    }
  }).catch(err => {
    res.status(400).json({ message: err.message })
  })
}

function updateOne (req, res, next) {
  let p
  let s = 'id'
  const id = req.params.authorId

  if (Number.isInteger(id * 1)) {
    p = Author.findById(id)
  } else {
    p = Author.findByName(id)
    s = 'name'
  }

  p.then(data => {
    if (!data) {
      res.status(404).json({ message: 'No author with ' + s + ' ' + id })
    } else {
      const author = new Author(data[0].name, data[0].bio, data[0].photo, data[0].author_id)
      if (typeof req.body.name !== 'undefined') {
        author.name = req.body.name
      }

      if (typeof req.body.bio !== 'undefined') {
        author.bio = req.body.bio
      }

      if (typeof req.body.name !== 'undefined') {
        author.photo = req.body.photo
      }

      author.save().then(data => {
        if (data) {
          res.status(200).json({
            message: 'Updated author id ' + id,
            data: author
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
