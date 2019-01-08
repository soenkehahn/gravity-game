// @flow

import React from "react";
global.React = React;
import __hazTouch from "haz-touch";

import { Controls } from "../control";
import type { Level } from "../scene";
import {
  Scene,
  SceneObject,
  SceneLine,
  Player,
  GravityPlanet,
  ForbiddenPlanet,
  EndPlanet
} from "../scene";

type Props = {|
  startLevel: Level
|};

type State = {|
  hazTouch: boolean,
  level: Level,
  scene: Scene,
  controls: Controls,
  lastTime: ?number
|};

export class SceneComponent extends React.Component<Props, State> {
  state: State;

  svgRef: ?Node;

  constructor(props: Props) {
    super(props);
    this.state = this._newScene(props.startLevel);
  }

  _newScene(level: Level): State {
    return {
      hazTouch: __hazTouch,
      level: level,
      scene: new Scene(level),
      controls: new Controls(),
      lastTime: null
    };
  }

  componentDidMount() {
    this.addKeyboardEventListener("keydown", event => {
      this.state.controls.update(event);
      this.setState({ controls: this.state.controls });
    });

    this.addKeyboardEventListener("keyup", event => {
      this.state.controls.update(event);
      this.setState({ controls: this.state.controls });
    });

    this.addTouchEventListeners();

    requestAnimationFrame(now => this.loop(now));
  }

  addKeyboardEventListener(
    type: KeyboardEventTypes,
    callback: KeyboardEventListener
  ) {
    document.addEventListener(type, callback);
  }

  addTouchEventListeners() {
    if (this.svgRef) {
      const types = ["touchstart", "touchmove", "touchend"];
      for (const type of types) {
        this.svgRef.addEventListener(
          type,
          (event: TouchEvent) => {
            // warning: untested code
            event.preventDefault();
            const touches = [];
            for (const touch of event.touches) {
              touches.push({
                clientX: touch.clientX,
                clientY: touch.clientY
              });
            }
            this._handleTouchEvent(getViewBox(), touches);
          },
          { passive: false }
        );
      }
    }
  }

  _handleTouchEvent(
    viewBox: ViewBox,
    rawTouches: Array<{ clientX: number, clientY: number }>
  ) {
    const touches = rawTouches.map(rawTouch => ({
      x:
        (rawTouch.clientX * viewBox.svgWidth) / viewBox.windowWidth -
        viewBox.svgWidth / 2,
      y:
        (rawTouch.clientY * viewBox.svgHeight) / viewBox.windowHeight -
        viewBox.svgHeight / 2
    }));
    this.state.controls.update(new Set(touches));
    this.setState({ controls: this.state.controls });
  }

  loop(now: number) {
    if (!this.state.lastTime) {
      this.setState({ lastTime: now });
    } else {
      const scene = this.state.scene;
      scene.step(this.state.controls, now - this.state.lastTime);
      if (scene.state === "success" || this.state.controls.shouldSkipLevel()) {
        this._nextLevel();
      } else if (this.state.controls.shouldGotoPreviousLevel()) {
        this._previousLevel();
      } else if (this.state.controls.shouldRestartLevel()) {
        this._restartLevel();
      } else {
        this.setState({ scene: scene, lastTime: now });
      }
    }
    requestAnimationFrame(now => this.loop(now));
  }

  _restartLevel() {
    this.setState(this._newScene(this.state.level));
  }

  _nextLevel() {
    if (typeof this.state.level === "number") {
      this.setState(this._newScene(this.state.level + 1));
    }
  }

  _previousLevel() {
    if (typeof this.state.level === "number") {
      this.setState(this._newScene(this.state.level - 1));
    }
  }

  render() {
    return (
      <div style={{ cursor: "none" }}>
        {this._renderHeader()}
        <Render
          scene={this.state.scene}
          setSvgRef={node => {
            this.svgRef = node;
          }}
        />
        {this._renderRestartButton()}
      </div>
    );
  }

