// @flow

import {add, scale, difference, normalize} from './objects'
import type {Vector, UIObject} from './objects'

export type Control
  = 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'Space'

export const allControls: Array<Control> = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Space'
]

export function castToControl(input: mixed): ?Control {
  const a: any = input
  if (allControls.includes(a)) {
    return a
  } else {
    return null
  }
}

type Player  = {|
  position: Vector,
  velocity: Vector,
|}

class SceneObject {
  position: Vector
  size: number

  constructor(position: Vector, size: number) {
    this.position = position
    this.size = size
  }
}

export class Planet extends SceneObject {
}

export class Attractor extends SceneObject {
}

export type Level =
  'empty' | 'test' |
  1

export class Scene {

  player: Player = {
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
  }
  planets: Array<Planet> = []
  attractors: Array<Attractor> = []

  controlForce: number = 0.00001
  gravityConstant: number = 0.00005

  constructor(level: ?Level = 'empty') {
    if (level === 'test') {
      this.planets.push(
        new Planet({x: 3, y: 4}, 1)
      )

    } else if (level === 1) {
      this.player.position = {x: -5, y: 0}
      this.planets = [
        new Planet({x: -5, y: 0}, 1),
      ]
    }

  }

  step(controls: Array<Control>, timeDelta: number): void {
    this._stepVelocity(controls, timeDelta)
    this._stepGravity(controls, timeDelta)
    this._stepPosition(timeDelta)
  }

  _stepVelocity(controls: Array<Control>, timeDelta: number) {
    for (const control of controls) {
      if (control === 'ArrowRight') {
        this.player.velocity.x += this.controlForce * timeDelta
      } else if (control === 'ArrowLeft') {
        this.player.velocity.x -= this.controlForce * timeDelta
      } else if (control === 'ArrowUp') {
        this.player.velocity.y -= this.controlForce * timeDelta
      } else if (control === 'ArrowDown') {
        this.player.velocity.y += this.controlForce * timeDelta
      }
    }
  }

  _stepGravity(controls: Array<Control>, timeDelta: number) {
    for (const planet of this.planets) {
      this._addGravityForObject(timeDelta, planet)
    }
    if (controls.includes('Space')) {
      for (const attractor of this.attractors) {
        this._addGravityForObject(timeDelta, attractor)
      }
    }
  }

  _addGravityForObject(timeDelta: number, object: {position: Vector, size: number}) {
    const diff = difference(object.position, this.player.position)
    const {direction: gravityDirection, length: distance} = normalize(diff)
    const distanceScalar = distance < 2 ? distance : 0
    const scalar = timeDelta * object.size * this.gravityConstant * distanceScalar
    const velocityChange = scale(gravityDirection, scalar)
    this.player.velocity = add(this.player.velocity, velocityChange)
  }

  _stepPosition(timeDelta: number) {
    this.player.position.x += this.player.velocity.x * timeDelta
    this.player.position.y += this.player.velocity.y * timeDelta
  }

  toObjects(): Array<UIObject> {
    const result = []
    for (const planet of this.planets) {
      result.push({type: 'planet', position: planet.position, radius: planet.size})
    }
    for (const attractor of this.attractors) {
      result.push({type: 'attractor', position: attractor.position, radius: attractor.size})
    }
    result.push({type: 'player', position: this.player.position, radius: 1})
    return result
  }
}
