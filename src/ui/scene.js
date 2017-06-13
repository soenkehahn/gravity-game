// @flow

const React = require('react')
global.React = React

import {Controls} from '../control'
import type {Level, SceneObject} from '../scene'
import {Scene, Player, GravityPlanet, ForbiddenPlanet, EndPlanet}
  from '../scene'

type Props = {|
  startLevel: Level
|}

type State = {|
  level: Level,
  scene: Scene,
  controls: Controls,
  lastTime: ?number,
|}

export class SceneComponent extends React.Component<void, Props, State> {

  state: State

  constructor(props: Props) {
    super(props)
    this.state = this._newScene(props.startLevel)
  }

  _newScene(level: Level): State {
    return {
      level: level,
      scene: new Scene(level),
      controls: new Controls(),
      lastTime: null,
    }
  }

  componentDidMount() {
    this.addKeyboardEventListener('keydown', event => {
      this.state.controls.update(event)
      this.setState({controls: this.state.controls})
    })

    this.addKeyboardEventListener('keyup', event => {
      this.state.controls.update(event)
      this.setState({controls: this.state.controls})
    })

    this.addTouchEventListeners()

    requestAnimationFrame((now) => this.loop(now))
  }

  addKeyboardEventListener(type: KeyboardEventTypes, callback: KeyboardEventListener) {
    document.addEventListener(type, callback)
  }

  addTouchEventListeners() {
    const types = ['touchstart', 'touchmove', 'touchend']
    for (const type of types) {
      document.addEventListener(type, (event: TouchEvent) => {
        // warning: untested code
        event.preventDefault()
        const touches = []
        for (const touch of event.touches) {
          touches.push({
            clientX: touch.clientX,
            clientY: touch.clientY,
          })
        }
        this._handleTouchEvent(getViewBox(), touches)
      }, {passive: false})
    }
  }

  _handleTouchEvent(viewBox: ViewBox, rawTouches: Array<{clientX: number, clientY: number}>) {
    const touches = rawTouches.map((rawTouch) =>
      ({
        x: (rawTouch.clientX * viewBox.svgWidth / viewBox.windowWidth) - viewBox.svgWidth / 2,
        y: (rawTouch.clientY * viewBox.svgHeight / viewBox.windowHeight) - viewBox.svgHeight / 2,
      }))
    this.state.controls.update(new Set(touches))
    this.setState({controls: this.state.controls})
  }

  loop(now: number) {
    if (!this.state.lastTime) {
      this.setState({lastTime: now})
    } else {
      const scene = this.state.scene
      scene.step(this.state.controls, now - this.state.lastTime)
      if (scene.state === 'success' || this.state.controls.shouldSkipLevel()) {
        this._nextLevel()
      } else if (this.state.controls.shouldGotoPreviousLevel()) {
        this._previousLevel()
      } else if (this.state.controls.shouldRestartLevel()) {
        this.setState(this._newScene(this.state.level))
      } else {
        this.setState({scene: scene, lastTime: now})
      }
    }
    requestAnimationFrame((now) => this.loop(now))
  }

  _nextLevel() {
    if (typeof(this.state.level) === 'number') {
      this.setState(this._newScene(this.state.level + 1))
    }
  }

  _previousLevel() {
    if (typeof(this.state.level) === 'number') {
      this.setState(this._newScene(this.state.level - 1))
    }
  }

  render() {
    const textStyle = {
      position: "absolute",
      margin: "10px",
      color: "white",
      'fontFamily': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    }
    let levelName: string
    if (this.state.scene.name) {
      levelName = this.state.scene.name
    } else {
      levelName = `untitled (${this.state.level})`
    }
    return <div style={{cursor: "none"}}>
      <div style={textStyle}>
        Controls: Arrow keys to move, Space to reset the level
        <br/>
        <div>{`Level: ${levelName}`}</div>
      </div>
      <Render scene={this.state.scene} />
    </div>
  }
}

class Render extends React.Component<void, {scene: Scene}, void> {

  _renderUIObject(o: SceneObject, i: number): * {
    if (o instanceof Player) {
      return <circle key={i}
        cx={o.position.x} cy={o.position.y}
        r={o.radius}
        fill="blue" />
    } else if (o instanceof EndPlanet) {
      return <circle key={i}
        cx={o.position.x} cy={o.position.y}
        r={o.radius}
        fill="green" />
    } else if (o instanceof GravityPlanet) {
      let color = "gray"
      if (o.isActive) {
        color = "yellow"
      }
      return <g key={i}>
        <circle key="planet"
          cx={o.position.x} cy={o.position.y}
          r={o.radius}
          fill={color} />
        <circle key="influence"
          cx={o.position.x} cy={o.position.y}
          r={o.influenceSize}
          fill={color}
          fillOpacity={0.7} />
      </g>
    } else if (o instanceof ForbiddenPlanet) {
      return <g key={i}>
        <circle key="planet"
          cx={o.position.x} cy={o.position.y}
          r={o.radius}
          fill="red" />
      </g>
    }
    throw new Error('unknown SceneObject class: ' + o.constructor.name)
  }

  render() {
    const objects = this.props.scene.toSceneObjects()
    const viewBox = getViewBox()
    return <svg
      xmlns="http://www.w3.org/2000/svg"

      viewBox={viewBox.viewBox}
      width={viewBox.windowWidth}
      height={viewBox.windowHeight}
      >

      <rect
        x={-100} y={-100}
        width={200} height={200}
        fill="black" />
      {objects.map((o, i) => this._renderUIObject(o, i))}
    </svg>
  }

}

type ViewBox = {|
  windowWidth: number,
  windowHeight: number,
  svgWidth: number,
  svgHeight: number,
  viewBox: string,
|}

export function getViewBox(): ViewBox {
  const ratio = window.innerWidth / window.innerHeight
  let height, width
  if (ratio > 1) {
    height = 40
    width = Math.floor(height * ratio)
  } else {
    width = 40
    height = Math.floor(width / ratio)
  }
  const minX = -width / 2
  const minY = -height / 2
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    svgWidth: width,
    svgHeight: height,
    viewBox: `${minX} ${minY} ${width.toString()} ${height.toString()}`,
  }
}
