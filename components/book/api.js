/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Book = require('./book');

/* GET all books */
router.get('/', function(req, res, next) {
	var results = [];

	Book.getAll(req.headers.page, function(err, row) {
		if (err !== null) {
			res.send(err);
		}	else {
			results.push(row);
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

/* PUT update an book */
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

/* DELETE delete an book */
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

module.exports = router;
