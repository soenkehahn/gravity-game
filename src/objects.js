// @flow

export type Vector = {|
  x: number,
  y: number,
|}

export function equals(a: Vector, b: Vector): boolean {
  return (a.x === b.x) && (a.y === b.y)
}

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

export function normalize(vector: Vector): {direction: Vector, length: number} {
  const length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
  return {
    direction: scale(vector, 1 / length),
    length: length,
  }
}

export type UIObjectType = 'player' | 'planet' | 'attractor' | 'end planet'

export type UIObject = {|
  type: UIObjectType,
  position: Vector,
  radius: number,
|}
