const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (options) => {
  const isProduction = !!options.hasOwnProperty('production');

  const createHash = (ext) => `[name].[contenthash].${ext}`;

  const htmlOptions = {
    filename: 'index.html',
    template: path.resolve(__dirname, 'src/index.html'),
    inject: 'body',
  };

  return {
    mode: isProduction ? 'production' : 'development',
    context: path.resolve(__dirname, 'src'),
    devtool: isProduction ? false : 'source-map',
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 8088,
    },
    entry: {
      main: path.resolve(__dirname, 'src/index.ts'),
    },
    output: {
      assetModuleFilename: 'assets/[name][ext]',
      clean: true,
      filename: isProduction ? createHash('js') : '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    plugins: [
      new ESLintPlugin({ extensions: ['ts', 'js'] }),
      new MiniCssExtractPlugin({ filename: createHash('css') }),
      new FaviconsWebpackPlugin('./assets/icons/favicon.png'),
      new HtmlWebpackPlugin(htmlOptions),
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: isProduction ? 'asset/resource' : 'asset/inline',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'ts-loader'],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  };
};
