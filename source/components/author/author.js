const PersistedModel = require('../database/persisted-model')

/**
 * Author class
 */
class Author extends PersistedModel {
  constructor (name, bio, photo) {
    super('author')
    this.name = name
    this.bio = bio
    this.photo = photo
  }

  save () {
    if (typeof this.id === 'undefined') {
      return this.insert({
        name: this.name,
        bio: this.bio,
        photo: this.photo
      })
    } else {
      return this.update({
        id: this.id,
        name: this.name,
        bio: this.bio,
        photo: this.photo
      })
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
