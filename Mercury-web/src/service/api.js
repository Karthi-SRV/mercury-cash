import axios from 'axios'
import _ from 'lodash'

const API_HOST = process.env.API_URL
export const getCall =  ( endpoint, headers = {}, params = null ) =>  (
    axios.get(`${ API_HOST }${ endpoint }`, {
        headers: {
            ...headers,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        params,
    } ))

export const postCall =  ( endpoint, payload, config = {} ) => (
    axios.post( `${ API_HOST }${ endpoint }`, payload, config  )
)

export const putCall =  ( endpoint, payload, config = {} ) =>
    (axios.put( `${ API_HOST }${ endpoint }`, payload, config ))

export const deleteCall =  ( endpoint, params) =>
    (axios.delete( `${ API_HOST }${ endpoint }`, { params } ))

axios.interceptors.request.use(async(req) => {
    return ({ ...req, withCredentials: true })
} , (error) =>
    Promise.reject(error)
)

axios.interceptors.response.use( (response) =>
    response.data
, ((error) => {
    return error.response.data || error.response
}))
