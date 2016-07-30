/*jslint node: true */
'use strict';

var _ = require('underscore');
var schemas = require('../db/schemas');
var Database = require('../db/sqlite');
var AppSettings = require('../../config/index');

// Define a book
var Book = function(data) {
	this.data = sanitize(data, schemas.book);
};

Book.prototype.data = schemas.book;

// save
Book.prototype.save = function(callback) {
	if (validate(this.data, callback)) {
		if (this.data.bookId === null) {
			Database.insert('book', this.data, callback);
		} else {
			Database.update('book', this.data, callback);
		}
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
 * @return
 */
Book.getAll = function(page, conditions, callback) {
	var data = {
		page: page || 0,
		conditions: conditions || {}
	};

	Database.countByConditions('book', data, function(err, row) {
		if (err !== null) {
			callback(err);
		}	else {
			var total = row.total;

			Database.findByConditions('book', data, function(err, result) {
				result.hasMore = total > (page + 1) * AppSettings.itemsPerPage.book;
				result.total = total;
				callback(err, result);
			});
		}
	});
};

// map input with schema
var	sanitize = function(data, schema) {
	data = data || {};

	_.keys(data).forEach(function(key, index) {
		if (typeof data[key] === 'string') {
			data[key] = data[key].trim();
		}
	});

	data.updatedDate = Date.now();

	if (data.publishedDate !== null && data.publishedDate !== '') {
		data.publishedDate = Date.parse(data.publishedDate);
	}

	return _.pick(_.defaults(data, schema), _.keys(schema));
};

var validate = function(data, callback) {
	// TODO: implement data validation

	return true;
};

module.exports = Book;
