// @flow

import {expect} from 'chai'
import {mount} from 'enzyme'
require('jsdom-global')()

import {SceneComponent} from '../../src/ui/scene'
import type {Direction} from '../../src/scene'
import {force, Planet} from '../../src/scene'

describe('ui/scene', () => {

  let requestAnimationFrameCallbacks = []

  function callRequestAnimationCallback(now) {
    expect(requestAnimationFrameCallbacks.length).to.eql(1)
    const callback = requestAnimationFrameCallbacks[0]
    requestAnimationFrameCallbacks = []
    callback(now)
  }

  global.requestAnimationFrame = (callback) => {
    requestAnimationFrameCallbacks.push(callback)
  }

  let wrapper

  function setPlanets(planets: Array<Planet>): void {
    const scene = wrapper.state().scene
    scene.planets = planets
    wrapper.setState({scene: scene})
  }

  beforeEach(() => {
    wrapper = mount(<SceneComponent />)
  })

  afterEach(() => {
    requestAnimationFrameCallbacks = []
  })

  it('renders the player', () => {
    expect(wrapper.find('circle').at(0).props()).to.include({
      cx: 0,
      cy: 0,
      r: 1,
    })
  })

  it('renders planets', () => {
    setPlanets([new Planet(4, 5, 10)])
    expect(wrapper.find('circle').at(1).props()).to.include({
      cx: 4,
      cy: 5,
      r: 10,
    })
  })

  it('allows to set the level in the props', () => {
    wrapper.setProps({level: 'test'})
    expect(wrapper.find('circle').at(1).props()).to.include({
      cx: 3,
      cy: 4,
      r: 2,
    })
  })

  describe('key presses', () => {
    it('remembers pressed arrow keys', () => {
      simulateKeyEvent('keydown', 'ArrowLeft')
      expect(wrapper.state().pressed).to.eql(['ArrowLeft'])
    })

    it('tracks released keys correctly', () => {
      simulateKeyEvent('keydown', 'ArrowLeft')
      simulateKeyEvent('keyup', 'ArrowLeft')
      expect(wrapper.state().pressed).to.eql([])
    })

    it('tracks more than one key correctly', () => {
      simulateKeyEvent('keydown', 'ArrowLeft')
      simulateKeyEvent('keydown', 'ArrowDown')
      simulateKeyEvent('keyup', 'ArrowLeft')
      expect(wrapper.state().pressed).to.eql(['ArrowDown'])
    })
  })

  it('pressing a key has no effect on the scene', () => {
    simulateKeyEvent('keydown', 'ArrowLeft')
    expect(wrapper.find('circle').props()).to.include({
      cx: 0,
      cy: 0,
      r: 1,
    })
  })

  describe('when calling requestAnimationFrame callbacks', () => {
    it('saves the last time at the first call', () => {
      callRequestAnimationCallback(10000)
      expect(wrapper.state().lastTime).to.eql(10000)
    })

    it('moves the player by the current velocity', () => {
      wrapper.state().scene.player.velocity.x = 3
      callRequestAnimationCallback(10000)
      callRequestAnimationCallback(10002)
      expect(wrapper.find('circle').props()).to.include({
        cx: 2 * 3,
        cy: 0,
        r: 1,
      })
    })

    it('works through keypresses', () => {
      callRequestAnimationCallback(10000)
      simulateKeyEvent('keydown', 'ArrowLeft')
      callRequestAnimationCallback(10002)
      expect(wrapper.find('circle').props()).to.include({
        cx: -(2 * force * 2),
        cy: 0,
        r: 1,
      })
    })
  })

})

function simulateKeyEvent(type: KeyboardEventTypes, key: Direction) {
  const event = new KeyboardEvent(type, {
    key: key,
  })
  document.dispatchEvent(event)
}
