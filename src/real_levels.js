// @flow

import type {Scene} from './scene'
import {Planet, EndPlanet} from './scene'
import {scale} from './objects'

export type RealLevel = number

export function getLevel(scene: Scene, level: RealLevel): void {
  const createLevel = levels[level - 1]
  if (createLevel) {
    createLevel(scene)
  }
}

const levels: Array<(Scene) => void> = [
  (scene) => {
    scene.player.position = {x: -5, y: 0}
    scene.planets = [
      new Planet({x: -5, y: 0}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 5, y: 0}, 1),
    ]
  },

  (scene) => {
    scene.player.position = {x: 0, y: -5}
    scene.planets = [
      new Planet({x: 0, y: -5}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 0, y: 5}, 1),
    ]
  },

  (scene) => {
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit, y: unit}
    scene.planets = [
      new Planet({x: unit, y: unit}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit, y: -unit}, 1),
    ]
  },

  (scene) => {
    scene.player.position = scale({x: -3, y: 16}, 0.5)
    scene.planets = [
      new Planet(scale({x: -3, y: 16}, 0.5), 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 3, y: -16}, 0.5), 1),
    ]
  },

  (scene) => {
    scene.player.position = scale({x: 16, y: -3}, 0.75)
    scene.planets = [
      new Planet(scale({x: 16, y: -3}, 0.75), 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: -16, y: 3}, 0.75), 1),
    ]
  },

  (scene) => {
    scene.player.position = {x: -10, y: 0}
    scene.planets = [
      new Planet({x: -10, y: 0}, 0.1),
      new Planet({x: 0, y: 1.8}, 0.4),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 10, y: 0}, 1),
    ]
  },

  (scene) => {
    scene.player.position = {x: -10, y: 0}
    scene.planets = [
      new Planet({x: -10, y: 0}, 0.1),
      new Planet({x: 0, y: 2.2}, 0.4, 2.3),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 10, y: 0}, 1),
    ]
  },

]
