// @flow

import {expect} from 'chai'

import {add, scale, difference, normalize} from '../src/objects'

describe('objects', () => {
  describe('add', () => {
    it('adds componentwise', () => {
      const a = {x: 2, y: 3}
      const b = {x: 4, y: 5}
      expect(add(a, b)).to.eql({x: 6, y: 8})
    })
  })

  describe('scale', () => {
    it('multiplies both components', () => {
      const v = {x: 3, y: 7}
      expect(scale(v, 5)).to.eql({x: 15, y: 35})
    })
  })

  describe('difference', () => {
    it('computes the difference', () => {
      const a = {x: 1, y: 0}
      const b = {x: 0, y: 1}
      expect(difference(a, b)).to.eql({x: 1, y: -1})
    })
  })

  describe('normalize', () => {
    it('returns a vector of length 1 parallel to the input', () => {
      const v = {x: 1, y: 1}
      const c = Math.sqrt(2) / 2
      expect(normalize(v).direction.x).to.be.closeTo(c, 0.001)
      expect(normalize(v).direction.y).to.be.closeTo(c, 0.001)
    })

    it('returns the length', () => {
      const v = {x: 1, y: 1}
      expect(normalize(v).length).to.eql(Math.sqrt(2))
    })
  })
})
