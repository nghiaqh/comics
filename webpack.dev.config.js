const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Shared settings between frontend and backend
const common = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.jade', '.styl', '.js', '.jsx']
  },
  watch: true
}

// frontend settings
const frontendConfig = {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './source/client/index.js'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build/public/'),
    filename: 'client.js',
    publicPath: 'http://localhost:3000/public/'
    // necessary for HMR to know where to load the hot update chunks
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'source/client'),
        use: [ 'babel-loader']
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        })
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors
    new ExtractTextPlugin('styles.css')
  ]
}

// backend settings
const backendConfig = {
  entry: [
    'webpack/hot/poll?1000',
    './source/server/index.js'
  ],
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000']
  })], // in order to ignore all modules in node_modules folder
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        })
      }
    ]
  },
  node: {
    __dirname: true
  },
  plugins: [
    new StartServerPlugin('server.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('styles.css')
  ]
}

module.exports = [
  Object.assign({}, common, frontendConfig),
  Object.assign({}, common, backendConfig)
]
