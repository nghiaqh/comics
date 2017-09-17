const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const nodeEnv = process.env.NODE_ENV || 'development';

// Shared settings between frontend and backend
const common = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.styl', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'source'),
      path.resolve(__dirname, 'node_modules')
    ],
    alias: {
      KnexFile: path.resolve(__dirname, 'knexfile.js')
    }
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
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // http://stackoverflow.com/a/35372706/2177568
      // for server side code, just require, don't chunk
      // use `if (ONSERVER) { ...` for server specific code
      ONSERVER: false,
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors
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
        use: [
          'css-loader/locals',
          'stylus-loader'
        ]
      }
    ]
  },
  node: {
    __dirname: true
  },
  plugins: [
    new webpack.DefinePlugin({
      // http://stackoverflow.com/a/35372706/2177568
      // for server side code, just require, don't chunk
      // use `if (ONSERVER) { ...` for server specific code
      ONSERVER: true,
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new StartServerPlugin('server.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

module.exports = [
  Object.assign({}, common, frontendConfig),
  Object.assign({}, common, backendConfig)
]
