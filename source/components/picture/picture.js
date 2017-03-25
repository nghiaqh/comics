/*jslint node: true */
'use strict';

var _ = require('lodash');
var schemas = require('../db/schemas');
var Database = require('../db/sqlite');
var AppSettings = require('../../config/index');

// Define a picture
var Picture = function(data) {
	this.data = sanitize(data, schemas.picture);
};

Picture.prototype.data = schemas.picture;

// save
Picture.prototype.save = function(callback) {
	if (validate(this.data, callback)) {
		if (this.data.pictureId === null) {
			this.data.publishedDate = Date.now();
			Database.insert('picture', this.data, callback);
		} else {
			Database.update('picture', this.data, callback);
		}
	}
};

// delete
Picture.prototype.delete = function(callback) {
	if (this.data.id !== null) {
		Database.delete('picture', this.data.pictureId, callback);
	}
};

// find a picture by pictureId
Picture.findById = function(id, callback) {
	Database.findById('picture', id, callback);
};

/**
 * return pictures by pagination
 * @param  {integer}  chapterId
 * @param  {integer}  page     [start from 0]
 * @param  {Function} callback [description]
 * @return
 */
Picture.findByChapter = function(chapterId, page, callback) {
	page = page || 0;
	var data = {
		page: page,
		conditions: { chapterId: chapterId }
	};

	Database.countByConditions('picture', data, function(err, row) {
		if (err !== null) {
			callback(err);
		}	else {
			var total = row.total;

			Database.findByConditions('picture', data, function(err, result) {
				result.hasMore = total > (page + 1) * AppSettings.itemsPerPage.picture;
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

	return _.pick(_.defaults(data, schema), _.keys(schema));
};

var validate = function(data, callback) {
	// TODO: implement data validation
	return true;
};

module.exports = Picture;
