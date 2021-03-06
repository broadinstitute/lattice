const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const filename = "icomut"; // need to export multiple 
const library = "iCoMut";
module.exports = {
    target: "web",
    entry: "./src/js/iCoMut.js",
    plugins: [
        new MiniCssExtractPlugin({ filename: `css/${filename}.min.css` })
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
        port: 3003,
        publicPath: "/build",
        contentBase: path.resolve(__dirname, "./"),
        watchContentBase: true,
        stats: {
            children: false
        }
    }
};
