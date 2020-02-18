// eslint-disable no-unused-vars /
import { getCall, putCall, deleteCall, postCall } from './../../service/api'
import { message } from 'antd'

// Export Constants
export const SET_AIRPORTS = 'SET_AIRPORTS'
export const SET_ROUTES = 'SET_ROUTES'

// Export Actions
export function setAirports(data) {
    return {
        type: SET_AIRPORTS,
        payload: data,
    }
}

export function setRoutes(data) {
    return {
        type: SET_ROUTES,
        payload: data,
    }
}

export const getAirports = () => async (dispatch) => {
    const res = await getCall(`/station`, {})
    if (res.status) {
        return dispatch(setAirports(res.data))
    }
    showErroMessage(res.message)
}

export const addAirport = (data) => async (dispatch) => {
    const res = await postCall(`/station`, data)
    if (res.data.message) {
        showErroMessage(res.data.message)
    } else if (res.status) {
        dispatch(setAirports(res.data))
    }
}

export const editAirport = (data) => async (dispatch) => {
    const res = await putCall(`/station/${data.id}`, data)
    if (res.status) {
        dispatch(setAirports(res.data))
    }
    showErroMessage(res.message)
}

export const deleteAirport = (data) => async (dispatch) => {
    const res = await deleteCall(`/station/${data}`)
    if (res.status) {
        dispatch(setAirports(res.data))
    }
    showErroMessage(res.message)
}

export const getRoutes = () => async (dispatch) => {
    const res = await getCall(`/route`)
    if (res.status) {
        return dispatch(setRoutes(res.data))
    }
    showErroMessage(res.message)
}

export const addRoute = (data) => async (dispatch) => {
    const res = await postCall(`/route`, data)
    if (res.status) {
        return dispatch(setRoutes(res.data))
    }
    showErroMessage(res.message)
}

export const deleteRoute = (id) => async (dispatch) => {
    const res = await deleteCall(`/route/${id}`)
    if (res.status) {
        return dispatch(setRoutes(res.data))
    }
    showErroMessage(res.message)
}

export const analyse = (data, callback) => async (dispatch) => {
    const res = await postCall(`/analyse`, data)
    if (res.status) {
        return callback(res.data)
    }
    showErroMessage(res.message)
}

const showErroMessage = (errMeessage) => {
    if (errMeessage) {
        message.error(errMeessage)
    }
}