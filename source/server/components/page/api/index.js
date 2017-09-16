import { getAll } from './all'
import { createOne, getOne, deleteOne, updateOne } from './single'

const PageAPI = {
  createOne: createOne,
  getOne: getOne,
  deleteOne: deleteOne,
  updateOne: updateOne,
  getAll: getAll
}

export { PageAPI }
