// @flow

import type {Position, Circle} from './objects'

type Direction
  = 'right'

type Player  = {|
  position: Position,
|}

type Scene = {|
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
