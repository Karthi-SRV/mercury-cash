import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SourceDestination from './SourceDestination'

configure({ adapter: new Adapter() })
const app = shallow(<SourceDestination />)

describe("SourceDestination", () => {
    it("should render my component without any error", () => {
        const app = shallow(<SourceDestination />)
        expect(app).toMatchSnapshot()
    })
})

it('compare the snapshot to render with empty object', () => {
    expect(app).toMatchSnapshot()
})