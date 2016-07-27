/*jslint node: true */
'use strict';

var _ = require('underscore');
var schemas = require('../db/schemas');
var Database = require('../db/sqlite');

// Define a book
var Book = function(data) {
	this.data = sanitize(data, schemas.book);
};

Book.prototype.data = schemas.book;

// save
Book.prototype.save = function(callback) {
	if (this.data.bookId === null) {
		Database.insert('book', this.data, callback);
	} else {
		Database.update('book', this.data, callback);
	}
};

// delete
Book.prototype.delete = function(callback) {
	if (this.data.id !== null) {
		Database.delete('book', this.data.bookId, callback);
	}
};

// find a book by bookId
Book.findById = function(id, callback) {
	Database.findById('book', id, callback);
};

/**
 * return books by pagination
 * @param  {integer}  page     start from 0
 * @param  {Function} callback [description]
 * @param  {Function} complete [description]
 * @return
 */
Book.getAll = function(page, callback, complete) {
	page = page || 0;

	Database.selectAll('book', { page: page }, callback, complete);
};

// map input with schema
var	sanitize = function(data, schema) {
	data = data || {};
	return _.pick(_.defaults(data, schema), _.keys(schema));
};

module.exports = Book;
