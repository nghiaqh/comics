const Author = require('../author')

function getOne (req, res) {
  const authorId = req.params.authorId * 1
  const author = Author.findById(authorId)

  res.status(200).json({ author })
}

function createOne (req, res, next) {
  const author = new Author(req.body.name, req.body.bio, req.body.photo)
  author.save().then(data => {
    author.id = data
    res.json({ status: 200, message: 'Created an author', data: author })
  }).catch(err => {
    res.json({ status: 400, message: 'Failed to create author', error: err })
  })
}

export { getOne, createOne }
