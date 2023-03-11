const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (options) => {
  const isProduction = !!options.hasOwnProperty('production')

  const isLossyOptimization = true

  const lossyOptimizationPlugins = ['imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant']
  const losslessOptimizationPlugins = [
    ['gifsicle', { interlaced: true }],
    ['jpegtran', { progressive: true }],
    ['optipng', { optimizationLevel: 5 }]
  ]

  const createHash = (ext) => `[name].[contenthash].${ext}`

  const cssBuild = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

  const cssPostLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['postcss-preset-env']]
      }
    }
  }

  /* =============================== OPTIONS =============================== */

  const htmlPages = [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/pages/index.html'),
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      filename: 'donate.html',
      template: path.resolve(__dirname, 'src/pages/donate.html'),
      inject: 'body'
    })
  ]

  const cssOptions = {
    filename: createHash('css')
  }

  const eslintOptions = {
    extensions: ['js']
  }

  const imageminOptions = {
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        plugins: isLossyOptimization ? lossyOptimizationPlugins : losslessOptimizationPlugins
      }
    }
  }

  /* =============================== CONFIG ================================ */

  return {
    mode: isProduction ? 'production' : 'development',
    context: path.resolve(__dirname, 'src'),
    devtool: isProduction ? false : 'source-map',
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 8088
    },
    entry: {
      main: path.resolve(__dirname, 'src/index.js')
    },
    output: {
      assetModuleFilename: 'assets/[name][ext]',
      clean: true,
      filename: isProduction ? createHash('js') : '[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [new ESLintPlugin(eslintOptions), new MiniCssExtractPlugin(cssOptions), ...htmlPages],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader'
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: isProduction ? 'asset/resource' : 'asset/inline'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [cssBuild, 'css-loader', cssPostLoader, 'sass-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      minimize: true,
      minimizer: [new ImageMinimizerPlugin(imageminOptions), new TerserPlugin()]
    }
  }
}
