import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import RoutesList from './RoutesList'

configure({ adapter: new Adapter() })
const app = shallow(<RoutesList />)

describe("RoutesList", () => {
    it("should render my component without any error", () => {
        const app = shallow(<RoutesList />)
        expect(app).toMatchSnapshot()
    })
})

it('compare the snapshot to render with empty object', () => {
    expect(app).toMatchSnapshot()
})