const path = require('path')
const CLIENT_DIR = path.resolve(__dirname, 'client')
const SERVER_DIR = path.resolve(__dirname, 'server')

// This plugin to generate css bundle so we can load css async instead of waiting for Js bundle to be loaded.
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

// Shared settings between frontend and backend
const common = {
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: [
            'style-loader',
            'css-loader',
            'stylus-loader'
          ]
        })
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['commons', 'manifest'], // Specify the common bundle's name.
      filename: 'commons.js',
      minChunks: 2 // any modules that get loaded 2 or more will bundle into commons.js
    }),
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
  ],
  devtool: 'cheap-eval-source-map'
}

// frontend settings/context
const frontend = {
  context: CLIENT_DIR,
  entry: {
    main: './index.js',
    reactHotLoader: 'react-hot-loader/patch', // activate HMR for React
    onlyDevServer: 'webpack/hot/only-dev-server' // bundle the client for hot reloading
  },
  output: {
    path: path.resolve(__dirname, './dist/javascript'),
    filename: '[name].[chunkhash].js',
    publicPath: '/' // necessary for HMR to know where to load the hot update chunks
  }
}

// backend settings/context
const backend = {
  context: SERVER_DIR,
  entry: {
    main: './app.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].js'
  }
}

module.exports = [
  Object.assign({}, common, frontend),
  Object.assign({}, common, backend)
]
