import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'

const author = require('express').Router()

author.get('/', getAll)
author.post('/', createOne)

author.get('/:authorId', getOne)
author.delete('/:authorId', deleteOne)
author.put('/:authorId', updateOne)

export { author }
