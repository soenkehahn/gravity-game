// @flow

import type {Position, Circle} from './objects'

export type Direction
  = 'right' | 'left'

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
      if (direction === 'right') {
        scene.player.position.x += 1
      } else if (direction === 'left') {
        scene.player.position.x -= 1
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
