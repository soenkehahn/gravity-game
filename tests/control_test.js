// @flow

import {expect} from 'chai'

import {equals} from '../src/objects'
import {Controls} from '../src/control'
import {Scene} from '../src/scene'

describe('control', () => {

  let scene

  beforeEach(() => {
    scene = new Scene('empty')
  })

  describe('touch events', () => {
    it('returns a control vector when touching the screen', () => {
      const controls = new Controls()
      controls.update(new Set([{x: 1, y: 0}]))
      expect(controls.controlVector(scene)).to.eql({x: 1, y: 0})
    })

    it("doesn't return a control vector if there's no touch", () => {
      const controls = new Controls()
      controls.update(new Set())
      expect(controls.controlVector(scene)).to.eql(null)
    })

    it('works diagonally', () => {
      const controls = new Controls()
      controls.update(new Set([{x: 1, y: 1}]))
      const controlVector = controls.controlVector(scene)
      const sq = Math.sqrt(2) / 2
      if (!controlVector) {
        throw new Error('controlVector is null')
      } else {
        expect(equals(controlVector, {x: sq, y: sq}, {epsilon: 0.0001})).to.be.true
      }
    })

    it('returns the average of multiple touches', () => {
      const controls = new Controls()
      const touches = [
        {x: 1, y: 0},
        {x: 0, y: 1},
      ]
      controls.update(new Set(touches))
      const controlVector = controls.controlVector(scene)
      const sq = Math.sqrt(2) / 2
      if (!controlVector) {
        throw new Error('controlVector is null')
      } else {
        expect(equals(controlVector, {x: sq, y: sq}, {epsilon: 0.0001})).to.be.true
      }
    })

    it("returns the control vector relative to the player's position", () => {
      scene.player.position = {x: 1, y: 0}
      const controls = new Controls()
      const touches = [{x: 1, y: 1}]
      controls.update(new Set(touches))
      const controlVector = controls.controlVector(scene)
      const sq = Math.sqrt(2) / 2
      if (!controlVector) {
        throw new Error('controlVector is null')
      } else {
        expect(controlVector).to.eql({x: 0, y: 1})
      }
    })
  })
})
