import { getAll } from './all'
import { getOne } from './single'

const author = require('express').Router()
author.get('/', getAll)
author.get('/:authorId', getOne)

export { author }
