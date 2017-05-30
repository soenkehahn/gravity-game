// @flow

import type {Scene} from './scene'
import {Planet, EndPlanet} from './scene'
import {scale} from './objects'

export type RealLevel = number

export function getLevel(scene: Scene, level: RealLevel): void {
  const createLevel = levels[level.toString()]
  if (createLevel) {
    createLevel(scene)
  }
}

const levels: {[string]: ((Scene) => void)} = {
  '1': (scene) => {
    scene.player.position = {x: -5, y: 0}
    scene.planets = [
      new Planet({x: -5, y: 0}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 5, y: 0}, 1),
    ]
  },

  '2': (scene) => {
    scene.player.position = {x: 0, y: -5}
    scene.planets = [
      new Planet({x: 0, y: -5}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 0, y: 5}, 1),
    ]
  },

  '3': (scene) => {
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit, y: unit}
    scene.planets = [
      new Planet({x: unit, y: unit}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit, y: -unit}, 1),
    ]
  },

  '4': (scene) => {
    scene.player.position = scale({x: -3, y: 16}, 0.5)
    scene.planets = [
      new Planet(scale({x: -3, y: 16}, 0.5), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 3, y: -16}, 0.5), 1),
    ]
  },

  '5': (scene) => {
    scene.player.position = scale({x: 16, y: -3}, 0.75)
    scene.planets = [
      new Planet(scale({x: 16, y: -3}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: -16, y: 3}, 0.75), 1),
    ]
  },

  '6': (scene) => {
    scene.player.position = scale({x: -5, y: 5}, 0.75)
    scene.planets = [
      new Planet(scale({x: -5, y: 5}, 0.75), 0.2),
      new Planet(scale({x: 5, y: 5}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 5, y: -5}, 0.75), 1),
    ]
  },

  '7': (scene) => {
    scene.player.position = scale({x: -10, y: 5}, 0.75)
    scene.planets = [
      new Planet(scale({x: -10, y: 5}, 0.75), 0.2),
      new Planet(scale({x: 0, y: 5}, 0.75), 0.2),
      new Planet(scale({x: 0, y: -5}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 10, y: -5}, 0.75), 1),
    ]
  },

  '8': (scene) => {
    scene.player.position = scale({x: -10, y: 10}, 0.75)
    scene.planets = [
      new Planet(scale({x: -10, y: 10}, 0.75), 0.2),
      new Planet(scale({x: -10, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: -10}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 10, y: -10}, 0.75), 1),
    ]
  },

  '9': (scene) => {
    scene.player.position = {x: -10, y: 0}
    scene.planets = [
      new Planet({x: -10, y: 0}, 0.1),
      new Planet({x: 0, y: 1.8}, 0.4),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 10, y: 0}, 1),
    ]
  },

  '10': (scene) => {
    scene.player.position = {x: -10, y: 0}
    scene.planets = [
      new Planet({x: -10, y: 0}, 0.1),
      new Planet({x: 0, y: 2.2}, 0.4, 2.3),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 10, y: 0}, 1),
    ]
  },
}
