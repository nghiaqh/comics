export const schema = {
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
    coverPicture: null,
    updatedDate: null
  },
  book: {
    bookId: null,
    title: null,
    description: null,
    numberOfChapters: null,
    publishedDate: null,
    coverPicture: null,
    seriesId: null,
    updatedDate: null
  },
  chapter: {
    chapterId: null,
    title: null,
    number: null,
    bookId: null,
    description: null,
    coverPicture: null,
    publishedDate: null
  },
  author: {
    authorId: null,
    name: null,
    bio: null,
    photo: null
  },
  genre: {
    genreId: null,
    title: null,
    coverPicture: null
  },
  picture: {
    pictureId: null,
    uri: null,
    title: null,
    description: null,
    pageNumber: null,
    chapterId: null,
    publishedDate: null
  },
  series: {
    seriesId: null,
    title: null,
    description: null,
    coverPicture: null,
    publishedDate: null,
    updatedDate: null
  },
  bookAuthor: {
    bookId: null,
    authorId: null
  },
  bookGenre: {
    bookdId: null,
    genreId: null
  },
  bookCollection: {
    bookId: null,
    collectionId: null
  },
  chapterCollection: {
    chapterId: null,
    collectionId: null
  },
  pictureCollection: {
    pictureId: null,
    collectionId: null
  }
}
