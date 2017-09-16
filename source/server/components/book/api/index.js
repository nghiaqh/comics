import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'
import { PageAPI } from '../../page/api'


const BookAPI = require('express').Router()

BookAPI.get('/', getAll)
BookAPI.post('/', createOne)

BookAPI.get('/:bookId', getOne)
BookAPI.delete('/:bookId', deleteOne)
BookAPI.put('/:bookId', updateOne)

BookAPI.post('/:bookId/page', PageAPI.createOne)
BookAPI.get('/:bookId/pages', PageAPI.getAll)
BookAPI.get('/:bookId/pages/:pageId', PageAPI.getOne)
BookAPI.delete('/:bookId/pages/:pageId', PageAPI.deleteOne)
BookAPI.put('/:bookId/pages/:pageId', PageAPI.updateOne)

export { BookAPI }
