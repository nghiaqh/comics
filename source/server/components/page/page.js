const PersistedModel = require('../database/persisted-model')
const settings = require('../../config')
const _ = require('lodash')
import { Book } from '../book'

/**
 * Page class - a book page
 */
class Page extends PersistedModel {
  constructor (number, src, bookId, chapterId, id = null) {
    super('page')
    this.id = id
    this.number = number
    this.src = src
    this.bookId = bookId
    this.chapterId = chapterId
  }

  asyncValidate () {
    this.id = this.normalise(this.id)
    this.number = this.normalise(this.number)
    this.src = this.normalise(this.src)
    this.bookId = this.normalise(this.bookId)
    this.chapterId = this.normalise(this.chapterId)

    const promise = new Promise((resolve, reject) => {
      if (this.bookId === '' || this.bookId === null) {
        reject(new Error('Book ID cannot be empty or null'))
      } else {
        Book.findById(this.bookId).then(book => {
          if (_.isArray(book) && book.length) {
            if (this.number === '' || this.number === null) {
              reject(new Error('Page number cannot be empty or null'))
            } else {
              resolve(true)
            }
          } else {
            reject(new Error('Book ID is not found in database'))
          }
        }).catch(err => {
          reject(err)
        })
      }
    })

    return promise
  }

  save () {
    const page = this
    const promise = new Promise((resolve, reject) => {
      this.asyncValidate()
        .then(isValid => {
          if (isValid === true) {
            const data = {
              number: page.number,
              src: page.src,
              book_id: page.bookId,
              chapter_id: page.chapterId
            }
            if (!page.id) {
              resolve(this.insert(data))
            } else {
              resolve(this.update(data))
            }
          } else {
            reject(new Error(isValid))
          }
        })
        .catch(err => {
          reject(err)
        })
    })

    return promise
  }

  static delete (where) {
    return super.delete('page', where)
  }

  static deleteById (id) {
    return super.deleteById('page', id)
  }

  static findById (id) {
    return super.findById('page', id)
  }

  static findByBookId (bookId, limit = settings.itemsPerPage.page, offset = 0) {
    limit = Number.isInteger(limit) ? limit : settings.itemsPerPage.page
    offset = Number.isInteger(offset) ? offset : 0
    return super.select('page', { book_id: bookId }, limit, offset)
  }

  static countPageByBookId (bookId) {
    return super.count('page', null, { 'book_id': bookId })
  }

  static findByChapterId
  (chapterId, limit = settings.itemsPerPage.page, offset = 0) {
    limit = Number.isInteger(limit) ? limit : settings.itemsPerPage.page
    offset = Number.isInteger(offset) ? offset : 0
    return super.select('page', { chapter_id: chapterId }, limit, offset)
  }

  static countPageByChapterId (chapterId) {
    return super.count('page', null, { 'chapter_id': chapterId })
  }
}

export { Page }
