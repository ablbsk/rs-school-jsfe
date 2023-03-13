const path = require("path")
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (options) => {
  const isProduction = !!options.hasOwnProperty("production")

  const createHash = (ext) => `[name].[contenthash].${ext}`

  const createAssetPath = (pathData) => {
    const filepath = path
      .dirname(pathData.filename)
      .split("/")
      .slice(1)
      .join("/")
    return `assets/${filepath}/[name][ext]`
  }

  /* =============================== OPTIONS =============================== */

  const faviconOptions = {
    logo: "./assets/icons/favicon.png",
    outputPath: "assets/icons/favicon"
  }

  /* =============================== CONFIG ================================ */

  return {
    mode: isProduction ? "production" : "development",
    context: path.resolve(__dirname, "src"),
    entry: {
      main: path.resolve(__dirname, "src/index.ts")
    },
    output: {
      clean: true,
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? createHash("js") : "[name].js",
      assetModuleFilename: (pathData) => createAssetPath(pathData)
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 8097
    },
    plugins: [
      new ESLintPlugin({ extensions: ["ts", "js"] }),
      new MiniCssExtractPlugin({ filename: createHash("css") }),
      new FaviconsWebpackPlugin(faviconOptions),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        filename: 'index.html',
        inject: 'body'
      }),
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader"
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader"
        },
        {
          test: /\.(ts|tsx)$/i,
          exclude: /node_modules/,
          loader: "ts-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
          type: isProduction ? "asset/resource" : "asset/inline"
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource"
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      },
      minimize: true
    }
  }
}
