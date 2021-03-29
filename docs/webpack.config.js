const path = require('path');
const filename = 'homepage.webpack.min.js';
const library = 'homepage';

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: filename,
        path: path.resolve(__dirname, 'dist/js'),
        libraryTarget: 'var',
        library: library,
    },
    devtool: 'inline-source-map'
};