import express from 'express'
import cookieParser from 'cookie-parser'
import _ from 'lodash'
import serverSideRendering from './render'
import { authenticator } from './validator'

const isProd = (process.env.NODE_ENV === 'production')
const _isDev = !isProd


export default ({
    clientStats,
    serverStats: _serverStats,
}) => {
    console.log('Setting up express...') //eslint-disable-line
    const app = express.Router()
    app.use(cookieParser())
    app.use('*', authenticator)
    app.use(serverSideRendering({ clientStats }))


    console.log('Done!') //eslint-disable-line


    return app
}