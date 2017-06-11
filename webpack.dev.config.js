const path = require('path')

// This plugin to generate css bundle so we can load css async instead of waiting for Js bundle to be loaded.
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

// Shared settings between frontend and backend
const common = {
  devtool: 'cheap-eval-source-map',
  resolve: {
    extensions: ['.jade', '.styl', '.js', '.jsx']
  },
  watch: true
}

// frontend settings/context
const frontendConfig = {
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack/hot/only-dev-server', // bundle the client for hot reloading
    'webpack-hot-middleware/client',
    './source/client.js'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build/public/'),
    filename: 'bundle.js',
    publicPath: '/' // necessary for HMR to know where to load the hot update chunks
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
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
  ]
}

// backend settings/context
const backendConfig = {
  entry: [
    'webpack/hot/poll?1000',
    './source/server.js'
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
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

module.exports = [
  Object.assign({}, common, frontendConfig),
  Object.assign({}, common, backendConfig)
]
