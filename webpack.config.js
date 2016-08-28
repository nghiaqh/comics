const path = require('path');
const CLIENT_DIR = path.resolve(__dirname, 'client');

module.exports = {
  context: CLIENT_DIR,
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'public/javascripts/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: CLIENT_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  resolve: {
    alias: {
      components: path.resolve(CLIENT_DIR, 'components')
    }
  }
};
