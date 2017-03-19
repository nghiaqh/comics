/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var Picture = require('./picture');
var _ = require('underscore');

/* GET multiple pictures */
router.get('/', function(req, res, next) {
	if (!isNaN(parseInt(req.query.chapter)) && parseInt(req.query.chapter) > 0) {
		var page = req.query.page || 0;

		Picture.findByChapter(req.query.chapter, page, function(err, result) {
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

/* POST create an picture */
router.post('/', function(req, res, next) {
	var picture = new Picture(req.body);

	picture.save(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			picture.data.pictureId = this.lastID;
			res.json({ message: 'Created a picture', picture: picture.data });
		}
	});
});

/* GET a single picture */
router.get('/:pictureId', function(req, res, next) {
	Picture.findById(req.params.pictureId, function(err, item) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json(item);
		}
	});
});

/* PUT update a picture */
router.put('/:pictureId', function(req, res, next) {
	var picture = new Picture(req.body);
	picture.data.pictureId = req.params.pictureId;

	picture.save(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json({ message: 'Updated picture id ' + req.params.pictureId });
		}
	});
});

/* DELETE delete a picture */
router.delete('/:pictureId', function(req, res, next) {
	var picture = new Picture({ pictureId: req.params.pictureId });
	picture.delete(function(err) {
		if (err !== null) {
			res.status(400).json(err);
		} else {
			res.json({ message: 'Deleted picture id ' + req.params.pictureId });
		}
	});
});

module.exports = router;
