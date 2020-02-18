require('@babel/polyfill')
require('dotenv').config()

const path = require('path')
const express = require('express')

const SERVER_PORT = process.env.PORT || 8000

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
const webpackClientConfig = require('../config/webpack/dev.client.webpack')
const webpackServerConfig = require('../config/webpack/dev.server.webpack')

const webpackCompiler = webpack([ webpackClientConfig, webpackServerConfig ])
const [ webpackClientCompiler, _webpackServerCompiler ] = webpackCompiler.compilers

const app = express()

app.disable('x-powered-by')

app.set('view engine', 'ejs')

app.use('/assets', express.static(path.resolve(__dirname, '../src/assets')))

app.use(webpackDevMiddleware(webpackCompiler))
app.use(webpackHotMiddleware(webpackClientCompiler))
app.use(webpackHotServerMiddleware(webpackCompiler))

let __BUILD_COMPLETE__ = false

webpackCompiler.plugin(
    'done',
    () =>
        !__BUILD_COMPLETE__
        && app.listen(SERVER_PORT, error => {
            if (error) {
                console.error(error) //eslint-disable-line
            } else {
                __BUILD_COMPLETE__ = true
                console.log(`[Mercury Web] started on port ${SERVER_PORT} with environment public URL set to ${process.env.PUBLIC_URL}`) // eslint-disable-line
             // eslint-disable-line
            }
        }),
)