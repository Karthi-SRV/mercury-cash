import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getRoutes, getAirports, addRoute, deleteRoute } from '../store/actions/AppActions'
import { Select, Icon } from 'antd'
import 'antd/dist/antd.less'

const { Option } = Select 

const RoutesListComponent = (props) => {

    const { RouteList, AirportList } = props
    const [ RouteListArray, setRouteListArray ] = useState([])
    const [ AirportListArray, setAirportListArray ] = useState([])
    const [ fromStation, setFromStation ] = useState(null)
    const [ toStation, setToStation ] = useState(null)
    

    /** @description Similar to componentDidMount. Call only after rendering the component
     *  @param {object} callBack function
    */
    useEffect(() => {
        fetchRoutes()
        fetchAirports()
    }, [])

    useEffect(() => {
        if (RouteList.length) {
            setRouteListArray(RouteList)
            setFromStation(null)
            setToStation(null)
        }
    }, [ RouteList ])

    useEffect(() => {
        if (AirportList.length) {
            setAirportListArray(AirportList)
        }
    }, [ AirportList ])

    const fetchRoutes = () => {
        props.getRoutes()
    }

    const fetchAirports = () => {
        props.getAirports()
    }

    const onChangeFromStation = (id) => {
        setFromStation(id)
    }

    const onChangeToStation = (id) => {
        setToStation(id)
    }

    const addRoute = () => {
        props.addRoute({ fromStation, toStation })
    }

    const handleDelete = (id) => {
        props.deleteRoute(id)
    }
    
    return (
        <Fragment>
            <div>
                <div>
                    <div> LIST OF ROUTES </div>
                    <div>
                        <table>
                            <tr>
                                <th>FROM - </th>
                                <th>TO</th>
                            </tr>
                            {
                                RouteListArray && RouteListArray.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.fromAirportStation.name} - </td>
                                        <td>{data.toAirportStation.name}</td>
                                        <Icon type="delete" onClick={() => handleDelete(data.id)}/>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
                <div>
                    <span>FROM:
                        {
                            AirportListArray && <Select placeholder="Select source" size="large" onChange={onChangeFromStation}>
                                {
                                    AirportListArray.map((data, key) => (
                                        <Option key={key} value={data.id}>{data.name}</Option>
                                    ))
                                }
                            </Select>
                        }
                    </span>
                    <span>TO:
                        {
                            AirportListArray && <Select placeholder="Select destination" size="large" onChange={onChangeToStation}>
                                {
                                    AirportListArray.map((data, key) => (
                                        <Option key={key} value={data.id}>{data.name}</Option>
                                    ))
                                }
                            </Select>
                        }
                    </span>
                    <button type='submit' onClick={addRoute}>Add</button>
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