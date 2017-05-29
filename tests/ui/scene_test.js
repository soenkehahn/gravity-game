// @flow

import {expect} from 'chai'
import {mount} from 'enzyme'
require('jsdom-global')()

import {SceneComponent} from '../../src/ui/scene'
import type {Control} from '../../src/scene'
import {Planet, allControls} from '../../src/scene'

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
    wrapper.state().scene.controlForce = 1
  })

  afterEach(() => {
    requestAnimationFrameCallbacks = []
  })

  it('renders the player', () => {
    expectElementWithProps(wrapper.find('circle'), {
      cx: 0,
      cy: 0,
      r: 1,
    })
  })

  it('renders planets', () => {
    setPlanets([new Planet({x: 4, y: 5}, 10)])
    expectElementWithProps(wrapper.find('circle'), {
      cx: 4,
      cy: 5,
      r: 10,
    })
  })

  it('renders influence spheres of planets', () => {
    setPlanets([new Planet({x: 4, y: 5}, 10)])
    expectElementWithProps(wrapper.find('circle'), {
      cx: 4,
      cy: 5,
      r: 2,
    })
  })

  it('allows to set the level in the props', () => {
    wrapper.setProps({level: 'test'})
    expectElementWithProps(wrapper.find('circle'), {
      cx: 3,
      cy: 4,
      r: 1,
    })
  })

  describe('key presses', () => {
    for (const controlKey of allControls) {
      it(`remembers pressed control keys (${controlKey})`, () => {
        simulateKeyEvent('keydown', controlKey)
        expect(wrapper.state().pressed).to.eql([controlKey])
      })
    }

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
        cx: -(2 * 2),
        cy: 0,
        r: 1,
      })
    })
  })

})

function simulateKeyEvent(type: KeyboardEventTypes, code: Control) {
  const event = new KeyboardEvent(type, {
    code: code,
  })
  document.dispatchEvent(event)
}

function expectElementWithProps(wrapper, object) {
  const candidates = []
  const found = wrapper.findWhere((e) => {
    const candidate = e.props()
    candidates.push(candidate)
    if (typeof(candidate) !== 'object') {
      return false
    }
    for (const key in object) {
      if (! candidate.hasOwnProperty(key)) {
        return false
      } else if (candidate[key] !== object[key]) {
        return false
      }
    }
    return true
  })
  if (found.length === 1) {
    return
  } else {
    const canditatesString = candidates.map((e) =>
      JSON.stringify(e)).join('\n        ')
    let message
    if (found.length === 0) {
      message = "Couldn't find element with the following properties";
    } else {
      message = "Found more than 1 element";
    }
    throw new Error(`
      ${message}:
        ${JSON.stringify(object)}
      candidates:
        ${canditatesString}
    `)
  }
}
