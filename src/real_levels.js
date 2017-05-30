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

  (scene) => {
    scene.name = "swing"
    const unit = 4.5
    scene.player.position = {x: -unit, y: 0}
    scene.planets = [
      new Planet({x: -unit, y: 0}, 0.1, (unit * 2)),
    ]
    scene.endPlanets = [
      new EndPlanet({x: unit, y: 0}, 1),
    ]
  },

]
