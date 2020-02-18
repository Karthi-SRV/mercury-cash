import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getAirports, analyse } from '../store/actions/AppActions'
import { Select, Button } from 'antd'

const { Option } = Select

const SourceDestinationComponent = (props) => {

    const { AirportList } = props
    const [AirportListArray, setAirportListArray] = useState([])
    const [fromStation, setFromStation] = useState(null)
    const [toStation, setToStation] = useState([])
    const [response, setResponse] = useState({})

    /** @description Similar to componentDidMount. Call only after rendering the component
    */
    useEffect(() => {
        fetchAirports()
    }, [])

    /**
    * component didupdate triger whenever AirportList chage 
    */
    useEffect(() => {
        if (AirportList.length) {
            setAirportListArray(AirportList)
        }
    }, [AirportList])

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
     * get the minimum jumps
     */
    const getAnalyse = () => {
        props.analyse({ sourcePort: fromStation, destinationPorts: toStation }, (data) => {
            setResponse(data)
        })
    }

    return (
        <Fragment>
            <div className="m-25 m-b-10">
                <div className='header'> SHORTEST PATH </div>
                <div className='selectClass'>
                    <span>FROM :
                    {
                            AirportListArray && <Select style={{ width: '20%' }} placeholder="Select source" onChange={onChangeFromStation}>
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
                            AirportListArray && <Select style={{ width: '20%' }} placeholder="Select destination" mode="multiple" onChange={onChangeToStation}>
                                {
                                    AirportListArray.map((data, key) => (
                                        <Option key={key} value={data.id}>{data.name}</Option>
                                    ))
                                }
                            </Select>
                        }
                    </span>
                    <div className="m-t-b-10"> Optimal output: {response.optimalOutput}</div>
                    <div className="m-t-b-15"><Button type='submit' onClick={getAnalyse}>Get</Button></div>
                </div>
            </div>
        </Fragment>
    )
}

/** @description store data to your component
* @param {object} state redux state object
*/
const mapStateToProps = (state) => {
    return {
        AirportList: state.app.airports,
    }
}

/**
* provide the action creators as props to your component
* @param {object} dispatch redux dispatch object
*/
const mapDispatchToProps = {
    getAirports,
    analyse,
}

// connect our component with store
export default connect(mapStateToProps, mapDispatchToProps)(SourceDestinationComponent)

SourceDestinationComponent.propTypes = {
    getAirports: PropTypes.func,
    analyse: PropTypes.func,
}