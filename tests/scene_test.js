// @flow

import {expect} from 'chai'

import {mkScene} from '../src/scene'
import type {Direction} from '../src/scene'
import type {Position} from '../src/objects'

describe('scene', () => {

  it('contains the player', () => {
    const scene = mkScene()
    expect(scene.player.position).to.eql({x: 0, y: 0})
  })

  describe('step', () => {
    const tests = [
      {direction: 'ArrowRight', expected: {x: 1, y: 0}},
      {direction: 'ArrowLeft', expected: {x: -1, y: 0}},
      {direction: 'ArrowUp', expected: {x: 0, y: -1}},
      {direction: 'ArrowDown', expected: {x: 0, y: 1}},
    ]
    for (const test of tests) {
      it(`allows to move the character ${test.direction}`, () => {
        const scene = mkScene()
        scene.step(test.direction)
        expect(scene.player.position).to.eql(test.expected)
      })
    }
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
