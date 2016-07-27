/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Book = require('./book');
var AppSettings = require('../../config/index');
var _ = require('underscore');

/* GET all books */
router.get('/', function(req, res, next) {
	var results = {
		page: req.query.page || 1,
		hasMore: false,
		items: []
	};

	Book.getAll(results.page - 1, function(err, row) {
		if (err !== null) {
			res.send(err);
		}	else {

			// First result is total number of item in table.
			// Next results are the actual book items.
			if (_.keys(row).length === 1 && _.keys(row)[0] === 'total') {
				results.hasMore = row.total > (results.page + 1) * AppSettings.itemsPerPage.book;
			} else {
				var item = {};
				_.keys(row).forEach(function(key, index) {
					item[transform(key)] = row[key];
				});

				results.items.push(item);
			}
		}
	}, function(err, total) {
		res.json(results);
	});
});

/* POST create an book */
router.post('/', function(req, res, next) {
	var book = new Book(req.body);

	book.save(function(err) {
		if (err !== null) {
			res.send(err);
		} else {
			res.json({ message: 'Created a book' });
		}
	});
});

/* GET a single book */
router.get('/:bookId', function(req, res, next) {
	Book.findById(req.params.bookId, function(err, row) {
		if (err !== null) {
			res.send(err);
		} else {
			res.json(row);
		}
	});
});

/* PUT update a book */
router.put('/:bookId', function(req, res, next) {
	var book = new Book(req.body);
	book.data.bookId = req.params.bookId;

	book.save(function(err) {
		if (err !== null) {
			res.send(err);
		} else {
			res.json({ message: 'Updated a book' });
		}
	});
});

/* DELETE delete a book */
router.delete('/:bookId', function(req, res, next) {
	var book = new Book({ bookId: req.params.bookId });
	book.delete(function(err) {
		if (err !== null) {
			res.send(err);
		} else {
			res.json({ message: 'Deleted a book' });
		}
	});
});

var transform = function transfromDatabaseNameToJsName(input) {
	var output = input;
	var regex = /[a-z]_[a-z]/g;
	var match = regex.exec(output);

	if (match !== null) {
		output = input.slice(0, regex.lastIndex-2) + input.slice(regex.lastIndex-1, regex.lastIndex).toUpperCase() + input.slice(regex.lastIndex);
		output = transform(output);
	}

	return output;
};

module.exports = router;
