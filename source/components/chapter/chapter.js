// var _ = require('lodash');
// var schemas = require('../database/schemas');
// var Database = require('../database/sqlite');
// var AppSettings = require('../../config/index');
//
// // Define a chapter
// var Chapter = function(data) {
// 	this.data = sanitize(data, schemas.chapter);
// };
//
// Chapter.prototype.data = schemas.chapter;
//
// // save
// Chapter.prototype.save = function(callback) {
// 	if (validate(this.data, callback)) {
// 		if (this.data.chapterId === null) {
// 			if (this.data.publishedDate === null || this.data.publishedDate === '') {
// 				this.data.publishedDate = Date.now();
// 			}
//
// 			Database.insert('chapter', this.data, callback);
// 		} else {
// 			Database.update('chapter', this.data, callback);
// 		}
// 	}
// };
//
// // delete
// Chapter.prototype.delete = function(callback) {
// 	if (this.data.id !== null) {
// 		Database.delete('chapter', this.data.chapterId, callback);
// 	}
// };
//
// // find a chapter by chapterId
// Chapter.findById = function(id, callback) {
// 	Database.findById('chapter', id, callback);
// };
//
// /**
//  * return chapters by pagination
//  * @param  {integer}  bookId
//  * @param  {integer}  page     start from 0
//  * @param  {Function} callback [description]
//  * @return
//  */
// Chapter.findByBook = function(bookId, page, callback) {
// 	page = page || 0;
// 	var data = { page: page, conditions: { bookId: bookId }};
//
// 	Database.countByConditions('chapter', data, function(err, row) {
// 		if (err !== null) {
// 			callback(err);
// 		}	else {
// 			var total = row.total;
//
// 			Database.findByConditions('chapter', data, function(err, result) {
// 				result.hasMore = total > (page + 1) * AppSettings.itemsPerPage.chapter;
// 				result.total = total;
// 				callback(err, result);
// 			});
// 		}
// 	});
// };
//
// // map input with schema
// var	sanitize = function(data, schema) {
// 	data = data || {};
//
// 	_.keys(data).forEach(function(key, index) {
// 		if (typeof data[key] === 'string') {
// 			data[key] = data[key].trim();
// 		}
// 	});
//
// 	return _.pick(_.defaults(data, schema), _.keys(schema));
// };
//
// var validate = function(data, callback) {
// 	// TODO: implement data validation
// 	return true;
// };
//
// module.exports = Chapter;
