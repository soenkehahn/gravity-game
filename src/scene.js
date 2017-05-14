// @flow

type Pos = {|
  x: number,
  y: number,
|}

type Player  = {|
  position: Pos,
|}

type Scene = {|
  player: Player,
|}

export function mkScene(): Scene {
  return {
    player: {
      position: {
        x: 0,
        y: 0,
      }
    }
  }
}
