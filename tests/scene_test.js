// @flow

import {expect} from 'chai'

import {Scene, force} from '../src/scene'
import type {Direction} from '../src/scene'
import type {Vector} from '../src/objects'

describe('scene', () => {

  let scene

  beforeEach(() => {
    scene = new Scene()
  })

  it('contains the player', () => {
    expect(scene.player.position).to.eql({x: 0, y: 0})
  })

  describe('step', () => {
    const expected = 500 * force
    const tests = [
      {direction: 'ArrowRight', expected: {x: expected, y: 0}},
      {direction: 'ArrowLeft', expected: {x: -expected, y: 0}},
      {direction: 'ArrowUp', expected: {x: 0, y: -expected}},
      {direction: 'ArrowDown', expected: {x: 0, y: expected}},
    ]
    for (const test of tests) {
      it(`allows to change the characters velocity (${test.direction})`, () => {
        scene.step([test.direction], 500)
        expect(scene.player.velocity).to.eql(test.expected)
      })
    }

    it('moves the player when no keys are pressed', () => {
        scene.player.velocity.x = 3
        scene.step([], 3)
        expect(scene.player.position).to.eql({x: 9, y: 0})
    })

    it('works for two keys pressed at once', () => {
        scene.step(['ArrowRight', 'ArrowUp'], 3000)
        const expected = 3000 * force * 3000
        expect(scene.player.position).to.eql({x: expected, y: -expected})
    })

  })

  describe('toObjects', () => {
    it('allows to convert the scene into a set of abstract objects', () => {
      const position = {x: 42, y: 23}
      scene.player.position = position
      const objects = scene.toObjects()
      expect(objects).to.eql([
        {
          type: 'player',
          position: position,
          radius: 1,
        }
      ])
    })
  })

})
