import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'

const authorAPI = require('express').Router()

authorAPI.get('/', getAll)
authorAPI.post('/', createOne)

authorAPI.get('/:authorId', getOne)
authorAPI.delete('/:authorId', deleteOne)
authorAPI.put('/:authorId', updateOne)

export { authorAPI }
