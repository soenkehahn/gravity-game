// @flow

export type Vector = {|
  x: number,
  y: number,
|}

export type UIObjectType = 'player' | 'planet' | 'attractor'

export type UIObject = {|
  type: UIObjectType,
  position: Vector,
  radius: number,
|}
