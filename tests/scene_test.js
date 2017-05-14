// @flow

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

  describe('toObjects', () => {
    it('allows to convert the scene into a set of abstract objects', () => {
      const scene = mkScene()
      const position = {x: 42, y: 23}
      scene.player.position = position
      const objects = scene.toObjects()
      expect(objects).to.eql([
        {
          type: 'circle',
          position: position
        }
      ])
    })
  })

})
