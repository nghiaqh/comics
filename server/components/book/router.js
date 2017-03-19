/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Book = require('./book');
var _ = require('underscore');
var schemas = require('../db/schemas');

/* GET all books */
router.get('/', function(req, res, next) {
	var page = req.query.page || 0;
	var conditions = {};

	if (!isNaN(parseInt(req.query.series)) && parseInt(req.query.series) > 0) {
		conditions.seriesId = req.query.series;
	}

	Book.getAll(page, conditions, function(err, result) {
		if (err !== null) {
			res.status(400);
			next();
		} else {
			console.log(result);
			res.render(__dirname + '/templates/books.jade', result);
		}
	});
});

router.get('/add', function(req, res, next) {
	var item = schemas.book;
	var data = {
		seoTitle: 'Add a new book',
		seoDescription: 'Add a new book',
		item: item
	}

	res.render(__dirname + '/templates/edit-form.jade', data);
});

router.get('/:bookId', function(req, res, next) {
	Book.findById(req.params.bookId, function(err, item) {
		if (err !== null) {
			res.status(400);
			next();
		} else {
			var data = {
				seoTitle: item.title,
				seoDescription: item.description.substr(0, 164),
				item: item
			}

			res.render(__dirname + '/templates/book.jade', data);
		}
	});
});

router.get('/:bookId/edit', function(req, res, next) {
	Book.findById(req.params.bookId, function(err, item) {
		if (err !== null) {
			res.status(400);
			next();
		} else {
			var data = {
				seoTitle: item.title,
				seoDescription: item.description.substr(0, 164),
				item: item
			}

			res.render(__dirname + '/templates/edit-form.jade', data);
		}
	});
});

module.exports = router;
