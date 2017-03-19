# Webpack notes

## 1. code splitting:

- extract-text-webpack-plugin: generates a new bundle specifically for CSS modules, so we can load CSS asynchronously instead of waiting for whole Javascript bundle to be loaded.
- webpack.optimize.CommonsChunkPlugin: separate vendor js from app js. Use with manifest and chunkhash.
