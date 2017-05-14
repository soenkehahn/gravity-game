// @flow

import {expect} from 'chai'
import {mount} from 'enzyme'
require('jsdom-global')()

import {SceneComponent} from '../../src/ui/scene'
import type {Direction} from '../../src/scene'
import {mkScene} from '../../src/scene'

describe('ui/scene', () => {

  it('renders the player', () => {
    const wrapper = mount(<SceneComponent />)
    expect(wrapper.find('circle').props()).to.include({
      r: "1",
      cx: 0,
      cy: 0,
    })
  })

  it('relays keypresses to the scene and re-renders', async () => {
    const wrapper = mount(<SceneComponent />)
    simulateKeyDown('ArrowLeft')
    expect(wrapper.find('circle').props()).to.include({
      r: "1",
      cx: -1,
      cy: 0,
    })
  })

})

function simulateKeyDown(key: string) {
  const event = new KeyboardEvent('keydown', {
    key: key,
  })
  document.dispatchEvent(event)
}
