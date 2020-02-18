import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getRoutes, getAirports, addRoute, deleteRoute } from '../store/actions/AppActions'
import { Select, Icon, Button } from 'antd'

const { Option } = Select

const RoutesListComponent = (props) => {

    const { RouteList, AirportList } = props
    const [RouteListArray, setRouteListArray] = useState([])
    const [AirportListArray, setAirportListArray] = useState([])
    const [fromStation, setFromStation] = useState(null)
    const [toStation, setToStation] = useState(null)


    /** @description Similar to componentDidMount. Call only after rendering the component
    */
    useEffect(() => {
        fetchRoutes()
        fetchAirports()
    }, [])

    /**
    * component didupdate triger whenever RouteList chage 
    */
    useEffect(() => {
        if (RouteList.length) {
            setRouteListArray(RouteList)
            setFromStation(null)
            setToStation(null)
        }
    }, [RouteList])

    /**
    * component didupdate triger whenever AirportList chage 
    */
    useEffect(() => {
        if (AirportList.length) {
            setAirportListArray(AirportList)
        }
    }, [AirportList])

    /**
    * provide the action creators for getting the list or routes
    * @param {object} dispatch redux dispatch object
    */
    const fetchRoutes = () => {
        props.getRoutes()
    }

    /**
    * provide the action creators for getting thr list of airports
    */
    const fetchAirports = () => {
        props.getAirports()
    }

    /**
    * triger when we select the from airport
    * @param {staring} id if a airport
    */
    const onChangeFromStation = (id) => {
        setFromStation(id)
    }

    /**
     * triger when we select the to airport
     * @param {staring} id if a airport
     */
    const onChangeToStation = (id) => {
        setToStation(id)
    }

    /**
    * Add a new route 
    */
    const addRoute = () => {
        props.addRoute({ fromStation, toStation })
    }

    /**
    * delete existing route
    * @param {string} id 
    */
    const handleDelete = (id) => {
        props.deleteRoute(id)
    }

    return (
        <Fragment>
            <div>
                <div className="m-25 m-b-10">
                    <div className='header'> LIST OF ROUTES </div>
                    <div>
                        <table>
                            <tbody>
                                <tr className='tableTitle'>
                                    <th>FROM</th>
                                    <th>TO</th>
                                    <th>Delete</th>
                                </tr>
                                {RouteListArray && RouteListArray.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.fromAirportStation.name}</td>
                                        <td>{data.toAirportStation.name}</td>
                                        <td><Icon type="delete" onClick={() => handleDelete(data.id)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='selectClass'>
                    <span className="m-f-15">FROM :
                        {
                            AirportListArray && <Select placeholder="Select source" style={{ width: '20%' }} size="large" onChange={onChangeFromStation}>
                                {
                                    AirportListArray.map((data, key) => (
                                        <Option key={key} value={data.id}>{data.name}</Option>
                                    ))
                                }
                            </Select>
                        }
                    </span>
                    <span className="m-f-15">TO :
                        {
                            AirportListArray && <Select placeholder="Select destination" style={{ width: '20%' }} size="large" onChange={onChangeToStation}>
                                {
                                    AirportListArray.map((data, key) => (
                                        <Option key={key} value={data.id}>{data.name}</Option>
                                    ))
                                }
                            </Select>
                        }
                    </span>
                    <div className="m-25">
                        <Button type='submit' onClick={addRoute} className='addRoute'>Add</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

/** @description store data to your component
 *  @param {object} state redux state object
*/
const mapStateToProps = (state) => {
    return {
        RouteList: state.app.routes,
        AirportList: state.app.airports,
    }
}

/**
 * provide the action creators as props to your component
 * @param {object} dispatch redux dispatch object
 */
const mapDispatchToProps = {
    getRoutes,
    getAirports,
    addRoute,
    deleteRoute,
}

// connect our component with store
export default connect(mapStateToProps, mapDispatchToProps)(RoutesListComponent)

RoutesListComponent.propTypes = {
    getRoutes: PropTypes.func,
    getAirports: PropTypes.func,
    addRoute: PropTypes.func,
    deleteRoute: PropTypes.func,
    RouteList: PropTypes.array,
    AirportList: PropTypes.array,
}