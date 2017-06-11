// @flow

import type {Vector} from './objects'
import {equals, normalize} from './objects'

export type UIControl
  = 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown'
  | 'Space' | 'Enter' | 'F6' | 'F7'

export const allControls: Array<UIControl> = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Space',
  'Enter',
  'F6',
  'F7',
]

function castToUIControl(input: mixed): ?UIControl {
  const a: any = input
  if (allControls.includes(a)) {
    return a
  } else {
    return null
  }
}

export class Controls {

  _set: Set<UIControl>

  constructor(uiControls: ?Iterable<UIControl> = []) {
    this._set = new Set(uiControls)
  }

  update(event: KeyboardEvent): void {
    if (event.type === 'keydown') {
      const control = castToUIControl(event.code)
      if (control && (! event.repeat)) {
        event.preventDefault()
        this._set.add(control)
      }
    } else if (event.type === 'keyup') {
      const control = castToUIControl(event.code)
      if (control) {
        this._set.delete(control)
      }
    }
  }

  shouldSkipLevel(): boolean {
    return this._set.has('F7')
  }

  shouldGotoPreviousLevel(): boolean {
    return this._set.has('F6')
  }

  shouldRestartLevel(): boolean {
    return this._set.has('Enter') || this._set.has('Space')
  }

  controlVector(): ?Vector {
    let controlVector = {x: 0, y: 0}
    for (const control of this._set) {
      if (control === 'ArrowRight') {
        controlVector.x++
      } else if (control === 'ArrowLeft') {
        controlVector.x--
      } else if (control === 'ArrowUp') {
        controlVector.y--
      } else if (control === 'ArrowDown') {
        controlVector.y++
      }
    }
    if (equals(controlVector, {x: 0, y: 0})) {
      return null
    } else {
      return normalize(controlVector).direction
    }
  }
}
