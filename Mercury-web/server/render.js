import { Provider } from 'react-redux'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { configureStore } from '../src/store'
import Helmet from 'react-helmet'
import AppBody from '../src/AppBody'
import { StaticRouter } from 'react-router-dom'
import { Frontload, frontloadServerRender as _frontloadServerRender } from 'react-frontload'
import flushChunks from 'webpack-flush-chunks'
import { flushChunkNames } from 'react-universal-component/server'
import * as _ from 'lodash'

/**
 * Initialize the store with the user's data from the cookie..
 *
 * @param {*} req
 * @param {*} store
 * @param {*} urlValues
 */

export default ({ clientStats }) => async(req, res) => {
    const context = {}
    let store = configureStore()
    try {

        const app = (
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <Frontload isServer>
                        <AppBody />
                    </Frontload>
                </StaticRouter>
            </Provider>
        )

        const html = renderToString(app)
        // const routeMarkup = await frontloadServerRender(() => html);

        if (context.url) {
            return res.redirect(context.url)
        }

        const chunkNames = flushChunkNames()

        const { js, styles, cssHash, scripts, stylesheets } = flushChunks(clientStats, { chunkNames })

        let helmet = Helmet.renderStatic()

        let title = 'Mercury'

        /** Rename helmet 'title' and 'link' with our porject and fav icon */
        helmet.title = `<title data-react-helmet="true">${title}</title>`
        helmet.link = '<link rel="icon" type="image/png" href="" ></link>'

        const heads = `
            ${styles}
            ${helmet.title}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
        `

        const scriptTags = `
            ${js}
            ${cssHash}
        `

        const finalState = JSON.stringify(store.getState()).replace(/</g, '\\x3c')

        return res.render('pages/main.ejs', {
            heads: heads,
            html: html,
            scripts: scriptTags,
            initialState: finalState,
        })
    } catch (ex) {
        console.error(ex) // eslint-disable-line
    }
}
