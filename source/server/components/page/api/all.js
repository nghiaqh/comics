import { Page } from '../Page'
const _ = require('lodash')

function getAll (req, res) {
  const offset = req.query.offset * 1
  const limit = req.query.limit * 1
  const bookId = req.params.bookId
  Promise.all([
    Page.countPageByBookId(bookId),
    Page.findByBookId(bookId, limit, offset)
  ]).then(data => {
    res.status(200).json({
      total: _.values(data[0][0])[0], // output integer value only
      pages: data[1] // list of book records
    })
  }).catch(err => {
    res.status(500).json({ message: err.message })
  })
}

export { getAll }
