const Dotenv = require('dotenv-webpack')
const resolvePath = path => require('path').resolve(__dirname, path)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack')

const webpackClientConfig = {
    name: 'client', // Used by webpack-hot-server-middleware
    mode: 'production',
    target: 'web',
    entry: [
        resolvePath(
            '../../src/index.js',
        ),
    ],
    output: {
        filename: 'prod-[name]-[hash:8].js',
        chunkFilename: 'prod-chunk-[name]-[hash:8].js',
        path: resolvePath('../../bootstrap/client-build'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
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
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: 'prod-[name]__[local]--[hash:base64:5]',
                            importLoaders: 1,
                        },
                    },
                ],
            },
            {
                test: /\.(less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
            name: 'bootstrap',
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
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'prod-[name].css',
            chunkFilename: 'prod-[name]-[hash:8].css',
        }),
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new Dotenv({
            path: './.env.production',
            safe: true,
        }),
    ],
    resolve: {
        extensions: [ '.js' ],
        modules: [ resolvePath('../../client'), 'node_modules' ],
    },
}

module.exports = webpackClientConfig
