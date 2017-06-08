// @flow

import {expect} from 'chai'

import {Scene, Player, GravityPlanet, ControlPlanet, ForbiddenPlanet, EndPlanet} from '../src/scene'
import type {Vector} from '../src/objects'

describe('scene', () => {

  let scene: Scene

  beforeEach(() => {
    scene = new Scene('empty')
    scene.constants.controlForce = 1
    scene.constants.planetDrag = 0
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
          scene.gravityPlanets = [new ControlPlanet({x: 0, y: 0}, 0)]
          scene.step(new Set([test.control]), 500)
          expect(scene.player.velocity).to.eql(test.expected)
        })

        it("doesn't move the player when not under the influence of a planet", () => {
          scene.gravityPlanets = []
          scene.step(new Set([test.control]), 500)
          expect(scene.player.velocity).to.eql({x: 0, y: 0})
        })

        it("doesn't move the player when under the influence of a passive gravity planet", () => {
          scene.gravityPlanets = [new GravityPlanet({x: 0, y: 0}, 0)]
          scene.step(new Set([test.control]), 500)
          expect(scene.player.velocity).to.eql({x: 0, y: 0})
        })

        it("passive planets don't overwrite active planets", () => {
          scene.gravityPlanets = [
            new GravityPlanet({x: 0, y: 0}, 0),
            new ControlPlanet({x: 0, y: 0}, 0),
            new GravityPlanet({x: 0, y: 0}, 0),
          ]
          scene.step(new Set([test.control]), 500)
          expect(scene.player.velocity).to.eql(test.expected)
        })

        it("allows to specify the size of a planet's influence", () => {
          scene.gravityPlanets = [new ControlPlanet({x: 0, y: 10}, 0, 12)]
          scene.step(new Set([test.control]), 500)
          expect(scene.player.velocity).to.eql(test.expected)
        })
      })
    }

    it('moves the player when no keys are pressed', () => {
        scene.player.velocity.x = 3
        scene.step(new Set(), 3)
        expect(scene.player.position).to.eql({x: 9, y: 0})
    })

    describe('customStep', () => {

      function customMock(timeDelta: number): void {
        passedTimeDelta = timeDelta
      }

      function expectCustomStepCalled(): void {
        scene.step(new Set(), 42)
        expect(passedTimeDelta).to.eql(42)
      }

      let passedTimeDelta: number
      beforeEach(() => {
        passedTimeDelta = 0
      })

      it("executes player's customSteps for every step", () => {
        scene.player.customStep = customMock
        expectCustomStepCalled()
      })

      it("executes ControlPlanet's customSteps for every step", () => {
        const planet = new ControlPlanet({x: 0, y: 0}, 1)
        planet.customStep = customMock
        scene.gravityPlanets.push(planet)
        expectCustomStepCalled()
      })

      it("executes forbiddenPlanet's customSteps for every step", () => {
        const planet = new ForbiddenPlanet({x: 0, y: 0}, 1)
        planet.customStep = customMock
        scene.forbiddenPlanets.push(planet)
        expectCustomStepCalled()
      })

      it("executes forbiddenPlanet's customSteps for every step", () => {
        const planet = new EndPlanet({x: 0, y: 0}, 1)
        planet.customStep = customMock
        scene.endPlanets.push(planet)
        expectCustomStepCalled()
      })
    })

    describe('gravity', () => {
      beforeEach(() => {
        scene.constants.gravity = 1
      })

      it('adds velocity according to planet gravity', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 1))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 1, y: 0})
      })

      it('simulates gravity correctly with regard to time delta', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 1))
        scene.step(new Set(), 2)
        expect(scene.player.velocity).to.eql({x: 2, y: 0})
      })

      it('works diagonally', () => {
        const c = Math.sqrt(2) / 2
        scene.gravityPlanets.push(new GravityPlanet({x: c, y: c}, 1))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: c, y: c})
      })

      it('works for multiple planets', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 1))
        scene.gravityPlanets.push(new GravityPlanet({x: 0, y: 1}, 1))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 1, y: 1})
      })

      it('increases gravity with the planet size', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 2))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 2, y: 0})
      })

      it('increases linearly with the distance', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 1.5, y: 0}, 1))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 1.5, y: 0})
      })

      it('exerts no force beyond a distance of 2', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 2.1, y: 0}, 1))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 0, y: 0})
      })

      it('exerts no force at a distance of 0', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 0, y: 0}, 1))
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 0, y: 0})
      })

      it('allows to tweak a gravity constant', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 1))
        scene.constants.gravity = 0.3
        scene.step(new Set(), 1)
        expect(scene.player.velocity).to.eql({x: 0.3, y: 0})
      })

      describe('drag', () => {
        beforeEach(() => {
          scene.constants.planetDrag = 0.1
        })

        it('applies a bit of drag', () => {
          scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 1))
          scene.step(new Set(), 1)
          expect(scene.player.velocity).to.eql({x: 0.9, y: 0})
        })

        it('increases drag with timeDelta correctly', () => {
          scene.gravityPlanets.push(new GravityPlanet({x: 1, y: 0}, 1))
          scene.step(new Set(), 2)
          expect(scene.player.velocity).to.eql({x: 2 * Math.pow(0.9, 2), y: 0})
        })
      })
    })

    it('works for two keys pressed at once', () => {
      scene.gravityPlanets = [new ControlPlanet({x: 0, y: 0}, 0)]
      scene.step(new Set(['ArrowRight', 'ArrowUp']), 3000)
      const expected = Math.sqrt(Math.pow(3000, 2) / 2)
      expect(scene.player.velocity).to.eql({x: expected, y: -expected})
    })

  })

  describe('forbidden planets', () => {
    describe('when touching a forbidden planet', () => {
      beforeEach(() => {
        scene.forbiddenPlanets.push(new ForbiddenPlanet({x: 1.9, y: 0}, 1))
        scene.step(new Set(), 500)
      })

      it("sets the state to 'game over' when touching a forbidden planet", () => {
        expect(scene.state).to.eql('game over')
      })

      it('stops the simulation', () => {
        scene.gravityPlanets.push(new GravityPlanet({x: 0, y: 0}, 0))
        scene.step(new Set(['ArrowRight']), 500)
        expect(scene.player.position).to.eql({x: 0, y: 0})
      })
    })

    it("doesn't end the game when not touching a forbidden planet", () => {
      scene.forbiddenPlanets.push(new ForbiddenPlanet({x: 2.1, y: 0}, 1))
      scene.step(new Set(), 1)
      expect(scene.state).to.eql('playing')
    })
  })

  describe('end planets', () => {
    it('switches to the success state when touching an end planet', () => {
      scene.endPlanets = [new EndPlanet({x: 1, y: 0}, 1)]
      expect(scene.state).to.eql('playing')
      scene.step(new Set(['ArrowRight']), 1)
      expect(scene.state).to.eql('success')
    })

    it("stays in state 'playing' if they two objects don't touch", () => {
      scene.endPlanets = [new EndPlanet({x: 2.1, y: 0}, 1)]
      scene.step(new Set(), 1)
      expect(scene.state).to.eql('playing')
    })

    it("switches to 'success' if the player and the end planet touch slightly", () => {
      scene.endPlanets = [new EndPlanet({x: 0.9, y: 0}, 1)]
      scene.step(new Set(), 1)
      expect(scene.state).to.eql('success')
    })

    it('works with different end planet radiuses', () => {
      scene.endPlanets = [new EndPlanet({x: 2.9, y: 0}, 2)]
      scene.step(new Set(), 1)
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
