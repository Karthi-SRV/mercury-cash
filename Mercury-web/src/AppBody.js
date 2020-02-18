import React from 'react'
import 'antd/dist/antd.less'
import './style.less'
import { Route } from 'react-router-dom'

import routes from './routes'

const AppBody = () => {
    return (
        <div>
            <Route path="/" component={routes} />
        </div>
    )
}

export default AppBody
