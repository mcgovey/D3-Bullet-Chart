const StyleLintPlugin = require('stylelint-webpack-plugin');
const packageJSON = require('./package.json');
const path = require('path');

const DIST = path.resolve("./dist");
const MODE = process.env.NODE_ENV || 'development';
const SOURCE_MAP = 'source-map';
const DEVTOOL = (process.env.NODE_ENV === 'development') ? SOURCE_MAP : false;

console.log('Webpack mode:', MODE); // eslint-disable-line no-console

const config = {
  devtool: DEVTOOL,
  entry: [
    './src/index.js'
  ],
  mode: MODE,
  output: {
    filename: `${packageJSON.name}.js`,
    libraryTarget: 'amd',
    path: DIST
  },
  externals: {
    jquery: {
      amd: 'jquery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      root: '_'
    },
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules|Library)/,
        loader: "eslint-loader",
        options: {
          failOnError: true
        }
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new StyleLintPlugin()
  ]
};

module.exports = config;
