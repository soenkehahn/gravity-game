// @flow

import { expect } from "chai";
import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
require("jsdom-global")();

import type { UIControl } from "../../src/control";
import { allControls } from "../../src/control";
import { SceneComponent, getViewBox } from "../../src/ui/scene";
import type { Scene } from "../../src/scene";
import {
  SceneCircle,
  GravityPlanet,
  newControlPlanet,
  ForbiddenPlanet
} from "../../src/scene";

describe("ui/scene", () => {
  let requestAnimationFrameCallbacks = [];

  function callRequestAnimationCallback(now) {
    expect(requestAnimationFrameCallbacks.length).to.eql(1);
    const callback = requestAnimationFrameCallbacks[0];
    requestAnimationFrameCallbacks = [];
    callback(now);
  }

  global.requestAnimationFrame = callback => {
    requestAnimationFrameCallbacks.push(callback);
  };

  let wrapper;

  function addSceneCircles(gravityPlanets: Array<SceneCircle>): void {
    let scene = wrapper.state().scene;
    scene.addObjects(gravityPlanets);
    wrapper.setState({ scene: scene });
  }

  afterEach(() => {
    requestAnimationFrameCallbacks = [];
  });

  describe("getViewBox", () => {
    it("returns a viewBox filling the whole inner window", () => {
      window.innerWidth = 1000;
      window.innerHeight = 600;
      expect(getViewBox()).to.eql({
        windowWidth: 1000,
        windowHeight: 600,
        svgWidth: 66,
        svgHeight: 40,
        viewBox: "-33 -20 66 40"
      });
    });

    it("works for a ratio with width < height", () => {
      window.innerWidth = 400;
      window.innerHeight = 600;
      expect(getViewBox()).to.eql({
        windowWidth: 400,
        windowHeight: 600,
        svgWidth: 40,
        svgHeight: 60,
        viewBox: "-20 -30 40 60"
      });
    });
  });

  describe("when playing a level without a name", () => {
    beforeEach(() => {
      wrapper = mount(<SceneComponent startLevel={-1} />);
    });

    it("renders the level number", () => {
      const needle = wrapper.findWhere(
        e => e.text() === "Level: untitled (-1)"
      );
      expect(needle.length).to.eql(1);
    });
  });

  describe("when playing the empty level", () => {
    beforeEach(() => {
      wrapper = mount(<SceneComponent startLevel="empty" />);
      wrapper.state().scene.constants.controlForce = 1;
    });

    it("renders the player", () => {
      expectElementWithProps(wrapper.find("circle"), {
        cx: 0,
        cy: 0,
        r: 1
      });
    });

    describe("gravityPlanets", () => {
      it("renders gravityPlanets", () => {
        addSceneCircles([newControlPlanet({ x: 4, y: 5 }, 10)]);
        expectElementWithProps(wrapper.find("circle"), {
          cx: 4,
          cy: 5,
          r: 10
        });
      });

      it("renders influence spheres of gravityPlanets", () => {
        addSceneCircles([newControlPlanet({ x: 4, y: 5 }, 10, 2.4)]);
        expectElementWithProps(wrapper.find("circle"), {
          cx: 4,
          cy: 5,
          r: 2.4
        });
      });

      it("uses a default influence size of 2", () => {
        addSceneCircles([newControlPlanet({ x: 4, y: 5 }, 10)]);
        expectElementWithProps(wrapper.find("circle"), {
          cx: 4,
          cy: 5,
          r: 2
        });
      });

      it("renders forbidden planets", () => {
        addSceneCircles([new ForbiddenPlanet({ x: 5, y: 7 }, 6)]);

        expectElementWithProps(wrapper.find("circle"), {
          cx: 5,
          cy: 7,
          r: 6
        });
      });
    });

    describe("key presses", () => {
      for (const controlKey of allControls) {
        it(`remembers pressed control keys (${controlKey})`, () => {
          simulateKeyEvent("keydown", controlKey);
          expect([...wrapper.state().controls._set]).to.eql([controlKey]);
        });
      }

      it("tracks released keys correctly", () => {
        simulateKeyEvent("keydown", "ArrowLeft");
        simulateKeyEvent("keyup", "ArrowLeft");
        expect([...wrapper.state().controls._set]).to.eql([]);
      });

      it("tracks more than one key correctly", () => {
        simulateKeyEvent("keydown", "ArrowLeft");
        simulateKeyEvent("keydown", "ArrowDown");
        simulateKeyEvent("keyup", "ArrowLeft");
        expect([...wrapper.state().controls._set]).to.eql(["ArrowDown"]);
      });

      it("doesn't track keypresses twice", () => {
        simulateKeyEvent("keydown", "ArrowLeft");
        simulateKeyEvent("keydown", "ArrowLeft");
        expect([...wrapper.state().controls._set]).to.eql(["ArrowLeft"]);
      });

      it("doesn't track keypresses that are marked as 'repeat'", () => {
        simulateKeyEvent("keydown", "ArrowLeft", true);
        expect([...wrapper.state().controls._set]).to.eql([]);
      });
    });

    describe("touch events", () => {
      beforeEach(() => {
        const viewBox = {
          windowWidth: 600,
          windowHeight: 400,
          svgWidth: 60,
          svgHeight: 40,
          viewBox: "test-viewbox"
        };
        const component: SceneComponent = (wrapper.instance(): any);
        const touch = {
          type: "touchstart",
          clientX: 400,
          clientY: 200
        };
        component._handleTouchEvent(viewBox, [touch]);
      });

      it("relays touch events to the controls", () => {
        const state = wrapper.state();
        expect(state.controls.controlVector(state.scene)).to.eql({
          x: 1,
          y: 0
        });
      });

      it("transforms the touch event coordinates according to the viewbox", () => {
        expect([...wrapper.state().controls._touches]).to.eql([
          { x: 10, y: 0 }
        ]);
      });
    });

    it("pressing a key has no effect on the scene", () => {
      simulateKeyEvent("keydown", "ArrowLeft");
      expectElementWithProps(wrapper.find("circle"), {
        cx: 0,
        cy: 0,
        r: 1
      });
    });

    describe("requestAnimationFrame", () => {
      it("saves the last time at the first call", () => {
        callRequestAnimationCallback(10000);
        expect(wrapper.state().lastTime).to.eql(10000);
      });
    });

    it("moves the player by the current velocity", () => {
      wrapper.state().scene.player.velocity.x = 3;
      callRequestAnimationCallback(10000);
      callRequestAnimationCallback(10002);
      expectElementWithProps(wrapper.find("circle"), {
        cx: 2 * 3,
        cy: 0,
        r: 1
      });
    });

    it("moves the player through keypresses", () => {
      addSceneCircles([newControlPlanet({ x: 0, y: 0 }, 0)]);
      callRequestAnimationCallback(10000);
      simulateKeyEvent("keydown", "ArrowLeft");
      callRequestAnimationCallback(10002);
      expectElementWithProps(wrapper.find("circle"), {
        cx: -(2 * 2),
        cy: 0,
        r: 1
      });
    });

    const tests = [
      { arrow: "ArrowLeft", x1: -4, y1: 0, x2: -7, y2: 0 },
      { arrow: "ArrowUp", x1: 0, y1: -4, x2: 0, y2: -7 }
    ];
    for (const test of tests) {
      it(`shows an indicator for exerted force (${test.arrow})`, () => {
        addSceneCircles([newControlPlanet({ x: 0, y: 0 }, 0)]);
        callRequestAnimationCallback(10000);
        simulateKeyEvent("keydown", test.arrow);
        callRequestAnimationCallback(10002);
        expectElementWithProps(wrapper.find("line"), {
          x1: test.x1,
          y1: test.y1,
          x2: test.x2,
          y2: test.y2
        });
      });
    }

    it(`stops showing the indicator after the key is released`, () => {
      addSceneCircles([newControlPlanet({ x: 0, y: 0 }, 0)]);
      callRequestAnimationCallback(10000);
      simulateKeyEvent("keydown", "ArrowLeft");
      callRequestAnimationCallback(10002);
      simulateKeyEvent("keyup", "ArrowLeft");
      callRequestAnimationCallback(10004);
      expect(wrapper.find("line").length).to.eql(0);
    });

    it("doesn't show an indicator when no force is exerted", () => {
      addSceneCircles([newControlPlanet({ x: 0, y: 0 }, 0)]);
      callRequestAnimationCallback(10000);
      callRequestAnimationCallback(10002);
      expect(wrapper.find("line").length).to.eql(0);
    });

    const restartKeys: Array<UIControl> = ["Enter", "Space"];
    for (const restartKey of restartKeys) {
      describe(`when pressing ${restartKey}`, () => {
        it("restarts the current level", () => {
          const state = wrapper.state();
          state.scene.player.position.x = 1;
          wrapper.setState(state);

          callRequestAnimationCallback(10000);
          expect(wrapper.state().scene.player.position.x).to.eql(1);

          simulateKeyEvent("keydown", restartKey);
          callRequestAnimationCallback(10001);
          expect(wrapper.state().scene.player.position.x).to.eql(0);
        });
      });
    }

    const copy = "Controls: Arrow keys to move, Space to reset the level";

    const restartElement: () => ReactWrapper = () =>
      wrapper.find("div").findWhere(e => e.text() === "Restart");

    describe("when using a touch device", () => {
      beforeEach(() => {
        (wrapper.instance(): any).hazTouch = true;
        wrapper.update();
      });

      it("shows a reset button", () => {
        expect(restartElement().length).to.eql(1);
      });

      it("clicking the reset button resets the level", () => {
        const state = wrapper.state();
        state.scene.player.position.x = 1;
        wrapper.setState(state);

        callRequestAnimationCallback(10000);
        expect(wrapper.state().scene.player.position.x).to.eql(1);

        restartElement().simulate("click");
        callRequestAnimationCallback(10001);
        expect(wrapper.state().scene.player.position.x).to.eql(0);
      });

      it("doesn't show the keyboard help text", () => {
        expect(wrapper.text()).to.not.include(copy);
      });

      it("uses a big font size", () => {
        const component: SceneComponent = (wrapper.instance(): any);
        expect(component._fontSize()).to.eql(80);
      });
    });

    describe("when not using a touch device", () => {
      it("doesn't show a reset button", () => {
        expect(restartElement().length).to.eql(0);
      });

      it("uses a small font size", () => {
        const component: SceneComponent = (wrapper.instance(): any);
        expect(component._fontSize()).to.eql(16);
      });
    });

    describe("help OSD", () => {
      it("shows the keyboard help text", () => {
        expect(wrapper.text()).to.include(copy);
      });
    });
  });

  describe("when playing level 1", () => {
    beforeEach(() => {
      wrapper = mount(<SceneComponent startLevel={1} />);
      wrapper.state().scene.constants.controlForce = 1;
    });

    describe("when a level is solved", () => {
      beforeEach(() => {
        callRequestAnimationCallback(10000);
        const state = wrapper.state();
        state.scene.state = "success";
        wrapper.setState(state);
        callRequestAnimationCallback(10002);
      });

      it("advances the level", () => {
        expect(wrapper.state().level).to.eql(2);
      });

      it("resets 'lastTime' when advancing to the next level", () => {
        expect(wrapper.state().lastTime).to.eql(null);
      });
    });

    describe("when cheating", () => {
      it("F7 advances the level", () => {
        callRequestAnimationCallback(10000);
        simulateKeyEvent("keydown", "F7");
        callRequestAnimationCallback(10002);
        expect(wrapper.state().level).to.eql(2);
      });

      it("F6 goes back one level", () => {
        callRequestAnimationCallback(10000);
        simulateKeyEvent("keydown", "F7");
        callRequestAnimationCallback(10002);
        simulateKeyEvent("keyup", "F7");
        callRequestAnimationCallback(10003);
        simulateKeyEvent("keydown", "F6");
        callRequestAnimationCallback(10004);
        expect(wrapper.state().level).to.eql(1);
      });
    });
  });
});

function simulateKeyEvent(
  type: KeyboardEventTypes,
  code: UIControl,
  repeat: boolean = false
) {
  const event = new KeyboardEvent(type, {
    code: code,
    repeat: repeat
  });
  document.dispatchEvent(event);
}

function expectElementWithProps(wrapper, object) {
  const candidates = [];
  const found = wrapper.findWhere(e => {
    const candidate = e.props();
    candidates.push(candidate);
    if (typeof candidate !== "object") {
      return false;
    }
    for (const key in object) {
      if (!candidate.hasOwnProperty(key)) {
        return false;
      } else if (candidate[key] !== object[key]) {
        return false;
      }
    }
    return true;
  });
  if (found.length === 1) {
    return;
  } else {
    const canditatesString = candidates
      .map(e => JSON.stringify(e))
      .join("\n        ");
    let message;
    if (found.length === 0) {
      message = "Couldn't find element with the following properties";
    } else {
      message = "Found more than 1 element";
    }
    throw new Error(`
      ${message}:
        ${JSON.stringify(object)}
      candidates:
        ${canditatesString}
    `);
  }
}
