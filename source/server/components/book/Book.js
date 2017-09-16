import appSettings from '../../appSettings'
import PersistedModel from '../database/PersistedModel'
import { Author } from '../author'
const _ = require('lodash')

/**
 * Book class
 */
class Book extends PersistedModel {
  constructor (title, description, coverPicture, seriesId = null, bookId = null, numberOfChapters = null) {
    super('book')
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
          resolve(this.insert(data))
        } else { // with id, update record with whatever valid field
          resolve(this.update(data))
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

  static list (limit = appSettings.itemsPerPage.book, offset = 0) {
    limit = Number.isInteger(limit) ? limit : appSettings.itemsPerPage.book
    offset = Number.isInteger(offset) ? offset : 0
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
          PersistedModel.insertToTable(data, 'book_author').then(result => {
            resolve(result)
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('No author with id: ' + authorId))
        }
      })
      .catch(err => {
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

  static createBook (title, author = null) {
    const promise = new Promise((resolve, reject) => {
      if (title && title.trim() !== '') {
        title = title.trim()
        Book.findByName(title).then(data => {
          if (_.isArray(data) && data.length === 0) {
            // No book with this name in database, create new book record
            const book = new Book(title, '', '')
            book.save().then(data2 => {
              book.id = data2[0]

              if (author) {
                book.setAuthor(author.id).then(result => {
                  book.authors = [author]
                  resolve(book)
                }).catch(err => {
                  reject(err)
                })
              } else {
                resolve(book)
              }
            }).catch(err => {
              reject(err)
            })
          } else {
            // Found book with this name in database, return book object
            const book = new Book(data[0].title, data[0].description, data[0].coverPicture, data[0].series_id, data[0].book_id, data[0].number_of_chapters)

            if (author) {
              book.setAuthor(author.id).then(result => {
                book.authors = [author]
                resolve(book)
              }).catch(err => {
                resolve(book) // we don't want to break the promise chain. Err happens if a book_author row is already created for this book and author
              })
            } else {
              resolve(book)
            }
          }
        }).catch(err => {
          reject(err)
        })
      } else {
        reject('Book title cannot be empty')
      }
    })

    return promise
  }
}

export { Book }
