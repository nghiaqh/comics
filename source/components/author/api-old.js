const router = require('express').Router()
const Author = require('./author')

/* GET all authors */
router.get('/', function (req, res, next) {
  if (!isNaN(parseInt(req.query.book)) && parseInt(req.query.book) > 0) {
    const page = req.query.page || 0

    Author.findByBook(req.query.book, page, function (err, result) {
      if (err !== null) {
        res.status(400).json(err)
      } else {
        res.json(result)
      }
    })
  } else {
    res.status(400).json('Error: missing parameters!')
  }
})

/* POST create an author */
router.post('/', function (req, res, next) {
  const author = new Author(req.body)

  author.save(function (err) {
    if (err !== null) {
      res.status(400).json(err)
    } else {
      author.data.authorId = this.lastID
      res.json({ message: 'Created a author', author: author.data })
    }
  })
})

/* GET a single author */
router.get('/:authorId', function (req, res, next) {
  Author.findById(req.params.authorId, function (err, item) {
    if (err !== null) {
      res.status(400).json(err)
    } else {
      res.json(item)
    }
  })
})

/* PUT update a author */
router.put('/:authorId', function (req, res, next) {
  const author = new Author(req.body)
  author.data.authorId = req.params.authorId

  author.save(function (err) {
    if (err !== null) {
      res.status(400).json(err)
    } else {
      res.json({ message: 'Updated a author id ' + req.params.authorId })
    }
  })
})

/* DELETE delete a author */
router.delete('/:authorId', function (req, res, next) {
  const author = new Author({ authorId: req.params.authorId })
  author.delete(function (err) {
    if (err !== null) {
      res.status(400).json(err)
    } else {
      res.json({ message: 'Deleted a author id ' + req.params.authorId })
    }
  })
})

module.exports = router
