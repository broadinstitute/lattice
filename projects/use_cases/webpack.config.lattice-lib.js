const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const filename = "lattice-lib"; // need to export multiple 
const library = "LatticeLib";

module.exports = {
    target: "web",
    entry: {
        app: "../../src/libs/LatticeLib.js"
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: `css/${filename}.min.css` }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "build/js"),  
                    to: path.resolve(__dirname, "../../docs/dist/js/lib") 
                }
            ]
        })
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { hmr: true }
                    },
                    "css-loader" 
                ],
            },
            {
                test: /\.js$/,
                loader: "eslint-loader",
                include: path.resolve(process.cwd(), "src"),
                enforce: "pre",
                options: { fix: true }
            }
        ]
    },
    output: {
        filename: `js/${filename}.min.js`,
        path: path.resolve(__dirname, "build"),
        libraryTarget: "var",
        library: library,
    },
    devtool: "inline-source-map",
    devServer: {
        port: 8002,
        publicPath: "/build", // keep in mind that when using webpack-dev-server, this path is only virtual
        contentBase: path.resolve(__dirname, "./"),
        watchContentBase: true,
        stats: {
            children: false
        }
    }
};
