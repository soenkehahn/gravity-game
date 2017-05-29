// @flow

import type {Scene} from './scene'
import {Planet, EndPlanet} from './scene'

type RealLevel = 1

export function getLevel(scene: Scene, level: RealLevel) {
  if (level === 1) {
    scene.player.position = {x: -5, y: 0}
    scene.planets = [
      new Planet({x: -5, y: 0}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 5, y: 0}, 1),
    ]
  }
}
