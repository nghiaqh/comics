const PersistedModel = require('../database/persisted-model')

/**
 * Author class
 */
class Author extends PersistedModel {
  constructor (name, bio, photo) {
    super('author')
    this.name = name.trim()
    this.bio = bio.trim()
    this.photo = photo.trim()
  }

  save () {
    const author = this
    const promise = new Promise((resolve, reject) => {
      if (this.validate()) {
        if (typeof author.id === 'undefined') {
          resolve(author.insert({
            name: author.name,
            bio: author.bio,
            photo: author.photo
          }))
        } else {
          resolve(author.update({
            id: author.id,
            name: author.name,
            bio: author.bio,
            photo: author.photo
          }))
        }
      } else {
        reject(new Error(author.invalidReason))
      }
    })

    return promise
  }

  validate () {
    if (this.name === '' || this.name === null || typeof this.name === 'undefined') {
      this.invalidReason = 'Author\'s name cannot be empty'
      return false
    } else {
      return true
    }
  }

  static delete (...where) {
    super.delete('author', where)
  }

  static findById (id) {
    super.findBy('author', id)
  }
}

module.exports = Author
