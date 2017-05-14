// @flow

type Pos = {|
  x: number,
  y: number,
|}

type Direction
  = 'right'

type Player  = {|
  position: Pos,
|}

type Scene = {|
  player: Player,
  step: Direction => void,
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
  }
  return scene
}
