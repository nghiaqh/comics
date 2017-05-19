const PersistedModel = require('../database/persisted-model')

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
      if (test.isValid && !author.id) {
        resolve(author.insert({
          name: author.name,
          bio: author.bio,
          photo: author.photo
        }))
      } else if (author.id) {
        let data = this.prepareUpdateData()
        resolve(author.update(data))
      } else if (test.isValid && !author.id) {
        reject(new Error(test.message))
      } else if (!author.id) {
        reject(new Error('Author\'s id is invalid'))
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

  prepareUpdateData () {
    let data = {}

    if (this.name !== null && this.name !== '') {
      data.name = this.name
    }

    if (this.bio !== null) {
      data.bio = this.bio
    }

    if (this.photo !== null) {
      data.photo = this.photo
    }

    return data
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
}

module.exports = Author
