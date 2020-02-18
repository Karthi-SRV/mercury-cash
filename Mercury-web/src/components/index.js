import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from 'antd'
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
                <Button onClick={onClick} className='btnStyle cursor'>List of airport</Button>
                <Button onClick={onRouteClick} className='btnStyle'>List of route</Button>
                <Button onClick={onPathClick} className='btnStyle'>Find path</Button>
            </div>
        </Fragment>
    )
}

Mercury.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(Mercury)
