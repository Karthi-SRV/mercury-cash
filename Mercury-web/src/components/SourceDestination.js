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

    useEffect(() => {
        fetchAirports()
    }, [])

    useEffect(() => {
        if (AirportList.length) {
            setAirportListArray(AirportList)
        }
    }, [AirportList])

    const fetchAirports = () => {
        props.getAirports()
    }

    const onChangeFromStation = (id) => {
        setFromStation(id)
    }

    const onChangeToStation = (id) => {
        setToStation(id)
    }

    const getAnalyse = () => {
        props.analyse({ sourcePort: fromStation, destinationPorts: toStation }, (data) => {
            setResponse(data)
        })
    }

    return (
        <Fragment>
            <div className="m-25">
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