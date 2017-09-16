const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Shared settings between frontend and backend
const common = {
  devtool: 'cheap-eval-source-map',
  resolve: {
    extensions: ['.styl', '.js', '.jsx']
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
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    ExtractTextPlugin('app.css')
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
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          'stylus-loader'
        ]
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
