/**
 * Main store function
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import DevTools from './modules/App/components/DevTools'
import rootReducer from './store/reducers/'
import config from '../config'

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

    let persistedState
    if (typeof window !== 'undefined') {
        persistedState = localStorage.getItem(config.localStorage.redux) ? JSON.parse(localStorage.getItem(config.localStorage.redux)) : {}
    }

    const store = createStore(rootReducer, persistedState || initialState, compose(...enhancers))

    store.subscribe(()=>{
        if (typeof window !== 'undefined') {
            localStorage.setItem(config.localStorage.redux, JSON.stringify(store.getState()))
        }
    })

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
