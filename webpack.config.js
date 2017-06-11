const path = require('path')
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
    './source/client/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build/public/'),
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [
          /node_modules/,
          /source\/components\/database/
        ],
        use: [ 'babel-loader' ]
      }
    ]
  },
  plugins: [
  ]
}

// backend settings/context
const backendConfig = {
  entry: [
    './source/server/index.js'
  ],
  target: 'node',
  // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()],
  // in order to ignore all modules in node_modules folder
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
