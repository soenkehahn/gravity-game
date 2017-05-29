// @flow

import type {Vector, UIObject} from './objects'
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

type Player = {|
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

  influenceSize: number

  constructor(position: Vector, size: number, influenceSize: number = 2) {
    super(position, size)
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
    const scalar = timeDelta * this.size * scene.gravityConstant * distanceScalar
    const velocityChange = scale(gravityDirection, scalar)
    scene.player.velocity = add(scene.player.velocity, velocityChange)
  }

}

export class EndPlanet extends SceneObject {
  step(scene: Scene): void {
    const {length: distance} = normalize(difference(scene.player.position, this.position))
    if (distance < (1 + this.size)) {
      scene.state = 'success'
    }
  }
}

export type Level =
  'empty' | 'test' | RealLevel

export class Scene {

  state: 'playing' | 'success' = 'playing'

  player: Player = {
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
  }
  planets: Array<Planet> = []
  planetInfluence: boolean = false
  endPlanets: Array<EndPlanet> = []

  controlForce: number = 0.00001
  gravityConstant: number = 0.00005

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

  step(controls: Array<Control>, timeDelta: number): void {
    this.planetInfluence = false
    this.planets.map((planet) => planet.step(this, timeDelta))
    this.endPlanets.map((endPlanet) => endPlanet.step(this))
    this._stepControlVelocity(controls, timeDelta)
    this._stepPosition(timeDelta)
  }

  _stepControlVelocity(controls: Array<Control>, timeDelta: number) {
    if (this.planetInfluence) {
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
  }

  _stepPosition(timeDelta: number) {
    this.player.position.x += this.player.velocity.x * timeDelta
    this.player.position.y += this.player.velocity.y * timeDelta
  }

  toObjects(): Array<UIObject> {
    const result = []
    for (const planet of this.planets) {
      result.push({type: 'planet', position: planet.position, radius: planet.size, influenceSize: planet.influenceSize})
    }
    for (const endPlanet of this.endPlanets) {
      result.push({type: 'end planet', position: endPlanet.position, radius: endPlanet.size})
    }
    result.push({type: 'player', position: this.player.position, radius: 1})
    return result
  }
}
