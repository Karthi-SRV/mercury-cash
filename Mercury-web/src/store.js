/**
 * Main store function
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import DevTools from './modules/App/components/DevTools'
import rootReducer from './store/reducers/'

const isClient = !(typeof window === 'undefined' || process.env.NODE_ENV === 'test')

export function configureStore(initialState = {}) {
    // Middleware and store enhancers
    const enhancers = [
        applyMiddleware(thunk),
    ]

    if (isClient && process.env.NODE_ENV === 'development') {
        // Enable DevTools only when rendering on client and during development.
        enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : DevTools.instrument())
    }

    const store = createStore(rootReducer, initialState, compose(...enhancers))

    // For hot reloading reducers
    if (module.hot) {
    // Enable Webpack hot module replacement for reducers
        module.hot.accept('./store/reducers', () => {
            const nextReducer = require('./store/reducers').default // eslint-disable-line global-require
            store.replaceReducer(nextReducer)
        })
    }

    return store
}
