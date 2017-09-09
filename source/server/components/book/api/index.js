import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'
import { getAll as getAllPages } from '../../page/api/all'
import { createOne as createOnePage, getOne as getOnePage, deleteOne as deleteOnePage, updateOne as updateOnePage} from '../../page/api/single'


const bookAPI = require('express').Router()

bookAPI.get('/', getAll)
bookAPI.post('/', createOne)

bookAPI.get('/:bookId', getOne)
bookAPI.delete('/:bookId', deleteOne)
bookAPI.put('/:bookId', updateOne)

bookAPI.post('/:bookId/page', createOnePage)
bookAPI.get('/:bookId/pages', getAllPages)
bookAPI.get('/:bookId/pages/:pageId', getOnePage)
bookAPI.delete('/:bookId/pages/:pageId', deleteOnePage)
bookAPI.put('/:bookId/pages/:pageId', updateOnePage)

export { bookAPI }
