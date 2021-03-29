const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const filename = "icomut";
const library = "iCoMut";

module.exports = {
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin()]
    },
    entry: "./src/js/iCoMut.js",
    plugins: [new MiniCssExtractPlugin({
        filename: `css/${filename}.min.css`
    })],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, "css-loader" ],
            }
        ]
    },
    output: {
        filename: `js/${filename}.min.js`,
        path: path.resolve(__dirname, "build"),
        libraryTarget: "var",
        library: library,
    },
    devtool: "inline-source-map"
};
