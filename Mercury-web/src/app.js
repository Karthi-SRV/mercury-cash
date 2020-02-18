/**
 * Root Component
 */
import PropTypes from 'prop-types'

import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Frontload } from 'react-frontload'
import AppBody from './AppBody'

const App = (props) => (
    <Provider store={props.store}>
        <BrowserRouter>
            <Frontload noServerRender>
                <AppBody />
            </Frontload>
        </BrowserRouter>
    </Provider>
)

App.propTypes = {
    store: PropTypes.object.isRequired,
}

export default App

