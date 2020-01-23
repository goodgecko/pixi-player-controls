const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')
const PACKAGE = require('./package.json');

// Library output details
var FILE_NAME = "game";
var LIBRARY_NAME = PACKAGE.name;

// Build, source, etc paths
var PATHS = {
    entryPoint: path.resolve(__dirname, 'src/Boot.ts'),
    dist: path.resolve(__dirname, 'dist'),
    lib: path.resolve(__dirname, 'lib')
}

// Webpack config
module.exports = {
    mode: "production",
    entry: {
        [FILE_NAME]: [PATHS.entryPoint],
        [FILE_NAME + '.min']: [PATHS.entryPoint]
    },
    output: {
        path: PATHS.dist,
        filename: '[name].js',
        libraryTarget: 'umd',
        library: LIBRARY_NAME,
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
            query: {
                declaration: false,
            }
        }]
    },
    plugins: [
        new CheckerPlugin()
    ],
}