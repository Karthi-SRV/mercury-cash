import React, { Fragment } from 'react'
import 'antd/dist/antd.less'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

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
            <div>MERCURY CASH</div>
            <button onClick={onClick}>List of airport</button>
            <button onClick={onRouteClick}>List of Route</button>
            <button onClick={onPathClick}>Find path</button>
        </Fragment>
    )
}

Mercury.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(Mercury)
