const path = require('path')

// This plugin to generate css bundle so we can load css async instead of waiting for Js bundle to be loaded.
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

// Shared settings between frontend and backend
const common = {
  devtool: 'cheap-eval-source-map',
  resolve: {
    extensions: ['.jade', '.styl', '.js', '.jsx']
  }
}

// frontend settings/context
const frontendConfig = {
  entry: [
    './source/client.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build/public/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.styl$/,
      //   use: ExtractTextPlugin.extract({
      //     use: [
      //       'style-loader',
      //       'css-loader',
      //       'stylus-loader'
      //     ]
      //   })
      // },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /source\/components\/database/
        ],
        use: [ 'babel-loader' ]
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['commons', 'manifest'], // Specify the common bundle's name.
      filename: 'commons.js',
      minChunks: 2 // any modules that get loaded 2 or more will bundle into commons.js
    })
  ]
}

// backend settings/context
const backendConfig = {
  entry: [
    './source/server.js'
  ],
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  },
  node: {
    __dirname: true
  },
  plugins: [
  ]
}

module.exports = [
  Object.assign({}, common, frontendConfig),
  Object.assign({}, common, backendConfig)
]
