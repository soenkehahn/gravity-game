// @flow

import type {Vector, Circle} from './objects'

export type Direction
  = 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown'

export function castToDirection(input: mixed): ?Direction {
  if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(input)) {
    return (input: any)
  } else {
    return null
  }
}

type Player  = {|
  position: Vector,
  velocity: Vector,
|}

export class Planet {

  position: Vector
  radius: number

  constructor(x: number, y: number, r: number) {
    this.position = {x, y}
    this.radius = r
  }
}

export type Level = 'empty' | 'test' | 1

export const force = 0.00001

export class Scene {

  player: Player
  planets: Array<Planet>

  constructor(level: ?Level = 'empty') {
    this.player = {
      position: {x: 0, y: 0},
      velocity: {x: 0, y: 0},
    }
    this.planets = []
    if (level === 'test') {
      this.planets.push(
        new Planet(3, 4, 2)
      )
    } else if (level === 1) {
      this.planets.push(
        new Planet(3, -4, 2)
      )
    }
  }

  step(directions: Array<Direction>, timeDelta: number): void {
    this._stepVelocity(directions, timeDelta)
    this._stepPosition(timeDelta)
  }

  _stepVelocity(directions: Array<Direction>, timeDelta: number) {
    for (const direction of directions) {
      if (direction === 'ArrowRight') {
        this.player.velocity.x += force * timeDelta
      } else if (direction === 'ArrowLeft') {
        this.player.velocity.x -= force * timeDelta
      } else if (direction === 'ArrowUp') {
        this.player.velocity.y -= force * timeDelta
      } else if (direction === 'ArrowDown') {
        this.player.velocity.y += force * timeDelta
      }
    }
  }

  _stepPosition(timeDelta: number) {
    this.player.position.x += this.player.velocity.x * timeDelta
    this.player.position.y += this.player.velocity.y * timeDelta
  }

  toObjects(): Array<Circle> {
    const result = []
    for (const planet of this.planets) {
      result.push({type: 'planet', position: planet.position, radius: planet.radius})
    }
    result.push({type: 'player', position: this.player.position, radius: 1})
    return result
  }
}
