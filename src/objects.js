// @flow

export type Vector = {|
  x: number,
  y: number,
|}

export function add(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

export function scale(vector: Vector, scalar: number): Vector {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
  }
}

export function difference(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

export type UIObjectType = 'player' | 'planet' | 'attractor'

export type UIObject = {|
  type: UIObjectType,
  position: Vector,
  radius: number,
|}
