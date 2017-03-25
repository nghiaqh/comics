'use strict';

var Author = require('../author/author.js');
var Book = require('../book/book.js');
var Chapter = require('../chapter/chapter.js');
var Picture = require('../picture/picture.js');
var dir = require('node-dir');

/**
 * Scan a folder to create author, book and related picture items.
 * @param {string} path folder path
 *
 * filename: contain full path to the file
 */
var FolderScanner = function(folderPath) {
	var author, book;
	var options = {
		match: /.(jpg|png|gif)$/,
		exclude: /^\./,
	};
	var array = folderPath.split('/');
	var dirname = array.pop();
	while (dirname === '') {
		dirname = array.pop();
	}

	Author.findByName(parseAuthorName(dirname), )
	createAuthor(, function(err) {
		if (err !== null) {
			console.log('ERROR: Cannot create author due to ' + err);

		} else {
			author.data.authorId = this.lastID;
			console.log('AUTHOR created: ' + author.data);
		}
	});

	console.log('BOOK: ' + parseBookTitle(dirname));

	dir.readFiles(sanitize(folderPath), options,
    function(err, content, filename, next) {
        if (err) throw err;
        // console.log('filename: ', filename);
      	var x = filename.split('/');
      	var picture = x.pop();
      	var folder = x.pop();
        next();
    },
    function(err, files){
        if (err) throw err;
        // console.log('finished reading files:', files);
    });
}

function sanitize(data) {
	return data;
}

function parseAuthorName(data) {
	var string = data.split(',')[0];
	var array = string.split('(');
	var authors = [];
	array.forEach(function(author) {
		authors.push(author.trim().split(')')[0]);
	});

	return authors;
}

function parseBookTitle(data) {
	var string = data.split(',')[1];
	return string.trim();
}

function parseChapterTitle(data) {

}

/**
 * Create author record in database
 * @param  {array} data: list of pen names
 * @param  {function} callback: input for author.save()
 * @return {author}
 */
function createAuthor(data, callback) {
	var author = new Author({penName: data.join(', ')});
	console.log(author);
	author.save(callback);
}

var Scanner = {
	folderScan: FolderScanner
}

module.exports = Scanner;
