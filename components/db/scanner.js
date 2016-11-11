'use strict';

// var Author = require('../author/author.js');
var Book = require('../book/book.js');
var Chapter = require('../chapter/chapter.js');
var Picture = require('../picture/picture.js');
var dir = require('node-dir');

/**
 * [Scanner description]
 * @param {[type]} path [description]
 *
 * filename: contain full path to the file
 */
var Scanner = function(path) {
	var author, book;

	dir.readFiles(sanitize(path),
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

}

function parseBookTitle(data) {

}

function parseChapterTitle(data) {

}

module.exports = Scanner;
