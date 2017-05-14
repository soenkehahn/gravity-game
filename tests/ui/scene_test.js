// @flow

import {expect} from 'chai'

import {Scene} from '../../src/ui/scene'
import {render} from 'enzyme'

describe('ui/scene', () => {
  it('displays "hello world"', () => {
    const wrapper = render(<Scene />)
    console.log(wrapper.text())
    expect(wrapper.text()).to.eql('hello world')
  })
})