  _fontSize(): number {
    if (this.state.hazTouch) {
      return 80;
    } else {
      return 16;
    }
  }

  _renderHeader() {
    const style = {
      position: "absolute",
      margin: "10px",
      color: "white",
      fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      fontSize: this._fontSize()
    };
    let levelName: string;
    if (this.state.scene.name) {
      levelName = this.state.scene.name;
    } else {
      levelName = `untitled (${this.state.level})`;
    }
    let helpText = null;
    if (!this.state.hazTouch) {
      helpText = (
        <div>
          Controls: Arrow keys to move, Space to reset the level
          <br />
        </div>
      );
    }

    return (
      <div style={style}>
        {helpText}
        <div>{`Level: ${levelName}`}</div>
      </div>
    );
  }

  _renderRestartButton() {
    if (this.state.hazTouch) {
      const style = {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: "10px",
        color: "white",
        backgroundColor: "black",
        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
        fontSize: this._fontSize()
      };
      return (
        <div
          style={style}
          onClick={event => {
            this._restartLevel();
          }}
        >
          Restart
        </div>
      );
    }
  }
}

type RenderProps = {
  scene: Scene,
  setSvgRef: (Node | null) => void
};

class Render extends React.Component<RenderProps, void> {
  _renderUIObject(o: SceneObject, i: number): * {
    if (o instanceof Player) {
      return (
        <circle
          key={i}
          cx={o.position.x}
          cy={o.position.y}
          r={o.radius}
          fill="blue"
        />
      );
    } else if (o instanceof EndPlanet) {
      return (
        <circle
          key={i}
          cx={o.position.x}
          cy={o.position.y}
          r={o.radius}
          fill="green"
        />
      );
    } else if (o instanceof GravityPlanet) {
      let color = "gray";
      if (o.isActive) {
        color = "yellow";
      }
      return (
        <g key={i}>
          <circle
            key="planet"
            cx={o.position.x}
            cy={o.position.y}
            r={o.radius}
            fill={color}
          />
          <circle
            key="influence"
            cx={o.position.x}
            cy={o.position.y}
            r={o.influenceSize}
            fill={color}
            fillOpacity={0.7}
          />
        </g>
      );
    } else if (o instanceof ForbiddenPlanet) {
      return (
        <g key={i}>
          <circle
            key="planet"
            cx={o.position.x}
            cy={o.position.y}
            r={o.radius}
            fill="red"
          />
        </g>
      );
    } else if (o instanceof SceneLine) {
      const color = "yellow";
      return (
        <g>
          <line
            x1={o.position.x}
            y1={o.position.y}
            x2={o.end.x}
            y2={o.end.y}
            stroke={color}
            strokeWidth={0.3}
            strokeLinecap="round"
          />
          <circle cx={o.end.x} cy={o.end.y} r={0.5} fill={color} />
        </g>
      );
    }
    throw new Error("unknown SceneObject class: " + o.constructor.name);
  }

  render() {
    const objects = this.props.scene.toSceneObjects();
    const viewBox = getViewBox();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox.viewBox}
        width={viewBox.windowWidth}
        height={viewBox.windowHeight}
        ref={node => this.props.setSvgRef(node)}
      >
        <rect x={-100} y={-100} width={200} height={200} fill="black" />
        {objects.map((o, i) => this._renderUIObject(o, i))}
      </svg>
    );
  }
}

type ViewBox = {|
  windowWidth: number,
  windowHeight: number,
  svgWidth: number,
  svgHeight: number,
  viewBox: string
|};

export function getViewBox(): ViewBox {
  const ratio = window.innerWidth / window.innerHeight;
  let height, width;
  if (ratio > 1) {
    height = 40;
    width = Math.floor(height * ratio);
  } else {
    width = 40;
    height = Math.floor(width / ratio);
  }
  const minX = -width / 2;
  const minY = -height / 2;
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    svgWidth: width,
    svgHeight: height,
    viewBox: `${minX} ${minY} ${width.toString()} ${height.toString()}`
  };
}
