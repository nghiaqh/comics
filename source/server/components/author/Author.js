import appSettings from 'server/appSettings'
import PersistedModel from 'server/components/database/PersistedModel'

const _ = require('lodash')

/**
 * Author class
 */
class Author extends PersistedModel {
  constructor (name, bio, photo, id = null) {
    super('author')
    this.id = id
    this.name = name
    this.bio = bio
    this.photo = photo
  }

  save () {
    const author = this
    const test = this.validate()
    const promise = new Promise((resolve, reject) => {
      if (test.isValid) {
        const data = {
          name: author.name,
          bio: author.bio,
          photo: author.photo
        }
        if (!author.id) { // no id, create new record
          resolve(this.insert(data))
        } else { // with id, update record with whatever valid field
          resolve(this.update(data))
        }
      } else { // invalid author data
        reject(new Error(test.message))
      }
    })

    return promise
  }

  validate () {
    this.id = this.normalise(this.id)
    this.name = this.normalise(this.name)
    this.bio = this.normalise(this.bio)
    this.photo = this.normalise(this.photo)

    if (this.name === '' || this.name === null || typeof this.name === 'undefined') {
      return { isValid: false, message: 'Author\'s name cannot be empty' }
    } else {
      return { isValid: true }
    }
  }

  static delete (where) {
    return super.delete('author', where)
  }

  static deleteById (id) {
    return super.deleteById('author', id)
  }

  static findById (id) {
    return super.findById('author', id)
  }

  static findByName (authorName) {
    return super.select('author', {
      name: authorName
    })
  }

  static list (limit = appSettings.itemsPerPage.author, offset = 0) {
    limit = limit || appSettings.itemsPerPage.author
    offset = offset || 0
    return super.select('author', null, limit, offset)
  }

  static count () {
    return super.count('author')
  }

  static createAuthor (name, bio = null, photo = null) {
    const promise = new Promise((resolve, reject) => {
      if (name && name.trim() !== '') {
        name = name.trim()
        Author.findByName(name).then(data => {
          if (_.isArray(data) && data.length === 0) {
            // No author with this name in database, create new author record
            const author = new Author(name, '', '')
            author.save().then(data2 => {
              author.id = data2[0]
              resolve(author)
            })
          } else {
            // Found author with this name in database, return author object
            const author = new Author(data[0].name, data[0].bio, data[0].photo, data[0].author_id)
            resolve(author)
          }
        }).catch(err => {
          reject(err)
        })
      } else {
        reject('Author name cannot be empty')
      }
    })

    return promise
  }

}

export { Author }
