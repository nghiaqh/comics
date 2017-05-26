
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.alterTable('book_author', (table) => {
      table.unique(['book_id', 'author_id'])
    }),

    knex.schema.alterTable('book_genre', (table) => {
      table.unique(['book_id', 'genre_id'])
    }),

    knex.schema.alterTable('book_collection', (table) => {
      table.unique(['book_id', 'collection_id'])
    }),

    knex.schema.alterTable('series_author', (table) => {
      table.unique(['series_id', 'author_id'])
    })
  ])
};

exports.down = function(knex, Promise) {

};
