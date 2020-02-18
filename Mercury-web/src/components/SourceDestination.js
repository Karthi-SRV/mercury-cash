import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getAirports, analyse } from '../store/actions/AppActions'
import { Select } from 'antd'

const { Option } = Select 

const SourceDestinationComponent = (props) => {

    const { AirportList } = props
    const [AirportListArray, setAirportListArray] = useState([])
    const [ fromStation, setFromStation ] = useState(null)
    const [ toStation, setToStation ] = useState([])
    const [ response, setResponse ] = useState({})

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
        props.analyse({sourcePort: fromStation, destinationPorts: toStation}, (data) => {
            setResponse(data)
        })
    }

    return (
        <Fragment>
            <div> SHORTEST PATH </div>
            <div>
                <span>FROM:
                    {
                        AirportListArray && <Select placeholder="Select source" onChange={onChangeFromStation}>
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
                        AirportListArray && <Select placeholder="Select destination" mode="multiple" onChange={onChangeToStation}>
                            {
                                AirportListArray.map((data, key) => (
                                    <Option key={key} value={data.id}>{data.name}</Option>
                                ))
                            }
                        </Select>
                    }
                </span>
                <div> Optimal output: {response.optimalOutput}</div>
                <button type='submit' onClick={getAnalyse}>Get</button>
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