/*jshint multistr: true */
var config = require('../../config/index');
var dbFile = config.database;

var setup = {

	run: function() {
		this.initDatabase();
	},

	initDatabase: function() {
		var sqlite3 = require('sqlite3').verbose();
		var db = new sqlite3.Database(dbFile);

		console.log('Setup: creating database tables if not exists ... ');

		db.serialize(function() {
			db.run('CREATE TABLE IF NOT EXISTS user ( \
				user_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				username TEXT NOT NULL UNIQUE, \
				avatar TEXT, \
				bio TEXT)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (1): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS collection ( \
				collection_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				user_id INTEGER REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE SET NULL, \
				title TEXT NOT NULL, \
				cover_picture TEXT, \
				updated_date TIMESTAMP NOT NULL)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (2): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS series ( \
				series_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				title TEXT NOT NULL, \
				description TEXT, \
				cover_picture TEXT, \
				published_date TIMESTAMP, \
				updated_date TIMESTAMP NOT NULL)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (3): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS book ( \
				book_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				title TEXT NOT NULL, \
				description TEXT, \
				number_of_chapters INTEGER DEFAULT 1 CHECK(number_of_chapters > 0), \
				published_date TIMESTAMP, \
				cover_picture TEXT, \
				series_id INTEGER REFERENCES series(series_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				updated_date TIMESTAMP NOT NULL)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (4): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS chapter ( \
				chapter_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				number TEXT NOT NULL CHECK(number > 0), \
				title TEXT, \
				book_id INTEGER REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				description TEXT, \
				cover_picture TEXT, \
				published_date TIMESTAMP NOT NULL)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (5): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS author ( \
				author_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				pen_name TEXT NOT NULL UNIQUE, \
				bio TEXT, \
				cover_picture TEXT)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (6): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS genre ( \
				genre_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				title TEXT NOT NULL UNIQUE, \
				cover_picture TEXT)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (7): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS picture ( \
				picture_id INTEGER PRIMARY KEY AUTOINCREMENT, \
				uri TEXT NOT NULL, \
				title TEXT, \
				description TEXT, \
				page_number INTEGER NOT NULL, \
				chapter_id INTEGER REFERENCES chapter(chapter_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				published_date TIMESTAMP NOT NULL)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (8): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS book_author ( \
				book_id INTEGER REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				author_id INTEGER REFERENCES author(author_id) ON UPDATE CASCADE ON DELETE CASCADE)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (9): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS book_genre ( \
				book_id INTEGER REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				genre_id INTEGER REFERENCES genre(genre_id) ON UPDATE CASCADE ON DELETE CASCADE)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (10): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS book_collection ( \
				book_id INTEGER REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				collection_id INTEGER REFERENCES collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (11): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS chapter_collection ( \
				chapter_id INTEGER REFERENCES chapter(chapter_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				collection_id INTEGER REFERENCES collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (12): ', err);
					}
				}
			);

			db.run('CREATE TABLE IF NOT EXISTS picture_collection ( \
				picture_id INTEGER REFERENCES picture(picture_id) ON UPDATE CASCADE ON DELETE CASCADE, \
				collection_id INTEGER REFERENCES collection(collection_id) ON UPDATE CASCADE ON DELETE CASCADE)',
				function(err, row) {
					if (err !== null) {
						console.log('Setup error (13): ', err);
					}
				}
			);
		});

		db.close();
	},
};

module.exports = setup;
