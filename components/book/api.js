/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Book = require('./book');
var _ = require('underscore');

/* GET all books */
router.get('/', function(req, res, next) {
	var page = req.query.page || 0;
	var conditions = {};

	if (!isNaN(parseInt(req.query.series)) && parseInt(req.query.series) > 0) {
		conditions.seriesId = req.query.series;
	}

	Book.getAll(page, conditions, function(err, result) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json(result);
		}
	});
});

/* POST create an book */
router.post('/', function(req, res, next) {
	var book = new Book(req.body);

	book.save(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			book.data.bookId = this.lastID;
			res.json({ message: 'Created a book', book: book.data });
		}
	});
});

/* GET a single book */
router.get('/:bookId', function(req, res, next) {
	Book.findById(req.params.bookId, function(err, item) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json(item);
		}
	});
});

/* PUT update a book */
router.put('/:bookId', function(req, res, next) {
	var book = new Book(req.body);
	book.data.bookId = req.params.bookId;

	book.save(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json({ message: 'Updated book id ' + req.params.bookId });
		}
	});
});

/* DELETE delete a book */
router.delete('/:bookId', function(req, res, next) {
	var book = new Book({ bookId: req.params.bookId });
	book.delete(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json({ message: 'Deleted book id ' + req.params.bookId });
		}
	});
});

module.exports = router;
