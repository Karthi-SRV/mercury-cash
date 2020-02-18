import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as _ from 'lodash';
import { Icon, Button, Input } from 'antd'
import { getAirports, addAirport, deleteAirport, editAirport } from '../store/actions/AppActions'
import styles from './styles.css'

const AirportListComponent = (props) => {

    const { AirportList } = props
    const [AirportListArray, setAirportListArray] = useState([])
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [seletedId, setSeletedId] = useState(null)

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
   * Create or Edit your Airports
   */
    const createEditAirport = () => {
        !_.isNull(seletedId) ? props.editAirport({ name, code, id: seletedId }) : props.addAirport({ name, code })
    }

    /**
   * onchage for airport name
   */
    const onChangeName = (e) => {
        setName(e.target.value)
    }

    /**
   * onchage for airport code
   */
    const onChangeCode = (e) => {
        setCode(e.target.value)
    }

    /**
   * delete the airport
   */
    const handleDelete = (id) => {
        props.deleteAirport(id)
    }

    /**
   * Edit selected airport
   */
    const handleClickEdit = (data) => {
        setSeletedId(data.id)
        setName(data.name)
        setCode(data.code)
    }

    return (
        <Fragment>
            <div className="m-25 m-b-10">
                <div className='header'> LIST OF AIRPORTS </div>
                <div>
                    <table>
                        <tbody>
                            <tr className='tableTitle'>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                            {
                                AirportListArray && AirportListArray.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.code}</td>
                                        <td>{data.name}</td>
                                        <td><Icon type="edit" onClick={() => handleClickEdit(data)} /></td>
                                        <td><Icon type="delete" onClick={() => handleDelete(data.id)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className='addAirport'>
                    <span>Code :
                        <Input className="m-l-15 m-r-15" type="text" value={code} onChange={(e) => onChangeCode(e)}></Input>
                    </span>
                    <span>Name :
                        <Input className="m-l-15" type="text" value={name} onChange={(e) => onChangeName(e)}></Input>
                    </span><br />
                    <div className="m-t-b-15">
                        <Button type='submit' onClick={createEditAirport} className='addBtn'>{!_.isNull(seletedId) ? 'Edit' : 'Add'}</Button>
                    </div>
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
    addAirport,
    deleteAirport,
    editAirport,
}

// connect our component with store
export default connect(mapStateToProps, mapDispatchToProps)(AirportListComponent)

AirportListComponent.propTypes = {
    getAirports: PropTypes.func,
    addAirport: PropTypes.func,
    deleteAirport: PropTypes.func,
    editAirport: PropTypes.func,
    AirportList: PropTypes.array,
}