const path = require('path');
const filename = 'homepage.webpack.min.js';
const library = 'homepage';

module.exports = {
    target: "web",
    entry: './src/js/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: filename,
        path: path.resolve(__dirname, 'dist/js'),
        libraryTarget: 'var',
        library: library,
    },
    devServer: {
        port: 8000,
        publicPath: '/dist/js',
        contentBase: path.resolve(__dirname, "./"),
        hot: true,
        watchContentBase: true,
        stats: {
            children: false
        }
    }
};