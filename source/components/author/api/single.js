const Author = require('../author')

function getOne (req, res) {
  const authorId = req.params.authorId * 1
  const author = Author.findById(authorId)

  res.status(200).json({ author })
}

export { getOne }
