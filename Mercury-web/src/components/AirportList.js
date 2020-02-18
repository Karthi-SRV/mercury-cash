import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as _ from 'lodash';
import { Icon } from 'antd'
import { getAirports, addAirport, deleteAirport, editAirport } from '../store/actions/AppActions'
import styles from './styles.css'

const AirportListComponent = (props) => {

    const { AirportList } = props
    const [AirportListArray, setAirportListArray] = useState([])
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [seletedId, setSeletedId] = useState(null)

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

    const createEditAirport = () => {
        !_.isNull(seletedId) ? props.editAirport({ name, code, id: seletedId }) : props.addAirport({ name, code })
    }

    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onChangeCode = (e) => {
        setCode(e.target.value)
    }

    const handleDelete = (id) => {
        props.deleteAirport(id)
    }

    const handleClickEdit = (data) => {
        setSeletedId(data.id)
        setName(data.name)
        setCode(data.code)
    }

    return (
        <Fragment>
            <div>
                <div className='header'> LIST OF AIRPORTS </div>
                <div>
                    <table>
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
                    </table>
                </div>
                <div className='addAirport'>
                    <span>Code:
            <input type="text" value={code} onChange={(e) => onChangeCode(e)} className='codeInput'></input>
                    </span>
                    <span>Name:
            <input type="text" value={name} onChange={(e) => onChangeName(e)}></input>
                    </span><br />
                    <button type='submit' onClick={createEditAirport} className='addBtn'>{!_.isNull(seletedId) ? 'Edit' : 'Add'}</button>
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