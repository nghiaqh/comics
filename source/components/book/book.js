const PersistedModel = require('../database/persisted-model')
const settings = require('../../config')
const _ = require('lodash')
import { Author } from '../author'

/**
 * Book class
 */
class Book extends PersistedModel {
  constructor (title, description, coverPicture, seriesId = null, bookId = null, numberOfChapters = null) {
    super()
    this.id = bookId
    this.title = title
    this.description = description
    this.coverPicture = coverPicture
    this.seriesId = seriesId
    this.numberOfChapters = numberOfChapters
    this.authors = null
  }

  save () {
    const book = this
    const test = this.validate()
    const promise = new Promise((resolve, reject) => {
      if (test.isValid) {
        const data = {
          title: book.title,
          description: book.description,
          cover_picture: book.coverPicture,
          series_id: book.seriesId,
          number_of_chapters: book.numberOfChapters
        }
        if (!book.id) { // no id, create new record
          resolve(Book.insert(data, 'book'))
        } else { // with id, update record with whatever valid field
          resolve(Book.update(data, 'book'))
        }
      } else { // invalid book data
        reject(new Error(test.message))
      }
    })

    return promise
  }

  validate () {
    this.id = this.normalise(this.id)
    this.title = this.normalise(this.title)
    this.coverPicture = this.normalise(this.coverPicture)
    this.description = this.normalise(this.description)
    this.seriesId = this.normalise(this.seriesId)
    this.numberOfChapters = this.normalise(this.numberOfChapters)

    if (this.title === '' || this.title === null || typeof this.title === 'undefined') {
      return { isValid: false, message: 'Book\'s title cannot be empty' }
    } else {
      return { isValid: true }
    }
  }

  static delete (where) {
    return super.delete('book', where)
  }

  static deleteById (id) {
    return super.deleteById('book', id)
  }

  static findById (id) {
    return super.findById('book', id)
  }

  static findByName (bookName) {
    return super.select('book', {
      title: bookName
    })
  }

  static list (limit = settings.itemsPerPage.book, offset = 0) {
    limit = limit || settings.itemsPerPage.book
    offset = offset || 0
    return super.select('book', null, limit, offset)
  }

  static count () {
    return super.count('book')
  }

  setAuthor (authorId) {
    const book = this
    const promise = new Promise((resolve, reject) => {
      // Check if author id is valid
      Author.findById(authorId).then(authors => {
        if (_.isArray(authors) && authors.length) {
          const data = {
            book_id: book.id,
            author_id: authorId
          }
          book.authors = authors
          resolve(Book.insert(data, 'book_author'))
        } else {
          reject(new Error('No author with id: ' + authorId))
        }
      }).catch(err => {
        reject(err)
      })
    })

    return promise
  }

  getAuthors () {
    let book = this
    const promise = new Promise((resolve, reject) => {
      PersistedModel.select('book_author', { book_id: this.id }, 100, 0, 'author_id').then(ids => {
        // now we have list of author id linked to this book
        if (_.isArray(ids) && ids.length) {
          let promiseArr = []
          ids.forEach(id => {
            // search for author record & add to book.authors
            promiseArr.push(Author.findById(id.author_id))
          })

          Promise.all(promiseArr).then(authors => {
            book.authors = book.authors === null ? [] : book.authors
            authors.forEach(author => {
              book.authors.push(author[0])
            })
            resolve(book)
          }).catch(err => {
            reject(err)
          })
        } else {
          book.authors = []
          resolve(book)
        }
      }).catch(err => {
        reject(err)
      })
    })

    return promise
  }
}

export { Book }
