const config = require('../../../knexfile.js')
const environment = 'development'
const knex = require('knex')(config[environment])
const defaultTimeout = 1000

class PersistedModel {
  constructor (table) {
    this.table = table
  }

  /**
   * Insert row(s) into table
   * @param {String} table table name
   * @param {mixed} data object e.g { title: 'Slaugherhouse Five' } or array of objects for multiple rows insert. Knex will normalise empty keys on multi-row insert.
   * @param {Integer} timeout set a timeout for query
   */
  insert (data, returning = '*') {
    return knex(this.table).returning(returning).insert(data).timeout(defaultTimeout)
  }

  /**
   * Update a row in a table
   * @param {mixed} data object e.g { title: 'Slaugherhouse Five' } or array of objects for multiple rows insert. Knex will normalise empty keys on multi-row insert.
   * @param {Integer} timeout set a timeout for query
   */
  update (data) {
    return knex(this.table).where(this.table + '_id', '=', this.id).update(data).timeout(defaultTimeout)
  }

  /**
   * Select row(s) from table
   * @param {String} table table name
   * @param {mixed} where condition statement can be in either one of 3 types below:
   *   1. an object: { id: 1 },
   *   2. a function: function () {
   *     this.where('published_date', '<', 2000).orWhere(...).whereNot(...)
   *   },
   *   3. a list of parameter, e.g 'published_date', '<', 2000
   * @param {Array} columns list of column names
   * @param {Integer} timeout set a timeout for query
   */
  select (columns = '*', limit, offset, ...where) {
    return knex(this.table).where(where).select(columns).limit(limit).offset(offset).timeout(defaultTimeout)
  }

  /**
   * Delete row(s) from a table
   * @param {mixed} where condition statement can be in either one of 3 types below:
   *   1. an object: { id: 1 },
   *   2. a function: function () {
   *     this.where('published_date', '<', 2000).orWhere(...).whereNot(...)
   *   },
   *   3. a list of parameter, e.g 'published_date', '<', 2000
   */
  static delete (table, ...where) {
    return knex(table).where(where).del().timeout(defaultTimeout)
  }

  /**
   * Return a record by its primay key id
   * @type {String}
   */
  static findById (table, id, columns = '*') {
    return knex(table).where(table + '_id', '=', id).select(columns).limit(1).timeout(defaultTimeout)
  }
}

module.exports = PersistedModel
