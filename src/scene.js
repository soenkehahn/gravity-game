// @flow

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

  constructor(x: number, y: number, r: number) {
    this.position = {x, y}
    this.size = r
  }
}

export class Planet extends SceneObject {
}

export class Attractor extends SceneObject {
}

export type Level = 'empty' | 'test' | 1

export class Scene {

  player: Player = {
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
  }
  planets: Array<Planet> = []
  attractors: Array<Attractor> = []

  controlForce: number = 0.00001
  gravityConstant: number = 0.00001

  constructor(level: ?Level = 'empty') {
    if (level === 'test') {
      this.planets.push(
        new Planet(3, 4, 2)
      )
    } else if (level === 1) {
      this.planets.push(
        new Planet(3, -4, 0.4)
      )
      this.attractors.push(
        new Attractor(-2, 5, 0.4)
      )
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
    const gravityVector = {
      x: object.position.x - this.player.position.x,
      y: object.position.y - this.player.position.y,
    }
    this.player.velocity.x += gravityVector.x * timeDelta * object.size * this.gravityConstant
    this.player.velocity.y += gravityVector.y * timeDelta * object.size * this.gravityConstant
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
