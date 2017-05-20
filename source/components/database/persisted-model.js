const config = require('../../../knexfile.js')
const environment = 'development'
const knex = require('knex')(config[environment])
const defaultTimeout = 1000

class PersistedModel {
  constructor (table) {
    var _table = table
    this.setTable = function (table) { _table = table }
    this.getTable = function () { return _table }
  }

  /**
   * Insert row(s) into table
   * @param {String} table table name
   * @param {mixed} data object e.g { title: 'Slaugherhouse Five' } or array of objects for multiple rows insert. Knex will normalise empty keys on multi-row insert.
   * @param {Integer} timeout set a timeout for query
   */
  insert (data, returning = '*') {
    const table = this.getTable()
    return knex(table).returning(returning).insert(data).timeout(defaultTimeout)
  }

  /**
   * Update a row in a table
   * @param {mixed} data object e.g { title: 'Slaugherhouse Five' } or array of objects for multiple rows insert. Knex will normalise empty keys on multi-row insert.
   * @param {Integer} timeout set a timeout for query
   */
  update (data) {
    const table = this.getTable()
    return knex(table).where(table + '_id', '=', this.id).update(data).timeout(defaultTimeout)
  }

  /**
   * Select row(s) from table
   * @param {String} table table name
   * @param {mixed} where condition statement can be in either one of 3 types below:
   *   1. an object: { id: 1 },
   *   2. a function: function () {
   *     this.where('published_date', '<', 2000).orWhere(...).whereNot(...)
   *   }
   * @param {Array} columns list of column names
   * @param {Integer} timeout set a timeout for query
   */
  static select (table, where, limit = 1, offset = 0, columns = '*') {
    if (where === null) {
      return knex(table).select(columns).limit(limit).offset(offset).timeout(defaultTimeout)
    }

    return knex(table).where(where).select(columns).limit(limit).offset(offset).timeout(defaultTimeout)
  }

  /**
   * Delete row(s) from a table
   * @param {mixed} where condition statement can be in either one of 3 types below:
   *   1. an object: { id: 1 },
   *   2. a function: function () {
   *     this.where('published_date', '<', 2000).orWhere(...).whereNot(...)
   *   }
   */
  static delete (table, where) {
    return knex(table).where(where).del().timeout(defaultTimeout)
  }

  /**
   * Delete a record by its primay key id
   * @type {String}
   */
  static deleteById (table, id) {
    return knex(table).where(table + '_id', '=', id).del().timeout(defaultTimeout)
  }

  /**
   * Return a record by its primay key id
   * @type {String}
   */
  static findById (table, id, columns = '*') {
    return knex(table).where(table + '_id', '=', id).select(columns).limit(1).timeout(defaultTimeout)
  }

  static count (table, column = null, where = null) {
    column = column || table + '_id'

    if (!where) {
      return knex(table).count(column).timeout(defaultTimeout)
    }

    return knex(table).where(where).count(column).timeout(defaultTimeout)
  }

  // Utility function to preprocess data
  normalise (data) {
    if (typeof data === 'undefined') {
      data = null
    }

    try {
      data = data.trim()
    } catch (e) {}

    return data
  }
}

module.exports = PersistedModel
