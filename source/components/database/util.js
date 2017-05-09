const _ = require('lodash')

/**
 * transfrom js variable name to database column name
 * @param  {string} input e.g numberOfChapters
 * @return {string}       number_of_chapters
 */
export function transfromJsNameToDatabaseName (input) {
  let output = input
  const regex = /[a-z][A-Z]/g
  const match = regex.exec(output)

  if (match !== null) {
    output = input.slice(0, regex.lastIndex - 1) + '_' + input.slice(regex.lastIndex - 1)
    output = transfromJsNameToDatabaseName(output)
  }

  return output.toLowerCase()
}

/**
 * transfrom database column name to js variable name
 * @param  {string} input number_of_chapters
 * @return {string}       numberOfChapters
 */
export function transfromDatabaseNameToJsName (input) {
  let output = input
  const regex = /[a-z]_[a-z]/g
  const match = regex.exec(output)

  if (match !== null) {
    output = input.slice(0, regex.lastIndex - 2) + input.slice(regex.lastIndex - 1, regex.lastIndex).toUpperCase() + input.slice(regex.lastIndex)
    output = transfromJsNameToDatabaseName(output)
  }

  return output
}

/**
 * normalise keys of input
 * @param  {object / Array of objects} data [{ key1: value1, key2: value2, ... },...]
 * @return {object / Array of objects}      [{ key_1: value1, key_2: value2, ... },...]
 */
export function normaliseKeys (data) {
  let input
  if (!_.isArray(data)) {
    input = {}
    _.keys(data).forEach(key => {
      input[transfromJsNameToDatabaseName(key)] = data[key]
    })
  } else {
    input = []
    data.forEach(item => {
      let i = {}
      _.keys(item).forEach(key => {
        i[transfromJsNameToDatabaseName(key)] = item[key]
      })
      input.push(i)
    })
  }

  return input
}

// map input with schema
export function sanitize (data, schema) {
  data = data || {}

  _.keys(data).forEach(function (key, index) {
    if (typeof data[key] === 'string') {
      data[key] = data[key].trim()
    }
  })

  return _.pick(_.defaults(data, schema), _.keys(schema))
}
