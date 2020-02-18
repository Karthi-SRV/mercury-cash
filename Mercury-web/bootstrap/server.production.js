require('@babel/polyfill')
require('dotenv').config()

const path = require('path')

const express = require('express')

const compression = require('compression')

const webpackClientConfig = require('../config/webpack/prod.client.webpack')
const webpackServerConfig = require('../config/webpack/prod.server.webpack')

const clientOutputPath = webpackClientConfig.output.path
const serverOutputPath = webpackServerConfig.output.path

const clientStats = require(clientOutputPath + '/prod.client.stats.json')
const serverStats = require(serverOutputPath + '/prod.server.stats.json')

const serverBuild = require(serverOutputPath + '/prod.server.js').default

const SERVER_PORT = process.env.PORT || 8000

const app = express()

app.disable('x-powered-by')

app.set('view engine', 'ejs')

app.use(compression())

app.use('/assets', express.static(path.resolve(__dirname, '../src/assets')))

app.use(express.static(clientOutputPath))
app.use(serverBuild({ clientStats, serverStats }))
app.listen(SERVER_PORT, error => {
    if (error) {
        console.error(error) // eslint-disable-line
    } else {
        console.log(`[Mercury Web] started on port ${SERVER_PORT} with environment public URL set to ${process.env.PUBLIC_URL}`) // eslint-disable-line
    }
})