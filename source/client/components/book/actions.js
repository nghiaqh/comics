const ADD_BOOK = 'ADD_BOOK'
const VIEW_BOOK = 'VIEW_BOOK'
const UPDATE_BOOK = 'UPDATE_BOOK'
const DELETE_BOOK = 'DELETE_BOOK'
const GET_BOOK = 'GET_BOOK'
const GET_BOOKS = 'GET_BOOKS'


function getBook (bookId) {
  return {
    type: GET_BOOK,
    _description: 'Request a book by ID',
    bookId
  }
}

function getBooks (offset, limit, authorId = null) {
  return {
    type: GET_BOOKS,
    _description: 'Request a list book by offset and limit',
    offset,
    limit
  }
}


const actions = {
  getBook,
  getBooks
}

export default actions
