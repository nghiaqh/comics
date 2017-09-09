
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.increments('user_id')
      table.string('username').notNullable()
      table.string('email')
      table.unique('email')
      table.text('avatar')
      table.text('bio')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "user" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('collection', (table) => {
      table.increments('collection_id')
      table.string('title').notNullable()
      table.text('cover_picture')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('user.user_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "collection" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('series', (table) => {
      table.increments('series_id')
      table.string('title').notNullable().index()
      table.text('cover_picture')
      table.text('description')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "series" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('book', (table) => {
      table.increments('book_id')
      table.string('title').notNullable()
      table.text('cover_picture')
      table.text('description')
      table.integer('number_of_chapters')
      table.integer('series_id').unsigned()
      table.foreign('series_id').references('series.series_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "book" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('chapter', (table) => {
      table.increments('chapter_id')
      table.integer('number').notNullable().unsigned()
      table.string('title')
      table.text('cover_picture')
      table.text('description')
      table.integer('book_id').unsigned().notNullable()
      table.foreign('book_id').references('book.book_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "chapter" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('page', (table) => {
      table.increments('page_id')
      table.integer('number')
      table.text('src').notNullable()
      table.integer('book_id').unsigned().notNullable()
      table.foreign('book_id').references('book.book_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('chapter_id').unsigned().notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "page" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('author', (table) => {
      table.increments('author_id')
      table.string('name').notNullable()
      table.unique('name')
      table.text('bio')
      table.text('photo')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "author" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('genre', (table) => {
      table.increments('genre_id')
      table.string('name').notNullable()
      table.unique('name')
      table.text('description')
      table.text('cover_picture')
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.collate('utf8_general_ci')
      table.charset('utf8')
    })
      .then(res => console.log('Created "genre" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('book_author', (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().notNullable()
      table.foreign('book_id').references('book.book_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('author_id').unsigned().notNullable()
      table.foreign('author_id').references('author.author_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.unique(['book_id', 'author_id'])
    })
      .then(res => console.log('Created "book_author" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('book_genre', (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().notNullable()
      table.foreign('book_id').references('book.book_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('genre_id').unsigned().notNullable()
      table.foreign('genre_id').references('genre.genre_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.unique(['book_id', 'genre_id'])
    })
      .then(res => console.log('Created "book_genre" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('book_collection', (table) => {
      table.increments('id')
      table.integer('book_id').unsigned().notNullable()
      table.foreign('book_id').references('book.book_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('collection_id').unsigned().notNullable()
      table.foreign('collection_id').references('collection.collection_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.unique(['book_id', 'collection_id'])
    })
      .then(res => console.log('Created "book_collection" table'))
      .catch(err => console.log(err)),

    knex.schema.createTable('series_author', (table) => {
      table.increments('id')
      table.integer('series_id').unsigned().notNullable()
      table.foreign('series_id').references('series.series_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('author_id').unsigned().notNullable()
      table.foreign('author_id').references('author.author_id')
        .onUpdate('CASCADE').onDelete('CASCADE')
      table.unique(['series_id', 'author_id'])
    })
      .then(res => console.log('Created "series_author" table'))
      .catch(err => console.log(err)),
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('book_collection'),
    knex.schema.dropTable('book_genre'),
    knex.schema.dropTable('book_author'),
    knex.schema.dropTable('series_author'),
    knex.schema.dropTable('page'),
    knex.schema.dropTable('chapter'),
    knex.schema.dropTable('book'),
    knex.schema.dropTable('series'),
    knex.schema.dropTable('author'),
    knex.schema.dropTable('genre'),
    knex.schema.dropTable('collection'),
    knex.schema.dropTable('user')
  ])
}
