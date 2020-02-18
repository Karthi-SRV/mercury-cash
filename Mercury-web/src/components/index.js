import React, { Fragment } from 'react'
import 'antd/dist/antd.less'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './styles.css'

const Mercury = (props) => {
    const onClick = () => {
        props.history.push('/airports')
    }
    const onRouteClick = () => {
        props.history.push('/routes')
    }
    const onPathClick = () => {
        props.history.push('/path')
    }
    return (
        <Fragment>
            <div className='header'>MERCURY CASH</div>
            <div className='displayButton'>
                <button onClick={onClick} className='btnStyle cursor'>List of airport</button>
                <button onClick={onRouteClick} className='btnStyle'>List of route</button>
                <button onClick={onPathClick} className='btnStyle'>Find path</button>
            </div>
        </Fragment>
    )
}

Mercury.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(Mercury)
