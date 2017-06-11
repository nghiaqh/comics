import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'

const bookAPI = require('express').Router()

bookAPI.get('/', getAll)
bookAPI.post('/', createOne)

bookAPI.get('/:bookId', getOne)
bookAPI.delete('/:bookId', deleteOne)
bookAPI.put('/:bookId', updateOne)

export { bookAPI }
