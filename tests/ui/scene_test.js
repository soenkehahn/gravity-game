// @flow

import {expect} from 'chai'
import {mount} from 'enzyme'
require('jsdom-global')()

import {SceneComponent} from '../../src/ui/scene'
import {mkScene} from '../../src/scene'

describe('ui/scene', () => {

  it('renders the player', () => {
    const scene = mkScene()
    scene.step('left')
    const sceneComponent = <SceneComponent scene={scene}/>
    const wrapper = mount(sceneComponent)
    expect(wrapper.find('circle').props()).to.include({
      r: "1",
      cx: -1,
      cy: 0,
    })
  })

})
