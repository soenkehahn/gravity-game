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

  afterEach(() => {
    requestAnimationFrameCallbacks = []
  })

  describe('when playing the empty level', () => {
    beforeEach(() => {
      wrapper = mount(<SceneComponent startLevel="empty" />)
      wrapper.state().scene.constants.controlForce = 1
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
      setPlanets([new Planet({x: 4, y: 5}, 10, 2.4)])
      expectElementWithProps(wrapper.find('circle'), {
        cx: 4,
        cy: 5,
        r: 2.4,
      })
    })

    it('uses a default influence size of 2', () => {
      setPlanets([new Planet({x: 4, y: 5}, 10)])
      expectElementWithProps(wrapper.find('circle'), {
        cx: 4,
        cy: 5,
        r: 2,
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
      expectElementWithProps(wrapper.find('circle'), {
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
        expectElementWithProps(wrapper.find('circle'), {
          cx: 2 * 3,
          cy: 0,
          r: 1,
        })
      })

      it('works through keypresses', () => {
        setPlanets([new Planet({x: 0, y: 0}, 0)])
        callRequestAnimationCallback(10000)
        simulateKeyEvent('keydown', 'ArrowLeft')
        callRequestAnimationCallback(10002)
        expectElementWithProps(wrapper.find('circle'), {
          cx: -(2 * 2),
          cy: 0,
          r: 1,
        })
      })
    })

    const restartKeys: Array<Control> = ['Enter', 'Space']
    for (const restartKey of restartKeys) {
      describe(`when pressing ${restartKey}`, () => {
        it('restarts the current level', () => {
          const state = wrapper.state()
          state.scene.player.position.x = 1
          wrapper.setState(state)

          callRequestAnimationCallback(10000)
          expect(wrapper.state().scene.player.position.x).to.eql(1)

          simulateKeyEvent('keydown', restartKey)
          callRequestAnimationCallback(10001)
          expect(wrapper.state().scene.player.position.x).to.eql(0)
        })
      })
    }

  })

  describe('when playing level 1', () => {
    beforeEach(() => {
      wrapper = mount(<SceneComponent startLevel={1} />)
    })

    describe('when a level is solved', () => {
      beforeEach(() => {
        callRequestAnimationCallback(10000)
        const state = wrapper.state()
        state.scene.state = 'success'
        wrapper.setState(state)
        callRequestAnimationCallback(10002)
      })

      it('advances the level when solved', () => {
        expect(wrapper.state().level).to.eql(2)
      })

      it("resets 'lastTime' when advancing to the next level", () => {
        expect(wrapper.state().lastTime).to.eql(null)
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
