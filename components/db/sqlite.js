/*jslint node: true */
'use strict';

var dbFile = 'app.db';
var schemas = require('./schemas');
var sqlite3 = require('sqlite3').verbose();
var _ = require('underscore');

var Database = {

	insert: function(table, data, callback) {
		var db = new sqlite3.Database(dbFile);
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

	update: function(table, data, callback) {
		var db = new sqlite3.Database(dbFile);
		var keys = getColumns(data);
		var values = _.values(data);
		var whereStatement, setStatement, query;

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
			whereStatement = table + '_id = ?';
			query = 'UPDATE ' + table + ' SET ' + setStatement + ' WHERE ' + whereStatement;

			printLog(query, values);

			db.serialize(function() {
				db.run(query, values, callback);
			});
		}

		db.close();
	},

	delete: function(table, data, callback) {
		var db = new sqlite3.Database(dbFile);
		var keys = getColumns(table);
		var query = 'DELETE FROM book WHERE ' + table + '_id=(?)';

		printLog(query, data);

		db.serialize(function() {
			db.run(query, data, callback);
		});

		db.close();
	},

	findById: function(table, data, callback) {
		var db = new sqlite3.Database(dbFile);
		var query = 'SELECT * FROM ' + table + ' WHERE ' + table + '_id = ?';

		printLog(query, data);

		db.serialize(function() {
			db.get(query, data, callback);
		});

		db.close();
	},

	all: function(table, data, callback, complete) {
		var db = new sqlite3.Database(dbFile);
		var query = 'SELECT * FROM ' + table;

		printLog(query, data);

		// TODO: update to be pagination ready
		db.serialize(function() {
			db.each(query, [], callback, complete);
		});

		db.close();
	}
};


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

var getColumns = function getTableColumns(data) {
	var keys = [];
	_.keys(data).forEach(function(item, index) {
		keys[index] = transform(item);
	});

	return keys;
};

var printLog = function printLog(query, values) {
	console.log('Query: ', query);
	console.log('Values: ', values);
};

module.exports = Database;
