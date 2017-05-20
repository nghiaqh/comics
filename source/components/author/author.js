const PersistedModel = require('../database/persisted-model')
const settings = require('../../config')

/**
 * Author class
 */
class Author extends PersistedModel {
  constructor (name, bio, photo, id = null) {
    super('author') // set the mysql table name
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
          resolve(author.insert(data))
        } else { // with id, update record with whatever valid field
          resolve(author.update(data))
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

  static list (limit = settings.itemsPerPage.author, offset = 0) {
    limit = limit || settings.itemsPerPage.author
    offset = offset || 0
    return super.select('author', null, limit, offset)
  }

  static count () {
    return super.count('author')
  }
}

module.exports = Author
