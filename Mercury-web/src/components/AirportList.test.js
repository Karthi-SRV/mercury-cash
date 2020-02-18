import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AirportList from './AirportList'

configure({ adapter: new Adapter() })
const app = shallow(<AirportList />)

describe("AirportList", () => {
    it("should render my component without any error", () => {
        const app = shallow(<AirportList />)
        expect(app).toMatchSnapshot()
    })
})

it('compare the snapshot to render with empty object', () => {
    expect(app).toMatchSnapshot()
})