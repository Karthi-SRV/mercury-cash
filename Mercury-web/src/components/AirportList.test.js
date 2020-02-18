import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from "react-redux"
import configureMockStore from "redux-mock-store"

import AirportList from './AirportList'

const mockStore = configureMockStore();
const store = mockStore({});

configure({ adapter: new Adapter() })
const app = shallow(
    <Provider store={store}>
        <AirportList
            getAirports={jest.fn()}
            addAirport={jest.fn()}
            deleteAirport={jest.fn()}
            editAirport={jest.fn()}
            AirportList={[]}
        />
    </Provider>
)

describe("AirportList", () => {
    it("should render my component without any error", () => {
        const app = shallow(
            <Provider store={store}>
                <AirportList
                    getAirports={jest.fn()}
                    addAirport={jest.fn()}
                    deleteAirport={jest.fn()}
                    editAirport={jest.fn()}
                    AirportList={[]}
                />
            </Provider>
        )
        expect(app).toMatchSnapshot()
    })
})

it('compare the snapshot to render with empty object', () => {
    expect(app).toMatchSnapshot()
})