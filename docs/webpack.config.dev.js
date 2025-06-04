const path = require("path");

const filename = "homepage.webpack.min.js";
const library = "homepage";

module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/js/index.js",
  devtool: "inline-source-map",

  output: {
    filename,
    path: path.resolve(__dirname, "dist/js"),
    libraryTarget: "var",
    library,
    hashFunction: "xxhash64",
  },

  performance: {
    hints: false,
  },

  devServer: {
    port: 8000,
    static: {
      directory: path.resolve(__dirname, "./"),
      watch: true,
    },
    devMiddleware: {
      publicPath: "/dist/js",
      stats: "errors-warnings",
    },
    hot: true,
  },
};
