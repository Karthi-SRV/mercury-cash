import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from "react-redux"
import configureMockStore from "redux-mock-store"

import RoutesList from './RoutesList'

const mockStore = configureMockStore();
const store = mockStore({});


configure({ adapter: new Adapter() })
const app = shallow(
    <Provider store={store}>
        <RoutesList
            getRoutes={jest.fn()}
            getAirports={jest.fn()}
            addRoute={jest.fn()}
            deleteRoute={jest.fn()}
            RouteList={[]}
            AirportList={[]}
        />
    </Provider>
)

describe("RoutesList", () => {
    it("should render my component without any error", () => {
        const app = shallow(
            <Provider store={store}>
                <RoutesList
                    getRoutes={jest.fn()}
                    getAirports={jest.fn()}
                    addRoute={jest.fn()}
                    deleteRoute={jest.fn()}
                    RouteList={[]}
                    AirportList={[]}
                />
            </Provider>
        )
        expect(app).toMatchSnapshot()
    })
})

describe("test the button", () => {
    const simulateClick = app.find('button').at(0).prop('onClick');
    // const simulateClick = app.find('button')
    console.log(simulateClick)
    simulateClick();
})

it('compare the snapshot to render with empty object', () => {
    expect(app).toMatchSnapshot()
})