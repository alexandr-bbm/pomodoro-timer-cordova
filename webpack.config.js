const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const ENV = require('./env');
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www'),
};

process.env.BABEL_ENV = ENV;

const common = {
  entry: PATHS.src,
  output: {
    path: PATHS.build,
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: PATHS.src,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'postcss-loader'],
        }),
      },
      {
        test: /\.(ttf|eot|woff)/,
        use: 'file-loader',
      },
      {
        test: /\.svg/,
        use: 'raw-loader',
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ],
};

if (ENV === 'development') {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'inline-source-map'
  });
} else {
  // config can be added here for minifying / etc
  module.exports = merge(common, {});
}
