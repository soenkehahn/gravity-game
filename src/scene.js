// @flow

import type { Vector } from "./objects";
import { equals, add, scale, difference, normalize } from "./objects";
import type { RealLevel } from "./real_levels";
import { getLevel } from "./real_levels";
import type { Controls } from "./control";

export class SceneObject {
  position: Vector;

  constructor(position: Vector) {
    this.position = position;
  }
}

export class SceneLine extends SceneObject {
  end: Vector;

  constructor(position: Vector, end: Vector) {
    super(position);
    this.end = end;
  }
}

export class SceneCircle extends SceneObject {
  radius: number;

  constructor(position: Vector, radius: number) {
    super(position);
    this.radius = radius;
  }
}

export class Player extends SceneCircle {
  velocity: Vector = { x: 0, y: 0 };

  constructor(position: Vector = { x: 0, y: 0 }) {
    super(position, 1);
  }
}

export class Planet extends SceneCircle {
  customStep: ?(timeDelta: number) => void = null;

  step(scene: Scene, timeDelta: number) {}
}

export class GravityPlanet extends Planet {
  influenceSize: number;

  isActive: boolean;

  constructor(
    position: Vector,
    radius: number,
    influenceSize: number = 2,
    isActive: boolean = true
  ) {
    super(position, radius);
    this.influenceSize = influenceSize;
    this.isActive = isActive;
  }

  step(scene: Scene, timeDelta: number) {
    const diff = difference(this.position, scene.player.position);
    const { direction: gravityDirection, length: distance } = normalize(diff);

    if (distance <= this.influenceSize) {
      if (this.isActive) {
        scene.planetInfluence = true;
      }

      if (distance !== 0) {
        const distanceScalar = distance;
        const scalar =
          timeDelta * this.radius * scene.constants.gravity * distanceScalar;
        const velocityChange = scale(gravityDirection, scalar);
        scene.player.velocity = add(scene.player.velocity, velocityChange);
      }

      if (this.isActive) {
        scene.player.velocity = scale(
          scene.player.velocity,
          Math.pow(1 - scene.constants.planetDrag, timeDelta)
        );
      }
    }
  }
}

export function newGravityPlanet(
  position: Vector,
  radius: number,
  influenceSize: number = 2
): GravityPlanet {
  return new GravityPlanet(position, radius, influenceSize, false);
}

export function newControlPlanet(
  position: Vector,
  radius: number,
  influenceSize: number = 2
): GravityPlanet {
  return new GravityPlanet(position, radius, influenceSize, true);
}

export class ForbiddenPlanet extends Planet {
  step(scene: Scene): void {
    const { length: distance } = normalize(
      difference(scene.player.position, this.position)
    );
    if (distance < 1 + this.radius) {
      scene.state = "game over";
    }
  }
}

export class EndPlanet extends Planet {
  step(scene: Scene): void {
    const { length: distance } = normalize(
      difference(scene.player.position, this.position)
    );
    if (distance < 1 + this.radius) {
      scene.state = "success";
    }
  }
}

export type Level = "empty" | "test" | RealLevel;

type Constants = {
  controlForce: number,
  gravity: number,
  planetDrag: number
};

export class Scene {
  constants: Constants = {
    controlForce: 0.00001,
    gravity: 0.00005,
    planetDrag: 0.0006
  };

  name: ?string;

  state: "playing" | "success" | "game over" = "playing";

  player: Player = new Player();

  planetInfluence: boolean = false;
  controlVector: ?Vector = null;

  planets: Array<Planet> = [];

  constructor(level: Level) {
    if (level === "empty") {
    } else if (level === "test") {
      this.planets.push(newControlPlanet({ x: 3, y: 4 }, 1));
    } else {
      getLevel(this, level);
    }
  }

  addObject(object: Planet) {
    this.planets.push(object);
  }

  addObjects(planets: Array<Planet>) {
    for (const object of planets) {
      this.addObject(object);
    }
  }

  step(controls: Controls, timeDelta: number): void {
    if (this.state === "playing") {
      this._customSteps(timeDelta);
      this.planetInfluence = false;
      this.controlVector = null;
      for (const object of this.planets) {
        object.step(this, timeDelta);
      }
      this._stepControlVelocity(controls, timeDelta);
      this._stepPosition(timeDelta);
    }
  }

  _customSteps(timeDelta: number) {
    for (const object of this.planets) {
      if (object.customStep) {
        object.customStep(timeDelta);
      }
    }
  }

  _stepControlVelocity(controls: Controls, timeDelta: number) {
    if (this.planetInfluence) {
      this.controlVector = controls.controlVector(this);
      if (this.controlVector) {
        this.player.velocity = add(
          this.player.velocity,
          scale(this.controlVector, this.constants.controlForce * timeDelta)
        );
      }
    }
  }

  _stepPosition(timeDelta: number) {
    this.player.position.x += this.player.velocity.x * timeDelta;
    this.player.position.y += this.player.velocity.y * timeDelta;
  }

  toSceneObjects(): Array<SceneObject> {
    let result = [];
    result = result.concat(this.planets);
    result.push(this.player);
    if (this.controlVector) {
      const line = new SceneLine(
        this.player.position,
        add(this.player.position, scale(this.controlVector, 3))
      );
      result.push(line);
    }
    return result;
  }
}
