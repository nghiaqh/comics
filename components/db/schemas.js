var schemas = {
	user: {
		userId: null,
		username: null,
		avatar: null,
		bio: null
	},
	collection: {
		collectionId: null,
		userId: null,
		title: null,
		coverPicture: null
	},
	book: {
		bookId: null,
		title: null,
		description: null,
		numberOfChapters: null,
		publishedDate: null,
		coverPicture: null
	},
	chapter: {
		chapterId: null,
		title: null,
		number: null,
		bookId: null,
		description: null,
		coverPicture: null
	},
	author: {
		authorId: null,
		penName: null,
		bio: null,
		coverPicture: null
	},
	genre: {
		genreId: null,
		title: null,
		coverPicture: null
	},
	picture: {
		pictureId: null,
		uri: null
	}
};

module.exports = schemas;
