/* eslint-disable no-unused-vars */
import { getCall, putCall, deleteCall, postCall } from './../../service/api'
import { message } from 'antd'

// Export Constants
export const SET_AIRPORTS = 'SET_AIRPORTS'
export const SET_ROUTES = 'SET_ROUTES'

// Export Actions
export function setAirports(issuance) {
    return {
        type: SET_AIRPORTS,
        payload: issuance,
    }
}

export function setRoutes(issuance) {
    return {
        type: SET_ROUTES,
        payload: issuance,
    }
}

export const getAirports = () => async (dispatch) => {
    const res = await getCall(`/airports`, {})
    if (res.status === 'success') {
        dispatch(setAirports(res.data))
    }
    message.error(res.message)
}

export const addAirport = (data, callback) => async (dispatch) => {
    const res = await postCall(`/airport`, data)
    if (res.status === 'success') {
        dispatch(setAirports(res.data))
    }
    message.error(res.message)
}

export const editAirport = (data, callback) => async (dispatch) => {
    const res = await putCall(`/airport/${data.id}`, data)
    if (res.status === 'success') {
        dispatch(setAirports(res.data))
    }
    message.error(res.message)
}

export const deleteAirport = (data, callback) => async (dispatch) => {
    const res = await deleteCall(`/airport/${data.id}`)
    if (res.status === 'success') {
        dispatch(setAirports(res.data))
    }
    message.error(res.message)
}

export const getRoutes = () => async (dispatch) => {
    const res = await getCall(`/routes`, {})
    if (res.status === 'success') {
        dispatch(setRoutes(res.data))
    }
    message.error(res.message)
}

export const addRoute = (data, callback) => async (dispatch) => {
    const res = await postCall(`/route`, data)
    if (res.status === 'success') {
        dispatch(setRoutes(res.data))
    }
    message.error(res.message)
}

export const editRoute = (data, callback) => async (dispatch) => {
    const res = await putCall(`/route/${data.id}`, data)
    if (res.status === 'success') {
        dispatch(setRoutes(res.data))
    }
    message.error(res.message)
}

export const deleteRoute = (data, callback) => async (dispatch) => {
    const res = await deleteCall(`/route/${data.id}`)
    if (res.status === 'success') {
        dispatch(setRoutes(res.data))
    }
    message.error(res.message)
}
