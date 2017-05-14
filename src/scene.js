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

export const force = 0.00001

export class Scene {

  player: Player

  constructor() {
    this.player = {
      position: {x: 0, y: 0},
      velocity: {x: 0, y: 0},
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
    return [
      {type: 'circle', position: this.player.position}
    ]
  }
}
