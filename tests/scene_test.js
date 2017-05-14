// @flow

import {describe, it} from 'mocha'
import {expect} from 'chai'

import {mkScene} from '../src/scene'

describe('scene', () => {

  it('contains the player', () => {
    const scene = mkScene()
    expect(scene.player.position).to.eql({x: 0, y: 0})
  })

  describe('step', () => {
    it('allows to move the character right', () => {
      const scene = mkScene()
      scene.step('right')
      expect(scene.player.position).to.eql({x: 1, y: 0})
    })
  })

})
