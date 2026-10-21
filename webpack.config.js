
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        clean: true,
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
                    options: {
                        transpileOnly: true
                    }
                },
                exclude: /node_modules/
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
            template: path.resolve(__dirname, "/index.html"),
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
