const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const resolvePath = path => require('path').resolve(__dirname, path)
const Dotenv = require('dotenv-webpack')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
const webpack = require('webpack')

const webpackClientConfig = smp.wrap({
    name: 'client',                            // Used by webpack-hot-server-middleware
    mode: 'development',                       // server
    target: 'web',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
        resolvePath(
            '../../src/index.js',
        ),
    ],
    output: {
        filename: 'dev-[name].js',             // how to write output in disk
        chunkFilename: 'dev-[name].js',
        path: resolvePath('../../bootstrap/client-build'),
        publicPath: '/',
    },
    devtool: "#eval-source-map",               // debugging of your application.
    module: {                                  // types of modules
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',                // to transpile down to vanilla JavaScript
                options: {
                    presets: [
                        [
                            "@babel/preset-env", {
                                "modules": false,
                                "targets": { "browsers": [ "last 2 versions", "IE > 10" ] },
                            },
                        ],
                        "@babel/preset-react",
                    ],
                    plugins: [
                        "universal-import",
                        "react-hot-loader/babel",
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-proposal-object-rest-spread",
                        [ "import", { "libraryName": "antd", "style": "true" } ],
                        [ "css-modules-transform", {
                            "extensions": [ ".css", ".less" ],
                        } ],
                    ],
                },
            },
            {
                test: /\.css$/,         // We test for CSS files with a .css extension. Here we use two loaders, style-loader and css-loader
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: 'dev-[name]__[local]--[hash:base64:5]',
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(less)$/,
                use: [
                    ExtractCssChunks.loader,
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            {
                test: /\.(gif|ico|jpg|png|svg)$/,
                loader: 'url-loader',
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: 'bootstrap',                                     // finally we configure the development server
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all',
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractCssChunks({
            filename: 'dev-[name].css',
            chunkFilename: 'dev-[name]-[hash:8].css',
            hot: true,
        }),
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new Dotenv({
            path: './.env.development',
            safe: true,
        }),
    ],
    resolve: {
        extensions: [ '.js' ],
        modules: [ resolvePath('../../client'), 'node_modules' ],
    },
})

module.exports = webpackClientConfig