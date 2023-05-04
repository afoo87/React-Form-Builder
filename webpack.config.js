const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [
                  "style-loader",
                  {
                    loader: "css-loader",
                    options: {
                      modules: true,
                    },
                  },
                ],
            },
        ],
    },
};