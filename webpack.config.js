
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",

    entry: "./src/index.ts",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash].js",
      clean: true,
      publicPath: isProduction ? "./" : "/",
    },

    resolve: {
      extensions: [".ts", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: { transpileOnly: true },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.glsl$/,
          type: "asset/source",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            to: ".",
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
    ],

    devServer: {
      port: 8080,
      open: true,
      hot: true,
      static: {
        directory: path.resolve(__dirname, "public"),
      },
    },
  };
};
