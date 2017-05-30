// @flow

import {expect} from 'chai'

import {Scene, Player, Planet, EndPlanet} from '../src/scene'
import type {Vector} from '../src/objects'

describe('scene', () => {

  let scene

  beforeEach(() => {
    scene = new Scene('empty')
    scene.controlForce = 1
    scene.planetDrag = 0
  })

  it('contains the player', () => {
    expect(scene.player.position).to.eql({x: 0, y: 0})
  })

  it("doesn't crash for non-existing levels", () => {
    new Scene(-1)
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
      describe(test.control, () => {
        it('allows to change the characters velocity', () => {
          scene.planets = [new Planet({x: 0, y: 0}, 0)]
          scene.step([test.control], 500)
          expect(scene.player.velocity).to.eql(test.expected)
        })

        it("doesn't move the player when not under the influence of a planet", () => {
          scene.planets = []
          scene.step([test.control], 500)
          expect(scene.player.velocity).to.eql({x: 0, y: 0})
        })

        it("allows to specify the size of a planet's influence", () => {
          scene.planets = [new Planet({x: 0, y: 10}, 0, 12)]
          scene.step([test.control], 500)
          expect(scene.player.velocity).to.eql(test.expected)
        })
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
          scene.planets.push(new Planet({x: 1, y: 0}, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 1, y: 0})
        })

        it('simulates gravity correctly with regard to time delta', () => {
          scene.planets.push(new Planet({x: 1, y: 0}, 1))
          scene.step([], 2)
          expect(scene.player.velocity).to.eql({x: 2, y: 0})
        })

        it('works diagonally', () => {
          const c = Math.sqrt(2) / 2
          scene.planets.push(new Planet({x: c, y: c}, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: c, y: c})
        })

        it('works for multiple planets', () => {
          scene.planets.push(new Planet({x: 1, y: 0}, 1))
          scene.planets.push(new Planet({x: 0, y: 1}, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 1, y: 1})
        })

        it('increases gravity with the planet size', () => {
          scene.planets.push(new Planet({x: 1, y: 0}, 2))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 2, y: 0})
        })

        it('increases linearly with the distance', () => {
          scene.planets.push(new Planet({x: 1.5, y: 0}, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 1.5, y: 0})
        })

        it('exerts no force beyond a distance of 2', () => {
          scene.planets.push(new Planet({x: 2.1, y: 0}, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 0, y: 0})
        })

        it('exerts no force at a distance of 0', () => {
          scene.planets.push(new Planet({x: 0, y: 0}, 1))
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 0, y: 0})
        })

        it('allows to tweak a gravity constant', () => {
          scene.planets.push(new Planet({x: 1, y: 0}, 1))
          scene.gravityConstant = 0.3
          scene.step([], 1)
          expect(scene.player.velocity).to.eql({x: 0.3, y: 0})
        })

        describe('drag', () => {
          beforeEach(() => {
            scene.planetDrag = 0.1
          })

          it('applies a bit of drag', () => {
            scene.planets.push(new Planet({x: 1, y: 0}, 1))
            scene.step([], 1)
            expect(scene.player.velocity).to.eql({x: 0.9, y: 0})
          })

          it('increases drag with timeDelta correctly', () => {
            scene.planets.push(new Planet({x: 1, y: 0}, 1))
            scene.step([], 2)
            expect(scene.player.velocity).to.eql({x: 2 * Math.pow(0.9, 2), y: 0})
          })
        })
      })
    })

    it('works for two keys pressed at once', () => {
        scene.planets = [new Planet({x: 0, y: 0}, 0)]
        scene.step(['ArrowRight', 'ArrowUp'], 3000)
        const expected = 3000 * 3000
        expect(scene.player.position).to.eql({x: expected, y: -expected})
    })

  })

  describe('end planets', () => {
    it('switches to the success state when touching an end planet', () => {
      scene.endPlanets = [new EndPlanet({x: 1, y: 0}, 1)]
      expect(scene.state).to.eql('playing')
      scene.step(['ArrowRight'], 1)
      expect(scene.state).to.eql('success')
    })

    it("stays in state 'playing' if they two objects don't touch", () => {
      scene.endPlanets = [new EndPlanet({x: 2.1, y: 0}, 1)]
      scene.step([], 1)
      expect(scene.state).to.eql('playing')
    })

    it("switches to 'success' if the player and the end planet touch slightly", () => {
      scene.endPlanets = [new EndPlanet({x: 0.9, y: 0}, 1)]
      scene.step([], 1)
      expect(scene.state).to.eql('success')
    })

    it('works with different end planet radiuses', () => {
      scene.endPlanets = [new EndPlanet({x: 2.9, y: 0}, 2)]
      scene.step([], 1)
      expect(scene.state).to.eql('success')
    })
  })

  describe('toObjects', () => {

    it('returns the player', () => {
      const position = {x: 42, y: 23}
      scene.player.position = position
      const objects = scene.toObjects()
      const expected = new Player({x: 42, y: 23})
      expect(objects).to.eql([expected])
    })

    it('returns the end planets', () => {
      scene.endPlanets = [
        new EndPlanet({x: 1, y: 2}, 3)
      ]
      const objects = scene.toObjects()
      expect(objects[0]).to.eql(new EndPlanet({x: 1, y: 2}, 3))
    })

  })

})
