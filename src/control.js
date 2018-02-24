// @flow

import type { Vector } from "./objects";
import { equals, add, minus, normalize } from "./objects";
import { Scene } from "./scene";

export type UIControl =
  | "ArrowRight"
  | "ArrowLeft"
  | "ArrowUp"
  | "ArrowDown"
  | "Space"
  | "Enter"
  | "F6"
  | "F7";

export const allControls: Array<UIControl> = [
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "Space",
  "Enter",
  "F6",
  "F7"
];

function castToUIControl(input: mixed): ?UIControl {
  const a: any = input;
  if (allControls.includes(a)) {
    return a;
  } else {
    return null;
  }
}

export class Controls {
  _set: Set<UIControl>;

  _touches: Set<Vector>;

  constructor(uiControls: ?Iterable<UIControl> = []) {
    this._set = new Set(uiControls);
    this._touches = new Set();
  }

  update(event: KeyboardEvent | Set<Vector>): void {
    if (event instanceof KeyboardEvent) {
      if (event.type === "keydown") {
        const control = castToUIControl(event.code);
        if (control && !event.repeat) {
          event.preventDefault();
          this._set.add(control);
        }
      } else if (event.type === "keyup") {
        const control = castToUIControl(event.code);
        if (control) {
          this._set.delete(control);
        }
      }
    } else if (event instanceof Set) {
      this._touches = event;
    }
  }

  shouldSkipLevel(): boolean {
    return this._set.has("F7");
  }

  shouldGotoPreviousLevel(): boolean {
    return this._set.has("F6");
  }

  shouldRestartLevel(): boolean {
    return this._set.has("Enter") || this._set.has("Space");
  }

  controlVector(scene: Scene): ?Vector {
    let controlVector = { x: 0, y: 0 };
    for (const control of this._set) {
      if (control === "ArrowRight") {
        controlVector.x++;
      } else if (control === "ArrowLeft") {
        controlVector.x--;
      } else if (control === "ArrowUp") {
        controlVector.y--;
      } else if (control === "ArrowDown") {
        controlVector.y++;
      }
    }
    for (const touch of this._touches) {
      controlVector = add(minus(controlVector, scene.player.position), touch);
    }
    if (equals(controlVector, { x: 0, y: 0 })) {
      return null;
    } else {
      return normalize(controlVector).direction;
    }
  }
}
