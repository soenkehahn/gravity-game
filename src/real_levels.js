// @flow

import type {Scene} from './scene'
import {Planet, EndPlanet} from './scene'
import {add, scale} from './objects'

export type RealLevel = number

const TAU = 2 * Math.PI

export function getLevel(scene: Scene, level: RealLevel): void {
  const createLevel = levels[level - 1]
  if (createLevel) {
    createLevel(scene)
  }
}

const levels: Array<Scene => void> = [
  (scene) => {
    scene.name = "tutorial"
    scene.player.position = {x: -5, y: 0}
    scene.planets = [
      new Planet({x: -5, y: 0}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 5, y: 0}, 1),
    ]
  },

  (scene) => {
    scene.name = "tutorial 2"
    scene.player.position = {x: 0, y: -5}
    scene.planets = [
      new Planet({x: 0, y: -5}, 0.1),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 0, y: 5}, 1),
    ]
  },

  (scene) => {
    scene.name = "heavier"
    scene.player.position = {x: 5, y: 0}
    scene.planets = [
      new Planet({x: 5, y: 0}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -5, y: 0}, 1),
    ]
  },

  (scene) => {
    scene.name = "heavier 2"
    scene.player.position = {x: 0, y: 5}
    scene.planets = [
      new Planet({x: 0, y: 5}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: 0, y: -5}, 1),
    ]
  },

  (scene) => {
    scene.name = "45 degrees"
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit, y: unit}
    scene.planets = [
      new Planet({x: unit, y: unit}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit, y: -unit}, 1),
    ]
  },

  (scene) => {
    scene.name = "difficult angle"
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit / 2, y: unit}
    scene.planets = [
      new Planet({x: unit / 2, y: unit}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit / 2, y: -unit}, 1),
    ]
  },

  (scene) => {
    scene.name = "difficult angle 2"
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit / 2, y: unit * 1.5}
    scene.planets = [
      new Planet({x: unit / 2, y: unit * 1.5}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit / 2, y: -unit * 1.5}, 1),
    ]
  },

  (scene) => {
    scene.name = "difficult angle 3"
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit / 2, y: unit * 2}
    scene.planets = [
      new Planet({x: unit / 2, y: unit * 2}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit / 2, y: -unit * 2}, 1),
    ]
  },

  (scene) => {
    scene.name = "difficult angle 4"
    let unit = Math.sqrt(Math.pow(10.0, 2.0) / 2.0) / 2.0
    scene.player.position = {x: unit / 2, y: unit * 2.5}
    scene.planets = [
      new Planet({x: unit / 2, y: unit * 2.5}, 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet({x: -unit / 2, y: -unit * 2.5}, 1),
    ]
  },

  (scene) => {
    scene.name = "corners"
    scene.player.position = scale({x: -5, y: 5}, 0.75)
    scene.planets = [
      new Planet(scale({x: -5, y: 5}, 0.75), 0.1),
      new Planet(scale({x: 5, y: 5}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 5, y: -5}, 0.75), 1),
    ]
  },

  (scene) => {
    scene.name = "corners 2"
    scene.player.position = scale({x: -10, y: 5}, 0.75)
    scene.planets = [
      new Planet(scale({x: -10, y: 5}, 0.75), 0.1),
      new Planet(scale({x: 0, y: 5}, 0.75), 0.2),
      new Planet(scale({x: 0, y: -5}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 10, y: -5}, 0.75), 1),
    ]
  },

  (scene) => {
    scene.name = "corners 3"
    scene.player.position = scale({x: -10, y: 10}, 0.75)
    scene.planets = [
      new Planet(scale({x: -10, y: 10}, 0.75), 0.1),
      new Planet(scale({x: -10, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: -10}, 0.75), 0.2),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 10, y: -10}, 0.75), 1),
    ]
  },

  (scene) => {
    scene.name = "corners 4"
    scene.player.position = scale({x: -10, y: 10}, 0.75)
    scene.planets = [
      new Planet(scale({x: -10, y: 10}, 0.75), 0.1),
      new Planet(scale({x: -10, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: -10}, 0.75), 0.3),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 10, y: -10}, 0.75), 1),
    ]
  },

  (scene) => {
    scene.name = "corners 5"
    scene.player.position = scale({x: -10, y: 10}, 0.75)
    scene.planets = [
      new Planet(scale({x: -10, y: 10}, 0.75), 0.1),
      new Planet(scale({x: -10, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: 0}, 0.75), 0.2),
      new Planet(scale({x: 0, y: -10}, 0.75), 0.5),
    ]
    scene.endPlanets = [
      new EndPlanet(scale({x: 10, y: -10}, 0.75), 1),
    ]
  },

  mkSwing('swing', () => 0),
  mkSwing('swing 2', () => TAU / 4),
  mkSwing('swing 3', () => TAU / 8),
  mkSwing('swing 4', () => TAU / 16),
  mkSwing('swing', (timeDelta) => 0.15 * (timeDelta / 1000) % TAU),

  (scene) => {
    scene.name = "slope"
    const unit = 4
    scene.player.position = {x: unit * -5, y: unit * 3}
    scene.planets = [
      new Planet({x: unit * -5, y: unit * 3}, 0.4),
    ]
    for (let x = -4; x < 5; x++) {
      scene.planets.push(
        new Planet({x: unit * x, y: unit * - x * 3 / 5}, 0.1),
      )
    }
    scene.endPlanets = [
      new EndPlanet({x: unit * 5, y: unit * -3}, 1),
    ]
  },

]

function mkSwing(name, mkAngle: (number) => number) {
  return (scene) => {
    scene.name = name
    const unit = 9
    const origin = () => ({x: -(unit / 2), y: 0})
    scene.player.position = origin()
    scene.planets = [
      new Planet(origin(), 0.1, unit),
    ]

    let phase = 0
    const endPlanet = new EndPlanet({x: 0, y: 0}, 1)
    scene.customStep = (timeDelta) => {
      phase += timeDelta
      const angle = mkAngle(phase)
      endPlanet.position =
        add(origin(), scale({x: Math.cos(angle), y: -Math.sin(angle)}, unit))
    }
    scene.endPlanets = [endPlanet]
  }
}
