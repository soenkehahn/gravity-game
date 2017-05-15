// @flow

export type Vector = {|
  x: number,
  y: number,
|}

export type ObjectType = 'player' | 'planet'

export type Circle = {|
  type: ObjectType,
  position: Vector,
  radius: number,
|}
