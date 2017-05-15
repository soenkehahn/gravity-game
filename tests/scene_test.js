// @flow

import {expect} from 'chai'

import {Scene, Planet} from '../src/scene'
import type {Direction} from '../src/scene'
import type {Vector} from '../src/objects'

describe('scene', () => {

  let scene

  beforeEach(() => {
    scene = new Scene()
    scene.controlForce = 1
  })

  it('contains the player', () => {
    expect(scene.player.position).to.eql({x: 0, y: 0})
  })

  describe('step', () => {
    const expected = 500
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

    describe('planet gravity', () => {
      beforeEach(() => {
        scene.gravityConstant = 1
      })

      it('adds velocity according to planet gravity', () => {
        scene.planets.push(new Planet(1, 0, 1))
        scene.step([], 1)
        expect(scene.player.velocity).to.eql({x: 1, y: 0})
      })

      it('simulates gravity correctly with regard to time delta', () => {
        scene.planets.push(new Planet(1, 0, 1))
        scene.step([], 2)
        expect(scene.player.velocity).to.eql({x: 2, y: 0})
      })

      it('works diagonally', () => {
        scene.planets.push(new Planet(Math.sqrt(2), Math.sqrt(2), 1))
        scene.step([], 1)
        expect(scene.player.velocity).to.eql({x: Math.sqrt(2), y: Math.sqrt(2)})
      })

      it('works for multiple planets', () => {
        scene.planets.push(new Planet(1, 0, 1))
        scene.planets.push(new Planet(0, 1, 1))
        scene.step([], 1)
        expect(scene.player.velocity).to.eql({x: 1, y: 1})
      })

      it('increases gravity with the planet size', () => {
        scene.planets.push(new Planet(1, 0, 2))
        scene.step([], 1)
        expect(scene.player.velocity).to.eql({x: 2, y: 0})
      })

      it('allows to tweak a gravity constant', () => {
        scene.planets.push(new Planet(1, 0, 1))
        scene.gravityConstant = 0.3
        scene.step([], 1)
        expect(scene.player.velocity).to.eql({x: 0.3, y: 0})
      })

    })

    it('works for two keys pressed at once', () => {
        scene.step(['ArrowRight', 'ArrowUp'], 3000)
        const expected = 3000 * 3000
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
