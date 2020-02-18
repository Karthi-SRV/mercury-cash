// LIBRARY
/*eslint-disable no-unused-vars*/
import React from 'react'
/*eslint-enable no-unused-vars*/
import { Route, Switch } from 'react-router-dom'

// COMPONENT
import AppBody from './components/index'
import AirportList from './components/AirportList'
import RoutesList from './components/RoutesList'
import SourceDestination from './components/SourceDestination'

const Routes = () => {
    return (
        <Switch>
            <Route exact component={AppBody} path='/'/>
            <Route exact component={AirportList} path='/airports' />
            <Route exact component={RoutesList} path='/routes' />
            <Route exact component={SourceDestination} path='/path' />
        </Switch>
    )
}

export default Routes
