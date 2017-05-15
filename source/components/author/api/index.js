import { getAll } from './all'
import { getOne, createOne } from './single'

const author = require('express').Router()
author.get('/', getAll)
author.get('/:authorId', getOne)
author.post('/', createOne)

export { author }
