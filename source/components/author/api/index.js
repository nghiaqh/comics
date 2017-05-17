import { getAll } from './all'
import { getOne, createOne, deleteOne } from './single'

const author = require('express').Router()

author.get('/', getAll)
author.post('/', createOne)
author.delete('/', deleteOne)

author.get('/:authorId', getOne)
author.delete('/:authorId', deleteOne)

export { author }
