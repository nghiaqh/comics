import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'

const AuthorAPI = require('express').Router()

AuthorAPI.get('/', getAll)
AuthorAPI.post('/', createOne)

AuthorAPI.get('/:authorId', getOne)
AuthorAPI.delete('/:authorId', deleteOne)
AuthorAPI.put('/:authorId', updateOne)

export { AuthorAPI }
