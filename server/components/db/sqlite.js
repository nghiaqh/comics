/*jslint node: true */
'use strict';

var AppSettings = require('../../config/index');
var schemas = require('./schemas');
var sqlite3 = require('sqlite3').verbose();
var _ = require('underscore');

var Database = {

	/**
	 * insert new row into a table
	 * @param  {string} table [name of the table]
	 * @param  {collection} data [javascript collection contains data for the row instance]
	 * @param  {Function} callback [handle the error/complete]
	 * @return            [no returned output]
	 */
	insert: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var keys = getColumns(data);
		var values = _.values(data);
		var placeholders = [];

		//Remove id column as sqlite handles this primary key
		if (keys[0] === table + '_id') {
			keys.shift();
			values.shift();
		}

		keys.forEach(function() {
			placeholders.push('?');
		});

		var query = 'INSERT INTO ' + table + '(' + keys.join(', ') + ') VALUES(' + placeholders.join(', ') +')';

		printLog(query, values);

		db.serialize(function() {
			db.run(query, values, callback);
		});

		db.close();
	},

	/**
	 * [update description]
	 * @param  {[type]}   table    [description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	update: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var keys = getColumns(data);
		var values = _.values(data);
		var whereStm, setStatement, query;

		// Remove value and key of value that is null
		var index = values.indexOf(null);
		while (index !== -1) {
			values.splice(index, 1);
			keys.splice(index, 1);
			index = values.indexOf(null);
		}

		if (keys[0] === table + '_id' && keys.length > 1) {
			keys.shift();

			var id = values.shift();
			values.push(id);

			setStatement = keys.join(' = ?, ') + ' = ?';
			whereStm = table + '_id = ?';
			query = 'UPDATE ' + table + ' SET ' + setStatement + ' WHERE ' + whereStm;

			printLog(query, values);

			db.serialize(function() {
				db.run(query, values, callback);
			});
		}

		db.close();
	},

	/**
	 * [delete description]
	 * @param  {[type]}   table    [description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	delete: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var keys = getColumns(table);
		var query = 'DELETE FROM ' + table + ' WHERE ' + table + '_id=(?)';

		printLog(query, data);

		db.serialize(function() {
			db.run(query, data, callback);
		});

		db.close();
	},

	/**
	 * [findById description]
	 * @param  {[type]}   table    [description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	findById: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var query = 'SELECT * FROM ' + table + ' WHERE ' + table + '_id = ?';

		printLog(query, data);

		db.serialize(function() {
			db.get(query, data, function(err, row) {
				var item = {};
				if (err === null ) {
					_.keys(row).forEach(function(key, index) {
						item[reverseTransform(key)] = row[key];
					});
				}

				callback(err, item);
			});
		});

		db.close();
	},

	/**
	 * [findAll description]
	 * @param  {[type]}   table    [description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	findAll: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var selectStm = 'SELECT * FROM ' + table + ' LIMIT ? OFFSET ?' ;

		var page = data.page;
		var limit = AppSettings.itemsPerPage[table];
		var offset = data.page * limit;
		var result = {
			page: page,
			hasMore: false,
			total: null,
			items: []
		};

		printLog(selectStm, [limit, offset]);

		db.serialize(function() {
			db.each(selectStm, [limit, offset],
				function(err, row) {
					var item = {};
					_.keys(row).forEach(function(key, index) {
						item[reverseTransform(key)] = row[key];
					});

					result.items.push(item);
				},
				function(err, total) {
					callback(err, result);
				}
			);
		});

		db.close();
	},

	/**
	 * [findByConditions description]
	 * @param  {[type]}   table    [description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	findByConditions: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var columns = getColumns(data.conditions);
		var selectStm = 'SELECT * FROM ' + table;

		if (columns.length > 0) {
			var operator = data.operator || '=';
			var whereStm = columns.join(' ' + operator + ' ?, ') + ' = ?';
			selectStm += ' WHERE ' + whereStm + ' LIMIT ? OFFSET ?';
		} else {
			selectStm += ' LIMIT ? OFFSET ?';
		}

		var page = data.page;
		var limit = AppSettings.itemsPerPage[table] || 10;
		var offset = data.page * limit;
		var values = _.values(data.conditions);
		var result = {
			page: page,
			hasMore: false,
			total: null,
			items: []
		};

		printLog(selectStm, values.concat([limit, offset]));

		db.serialize(function() {
			db.each(selectStm, values.concat([limit, offset]),
				function(err, row) {
					var item = {};
					_.keys(row).forEach(function(key, index) {
						item[reverseTransform(key)] = row[key];
					});

					result.items.push(item);
				},
				function(err, total) {
					callback(err, result);
				}
			);
		});

		db.close();
	},

	/**
	 * [leftJoin description]
	 * @param  {[type]}   tableA   [description]
	 * @param  {[type]}   tableB   [description]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	leftJoin: function(tableA, tableB, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);

		var onStm = 'b.' + tableA + '_id = a.' + tableA + '_id';
		var whereStm = 'b.' + tableB + '_id = ?';
		var selectStm = 'SELECT * FROM ' + tableA + ' a LEFT JOIN ' + tableA + '_' + tableB + ' b ON ' + onStm + ' WHERE ' + whereStm + ' LIMIT ? OFFSET ?';

		var page = data.page;
		var limit = AppSettings.itemsPerPage[tableA];
		var offset = data.page * limit;
		var values = _.values(data.conditions);
		var result = {
			page: page,
			hasMore: false,
			total: null,
			items: []
		};

		printLog(selectStm, values.concat([limit, offset]));

		db.serialize(function() {
			db.each(selectStm, values.concat([limit, offset]),
				function(err, row) {
					var item = {};
					_.keys(row).forEach(function(key, index) {
						item[reverseTransform(key)] = row[key];
					});

					result.items.push(item);
				},
				function(err, total) {
					callback(err, result);
				}
			);
		});

		db.close();
	},

	countAll: function(table, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var countStm = 'SELECT COUNT(*) AS total FROM ' + table;

		printLog(countStm);

		db.serialize(function() {
			db.get(countStm, [], callback);
		});

		db.close();
	},

	countByConditions: function(table, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);
		var columns = getColumns(data.conditions);
		var countStm = 'SELECT COUNT(*) AS total FROM ' + table;

		if (columns.length > 0) {
			var whereStm = getColumns(data.conditions).join(' = ?, ') + ' = ?';
			countStm += ' WHERE ' + whereStm;
		}

		var values = _.values(data.conditions);

		printLog(countStm, values);

		db.serialize(function() {
			db.get(countStm, values, callback);
		});

		db.close();
	},

	countLeftJoin: function(tableA, tableB, data, callback) {
		var db = new sqlite3.Database(AppSettings.database);

		var onStm = 'b.' + tableA + '_id = a.' + tableA + '_id';
		var whereStm = 'b.' + tableB + '_id = ?';
		var countStm = 'SELECT COUNT(*) AS total FROM ' + tableA + ' a LEFT JOIN ' + tableA + '_' + tableB + ' b ON ' + onStm + ' WHERE ' + whereStm;

		var values = _.values(data.conditions);

		printLog(countStm, values);

		db.serialize(function() {
			db.get(countStm, values, callback);
		});

		db.close();
	}
};

/**
 * [transform description]
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
var transform = function transfromJsNameToDatabaseName(input) {
	var output = input;
	var regex = /[a-z][A-Z]/g;
	var match = regex.exec(output);

	if (match !== null) {
		output = input.slice(0, regex.lastIndex-1) + '_' + input.slice(regex.lastIndex-1);
		output = transform(output);
	}

	return output.toLowerCase();
};

/**
 * [reverseTransform description]
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
var reverseTransform = function transfromDatabaseNameToJsName(input) {
	var output = input;
	var regex = /[a-z]_[a-z]/g;
	var match = regex.exec(output);

	if (match !== null) {
		output = input.slice(0, regex.lastIndex-2) + input.slice(regex.lastIndex-1, regex.lastIndex).toUpperCase() + input.slice(regex.lastIndex);
		output = transform(output);
	}

	return output;
};

/**
 * [getColumns description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var getColumns = function getTableColumns(data) {
	var keys = [];
	_.keys(data).forEach(function(item, index) {
		keys[index] = transform(item);
	});

	return keys;
};

/**
 * [printLog description]
 * @param  {[type]} query  [description]
 * @param  {[type]} values [description]
 * @return {[type]}        [description]
 */
var printLog = function printLog(query, values) {
	console.log('Query: ', query);
	console.log('Values: ', values);
};

module.exports = Database;
