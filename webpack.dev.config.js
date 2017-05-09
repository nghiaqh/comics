const path = require('path')
const nodeExternals = require('webpack-node-externals')

// This plugin to generate css bundle so we can load css async instead of waiting for Js bundle to be loaded.
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

// Shared settings between frontend and backend
const common = {
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.yade', '.styl', '.js', '.jsx']
  }
}

// frontend settings/context
const frontendConfig = {
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack/hot/only-dev-server', // bundle the client for hot reloading
    'webpack-hot-middleware/client',
    './source/client.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build/public/javascript'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/javascript/' // necessary for HMR to know where to load the hot update chunks
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
        exclude: [/node_modules/,
          /components\/book\/*/,
          /source\/components\/chapter\/*/,
          /source\/components\/picture\/*/,
          /source\/components\/database\/sqlite.js/],
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
    }),
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
  ]
}

// backend settings/context
const backendConfig = {
  entry: './source/index.js',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
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
  }
}

module.exports = [
  Object.assign({}, common, frontendConfig),
  Object.assign({}, common, backendConfig)
]
