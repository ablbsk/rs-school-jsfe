const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const pages = []

fs.readdirSync('src/pages/').forEach(file => {
  pages.push(new HtmlWebpackPlugin({
    filename: file,
    template: path.resolve(__dirname, `src/pages/${file}`),
    inject: 'body'
  }))
})

module.exports = (options) => {
  const isProduction = !!options.hasOwnProperty('production') // Webpack mode
  const isLossyOptimization = true // Image optimization

  const lossyOptimizationPlugins = ['imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant']
  const losslessOptimizationPlugins = [
    ['gifsicle', { interlaced: true }],
    ['jpegtran', { progressive: true }],
    ['optipng', { optimizationLevel: 5 }]
  ]

  // MiniCssExtractPlugin.loader — add styles in new file
  // style-loader — add styles in head tag in index.html
  const cssBuild = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'
  const cssPostLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['postcss-preset-env']]
      }
    }
  }

  const createHash = (ext) => `[name].[contenthash].${ext}`

  /* =============================== OPTIONS =============================== */

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
    devtool: isProduction ? false : 'source-map', // The point or points where to start the application bundling process
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 8097
    },
    entry: {
      main: path.resolve(__dirname, 'src/scripts/index.js')
    },
    output: {
      assetModuleFilename: 'assets/[name][ext]', // create folder assets in dist
      clean: true,
      filename: isProduction ? createHash('js') : '[name].js',
      path: path.resolve(__dirname, 'dist') // The output directory as an absolute path
    },
    resolve: {
      extensions: ['.js'] // ignore extensions in imports
    },
    plugins: [new ESLintPlugin(eslintOptions), new MiniCssExtractPlugin(cssOptions), ...pages],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader' // Adds images when they used tag img in html
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: isProduction ? 'asset/resource' : 'asset/inline' // Adds images when they are used in CSS as a background
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|mp3)$/i,
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
