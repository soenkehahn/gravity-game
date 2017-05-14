// @flow

import type {Position, Circle} from './objects'

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
  position: Position,
|}

export type Scene = {|
  player: Player,
  step: Direction => void,
  toObjects: () => Array<Circle>,
|}

export function mkScene(): Scene {

  const scene = {
    player: {
      position: {
        x: 0,
        y: 0,
      },
    },
    step: direction => {
      if (direction === 'ArrowRight') {
        scene.player.position.x += 1
      } else if (direction === 'ArrowLeft') {
        scene.player.position.x -= 1
      } else if (direction === 'ArrowUp') {
        scene.player.position.y -= 1
      } else if (direction === 'ArrowDown') {
        scene.player.position.y += 1
      }
    },
    toObjects: () => {
      return [
        {type: 'circle', position: scene.player.position}
      ]
    }
  }

  return scene
}
