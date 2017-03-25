/*jslint node: true */
'use strict';

var _ = require('lodash');
var schemas = require('../db/schemas');
var Database = require('../db/sqlite');
var AppSettings = require('../../config/index');

// Define a Author
var Author = function(data) {
	this.data = sanitize(data, schemas.author);
};

Author.prototype.data = schemas.author;

// save
Author.prototype.save = function(callback) {
	if (validate(this.data, callback)) {
		if (this.data.authorId === null) {
			if (this.data.publishedDate === null || this.data.publishedDate === '') {
				this.data.publishedDate = Date.now();
			}

			Database.insert('Author', this.data, callback);
		} else {
			Database.update('Author', this.data, callback);
		}
	}
};

// delete
Author.prototype.delete = function(callback) {
	if (this.data.id !== null) {
		Database.delete('Author', this.data.authorId, callback);
	}
};

// find a Author by authorId
Author.findById = function(id, callback) {
	Database.findById('Author', id, callback);
};

/**
 * return Authors by pagination
 * @param  {integer}  bookId
 * @param  {integer}  page     start from 0
 * @param  {Function} callback [description]
 * @return
 */
Author.findByBook = function(bookId, page, callback) {
	page = page || 0;
	var data = { page: page, conditions: { bookId: bookId }};

	Database.countByConditions('Author', data, function(err, row) {
		if (err !== null) {
			callback(err);
		}	else {
			var total = row.total;

			Database.findByConditions('Author', data, function(err, result) {
				result.hasMore = total > (page + 1) * AppSettings.itemsPerPage.Author;
				result.total = total;
				callback(err, result);
			});
		}
	});
};

/**
 * Find all authors with certain pen names
 * @param  {string}   name     e.g. pen1, pen2
 * @param  {integer}   page     if there's many results, they are divided into pages
 * @param  {Function} callback handle error and results
 * @return
 */
Author.findByName = function(name, page, callback) {
	page = page || 0;
	var data = {
		page: page,
		conditions: { penName: name + ',%' },
		operator: 'LIKE'
	};

	Database.countByConditions('Author', data, function(err, row) {
		if (err !== null) {
			callback(err);
		}	else {
			var total = row.total;

			Database.findByConditions('Author', data, function(err, result) {
				result.hasMore = total > (page + 1) * AppSettings.itemsPerPage.Author;
				result.total = total;
				callback(err, result);
			});
		}
	});
}

// map input with schema
var	sanitize = function(data, schema) {
	data = data || {};

	_.keys(data).forEach(function(key, index) {
		if (typeof data[key] === 'string') {
			data[key] = data[key].trim();
		}
	});

	return _.pick(_.defaults(data, schema), _.keys(schema));
};

var validate = function(data, callback) {
	// TODO: implement data validation
	return true;
};

module.exports = Author;
