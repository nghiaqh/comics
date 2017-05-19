const Author = require('../author')

function getOne (req, res) {
  let p
  const id = req.params.authorId

  if (Number.isInteger(id * 1)) {
    p = Author.findById(id)
  } else {
    p = Author.findByName(id)
  }

  if (p) {
    p.then(author => {
      res.status(200).json({ author })
    }).catch(err => {
      res.json({ status: 400, message: err.message })
    })
  }
}

function createOne (req, res, next) {
  const author = new Author(req.body.name, req.body.bio, req.body.photo)
  author.save().then(data => {
    author.id = data
    res.json({ status: 200, message: 'Created a new author', data: author })
  }).catch(err => {
    res.json({ status: 400, message: err.message })
  })
}

function deleteOne (req, res, next) {
  const id = req.params.authorId || req.body.id
  let p

  if (id) {
    p = Author.deleteById(id)
  } else if (req.body.name) {
    p = Author.delete({ name: req.body.name })
  }

  if (p) {
    p.then(data => {
      res.json({ status: 200, message: 'Number of record deleted = ' + data })
    }).catch(err => {
      res.json({ status: 400, message: err.message })
    })
  }
}

export { getOne, createOne, deleteOne }
