// @flow

import type {Vector} from './objects'
import {equals, add, scale, difference, normalize} from './objects'
import type {RealLevel} from './real_levels'
import {getLevel} from './real_levels'

export type Control
  = 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'Space' | 'Enter'

export const allControls: Array<Control> = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Space',
  'Enter',
]

export function castToControl(input: mixed): ?Control {
  const a: any = input
  if (allControls.includes(a)) {
    return a
  } else {
    return null
  }
}

export class SceneObject {
  position: Vector
  radius: number

  constructor(position: Vector, radius: number) {
    this.position = position
    this.radius = radius
  }
}

export class Player extends SceneObject {

  velocity: Vector = {x: 0, y: 0}

  constructor(position: Vector = {x: 0, y: 0}) {
    super(position, 1)
  }
}

export class Planet extends SceneObject {

  influenceSize: number

  constructor(position: Vector, radius: number, influenceSize: number = 2) {
    super(position, radius)
    this.influenceSize = influenceSize
  }

  step(scene: Scene, timeDelta: number) {
    const diff = difference(this.position, scene.player.position)
    const {direction: gravityDirection, length: distance} = normalize(diff)
    if (distance < this.influenceSize) {
      scene.planetInfluence = true
    }
    if (distance === 0 || distance >= this.influenceSize) {
      return
    }
    const distanceScalar = distance
    const scalar = timeDelta * this.radius * scene.constants.gravity * distanceScalar
    const velocityChange = scale(gravityDirection, scalar)
    scene.player.velocity = add(scene.player.velocity, velocityChange)

    scene.player.velocity =
      scale(scene.player.velocity, Math.pow(1 - scene.constants.planetDrag, timeDelta))
  }

}

export class EndPlanet extends SceneObject {
  step(scene: Scene): void {
    const {length: distance} = normalize(difference(scene.player.position, this.position))
    if (distance < (1 + this.radius)) {
      scene.state = 'success'
    }
  }
}

export type Level =
  'empty' | 'test' | RealLevel

type Constants = {
  controlForce: number,
  gravity: number,
  planetDrag: number,
}

export class Scene {

  constants: Constants = {
    controlForce: 0.00001,
    gravity: 0.00005,
    planetDrag: 0.0008,
  }

  state: 'playing' | 'success' = 'playing'

  player: Player = new Player()
  planets: Array<Planet> = []
  planetInfluence: boolean = false
  endPlanets: Array<EndPlanet> = []

  constructor(level: Level) {
    if (level === 'empty') {
    } else if (level === 'test') {
      this.planets.push(
        new Planet({x: 3, y: 4}, 1)
      )
    } else {
      getLevel(this, level)
    }
  }

  step(controls: Set<Control>, timeDelta: number): void {
    this.planetInfluence = false
    this.planets.map((planet) => planet.step(this, timeDelta))
    this.endPlanets.map((endPlanet) => endPlanet.step(this))
    this._stepControlVelocity(controls, timeDelta)
    this._stepPosition(timeDelta)
  }

  _stepControlVelocity(controls: Set<Control>, timeDelta: number) {
    if (this.planetInfluence) {
      for (const control of controls) {
        if (control === 'ArrowRight') {
          this.player.velocity.x += this.constants.controlForce * timeDelta
        } else if (control === 'ArrowLeft') {
          this.player.velocity.x -= this.constants.controlForce * timeDelta
        } else if (control === 'ArrowUp') {
          this.player.velocity.y -= this.constants.controlForce * timeDelta
        } else if (control === 'ArrowDown') {
          this.player.velocity.y += this.constants.controlForce * timeDelta
        }
      }
    }
  }

  _stepPosition(timeDelta: number) {
    this.player.position.x += this.player.velocity.x * timeDelta
    this.player.position.y += this.player.velocity.y * timeDelta
  }

  toObjects(): Array<SceneObject> {
    let result = []
    result = result.concat(this.planets)
    result = result.concat(this.endPlanets)
    result.push(this.player)
    return result
  }
}
