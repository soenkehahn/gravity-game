// @flow

import {expect} from 'chai'

import {Scene, Planet, Attractor} from '../src/scene'
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
      {control: 'ArrowRight', expected: {x: expected, y: 0}},
      {control: 'ArrowLeft', expected: {x: -expected, y: 0}},
      {control: 'ArrowUp', expected: {x: 0, y: -expected}},
      {control: 'ArrowDown', expected: {x: 0, y: expected}},
    ]
    for (const test of tests) {
      it(`allows to change the characters velocity (${test.control})`, () => {
        scene.step([test.control], 500)
        expect(scene.player.velocity).to.eql(test.expected)
      })
    }

    it('moves the player when no keys are pressed', () => {
        scene.player.velocity.x = 3
        scene.step([], 3)
        expect(scene.player.position).to.eql({x: 9, y: 0})
    })

    describe('gravity', () => {
      beforeEach(() => {
        scene.gravityConstant = 1
      })

      describe('planet gravity', () => {
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
          const c = Math.sqrt(2) / 2
          scene.planets.push(new Planet(c, c, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: c, y: c})
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

        it('decreases with the square of the distance', () => {
          scene.planets.push(new Planet(2, 0, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 0.25, y: 0})
        })

        it('allows to tweak a gravity constant', () => {
          scene.planets.push(new Planet(1, 0, 1))
          scene.gravityConstant = 0.3
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 0.3, y: 0})
        })

      })

      describe('attractor gravity', () => {

        it("doesn't attract when space is not pushed", () => {
          scene.attractors.push(new Attractor(1, 0, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 0, y: 0})
        })

        it("does attract when space is pushed", () => {
          scene.attractors.push(new Attractor(1, 0, 1))
          scene.step(['Space'], 1)
          expect(scene.player.velocity).to.eql({x: 1, y: 0})
        })

      })
    })

    it('works for two keys pressed at once', () => {
        scene.step(['ArrowRight', 'ArrowUp'], 3000)
        const expected = 3000 * 3000
        expect(scene.player.position).to.eql({x: expected, y: -expected})
    })

  })

  describe('toObjects', () => {

    it('converts the player into an abstract object', () => {
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

    it('converts the attractors into abstract objects', () => {
      scene.attractors = [
        new Attractor(2, 3, 4)
      ]
      const objects = scene.toObjects()
      expect(objects[0]).to.eql({
        type: 'attractor',
        position: {x: 2, y: 3},
        radius: 4,
      })
    })

  })

})
