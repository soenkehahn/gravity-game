// @flow

import type {Scene} from './scene'
import {Planet, EndPlanet} from './scene'

export type RealLevel = number

export function getLevel(scene: Scene, level: RealLevel) {
  if (level === 1) {
    scene.player.position = {x: -5, y: 0}
    scene.planets = [
      new Planet({x: -5, y: 0}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 5, y: 0}, 1),
    ]
  } else if (level === 2) {
    scene.player.position = {x: 0, y: -5}
    scene.planets = [
      new Planet({x: 0, y: -5}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 0, y: 5}, 1),
    ]
  }
}
