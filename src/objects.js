// @flow

export const TAU = 2 * Math.PI

export type Vector = {|
  x: number,
  y: number,
|}

export function equals(a: Vector, b: Vector, config: {epsilon?: number} = {}): boolean {
  if (config.epsilon) {
    const epsilon: number = config.epsilon
    const difference = {x: a.x - b.x, y: a.y - b.y}
    const res = normalize(difference)
    if (res.length < epsilon) {
      return true
    } else {
      return false
    }
  } else {
    return (a.x === b.x) && (a.y === b.y)
  }
}

export function add(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

export function minus(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
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

export function fromAngle(angle: number): Vector {
  return {x: Math.cos(angle), y: -Math.sin(angle)}
}
