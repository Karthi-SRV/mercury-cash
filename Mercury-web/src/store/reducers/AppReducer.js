import { SET_AIRPORTS, SET_ROUTES } from '../actions/AppActions'

export default ( state = { issuance: {} }, { payload, type } ) => {
    switch ( type ) {
    case SET_AIRPORTS: {
        return Object.assign({}, state, {
            airports: payload,
        })
    }
    case SET_ROUTES: {
        return Object.assign({}, state, {
            routes: payload,
        })
    }
    default:
        return state
    }
}

export const getAirports = state => state.app.airports

export const getRoutes = state => state.app.routes
