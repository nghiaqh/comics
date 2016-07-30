/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Chapter = require('./chapter');
var _ = require('underscore');

/* GET all chapters */
router.get('/', function(req, res, next) {
	if (!isNaN(parseInt(req.query.book)) && parseInt(req.query.book) > 0) {
		var page = req.query.page || 0;

		Chapter.findByBook(req.query.book, page, function(err, result) {
			if (err !== null) {
				res.status(400).json(err);
			} else {
				res.json(result);
			}
		});
	} else {
		res.status(400).json('Error: missing parameters!');
	}
});

/* POST create an chapter */
router.post('/', function(req, res, next) {
	var chapter = new Chapter(req.body);

	chapter.save(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			chapter.data.chapterId = this.lastID;
			res.json({ message: 'Created a chapter', chapter: chapter.data });
		}
	});
});

/* GET a single chapter */
router.get('/:chapterId', function(req, res, next) {
	Chapter.findById(req.params.chapterId, function(err, item) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json(item);
		}
	});
});

/* PUT update a chapter */
router.put('/:chapterId', function(req, res, next) {
	var chapter = new Chapter(req.body);
	chapter.data.chapterId = req.params.chapterId;

	chapter.save(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json({ message: 'Updated a chapter id ' + req.params.chapterId });
		}
	});
});

/* DELETE delete a chapter */
router.delete('/:chapterId', function(req, res, next) {
	var chapter = new Chapter({ chapterId: req.params.chapterId });
	chapter.delete(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json({ message: 'Deleted a chapter id ' + req.params.chapterId });
		}
	});
});

module.exports = router;
